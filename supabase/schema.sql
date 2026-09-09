create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  market text not null default 'Houston, TX',
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  created_at timestamptz not null default now(),
  homeowner boolean,
  need text,
  zip text,
  roof_age text,
  name text,
  phone text,
  email text,
  gclid text,
  gbraid text,
  stage text not null default 'new',
  estimated_value numeric,
  won_value numeric
);

create table if not exists campaign_daily_metrics (
  id bigint generated always as identity primary key,
  client_id uuid references clients(id) on delete cascade,
  day date not null,
  campaign_id text not null,
  campaign_name text not null,
  spend numeric not null default 0,
  clicks int not null default 0,
  leads int not null default 0,
  qualified_leads int not null default 0,
  booked_inspections int not null default 0,
  converted_leads int not null default 0,
  conversion_value numeric not null default 0,
  unique(client_id, day, campaign_id)
);

create table if not exists analyst_recommendations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  created_at timestamptz not null default now(),
  severity text not null,
  action_type text not null,
  rationale text not null,
  evidence jsonb not null default '{}'::jsonb,
  status text not null default 'proposed'
);

create table if not exists google_ads_change_audit (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  proposal_id text not null,
  occurred_at timestamptz not null default now(),
  actor text not null,
  action_type text not null,
  resource_type text not null,
  resource_id text,
  previous_value jsonb,
  new_value jsonb,
  reason text not null,
  supporting_metrics jsonb not null default '{}'::jsonb,
  confidence text not null,
  risk text not null,
  status text not null,
  policy_reasons jsonb not null default '[]'::jsonb,
  approval jsonb,
  external_request_id text,
  error text
);

create or replace function prevent_google_ads_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'google_ads_change_audit is append-only';
end;
$$;

drop trigger if exists google_ads_change_audit_append_only on google_ads_change_audit;
create trigger google_ads_change_audit_append_only
before update or delete on google_ads_change_audit
for each row execute function prevent_google_ads_audit_mutation();
