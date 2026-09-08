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
