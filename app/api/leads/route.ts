import { NextResponse } from "next/server";
import { clientConfig } from "@/config/client";
import { isRoofingNeed, qualifyLead } from "@/lib/qualification";

type LeadRequest = Record<string, unknown>;

function readString(body: LeadRequest, key: string): string {
  return typeof body[key] === "string" ? body[key].trim() : "";
}

export async function POST(request: Request) {
  let body: LeadRequest;

  try {
    body = await request.json() as LeadRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 });
  }

  const homeowner = readString(body, "homeowner") === "yes";
  const need = readString(body, "need");
  const zip = readString(body, "zip");
  const phone = readString(body, "phone");
  const name = readString(body, "name");

  if (!name || !zip || !phone || !isRoofingNeed(need)) {
    return NextResponse.json({ ok: false, error: "Complete every required demo field." }, { status: 422 });
  }

  const qualification = qualifyLead(
    { homeowner, need, zip, phone },
    { serviceAreaZips: clientConfig.serviceAreaZips }
  );

  // Mock mode only: intentionally do not persist or route contact information.
  // A future adapter can store the normalized payload and attribution fields.
  return NextResponse.json({
    ok: true,
    id: `demo_${crypto.randomUUID()}`,
    mode: "mock",
    qualification
  });
}
