import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const lead = await request.json();
  // MVP stub only. Production: validate, persist, route, preserve GCLID/GBRAID,
  // trigger notifications, and update the CRM lead journey.
  return NextResponse.json({ ok: true, received: lead, id: `demo_${Date.now()}` });
}
