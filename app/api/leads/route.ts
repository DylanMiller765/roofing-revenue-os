import { NextResponse } from "next/server";
import { clientConfig } from "@/config/client";
import { extractAttribution } from "@/lib/attribution";
import {
	isReachablePhone,
	isRoofingNeed,
	qualifyLead,
} from "@/lib/qualification";

export async function POST(request: Request) {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return NextResponse.json(
			{ ok: false, error: "Request body must be valid JSON." },
			{ status: 400 },
		);
	}
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
		return NextResponse.json(
			{ ok: false, error: "Request body must be a JSON object." },
			{ status: 400 },
		);
	}
	const body = payload as Record<string, unknown>;
	const read = (key: string) =>
		typeof body[key] === "string" ? body[key].trim() : "";
	const homeowner = read("homeowner");
	const need = read("need");
	const zip = read("zip");
	const phone = read("phone");
	const name = read("name");
	if (
		!name ||
		name.length > 100 ||
		!/^\d{5}$/.test(zip) ||
		!isRoofingNeed(need) ||
		!["yes", "no"].includes(homeowner)
	) {
		return NextResponse.json(
			{
				ok: false,
				error:
					"Enter your name, a five-digit ZIP, homeowner status and a roof concern.",
			},
			{ status: 422 },
		);
	}
	if (!isReachablePhone(phone) || phone.length > 25) {
		return NextResponse.json(
			{
				ok: false,
				error:
					"Enter a valid 10-digit US phone number, including the area code.",
			},
			{ status: 422 },
		);
	}
	const qualification = qualifyLead(
		{ homeowner: homeowner === "yes", need, zip, phone },
		{ serviceAreaZips: clientConfig.serviceAreaZips },
	);
	// Mock boundary: echo allowlisted attribution for the receipt, never persist or route contact data.
	return NextResponse.json({
		ok: true,
		id: `demo_${crypto.randomUUID()}`,
		mode: "mock",
		qualification,
		attribution: extractAttribution({ get: read }),
	});
}
