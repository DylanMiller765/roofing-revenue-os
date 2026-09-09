import { describe, expect, it } from "vitest";
import { POST } from "./route";

const lead = {
	homeowner: "yes",
	need: "repair",
	zip: "77008",
	phone: "7135550184",
	name: "Demo Homeowner",
};
const request = (body: unknown) =>
	new Request("http://localhost/api/leads", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

describe("mock intake boundary", () => {
	it.each([null, [], 12, "text"])(
		"rejects non-object JSON without crashing",
		async (body) => {
			expect((await POST(request(body))).status).toBe(400);
		},
	);
	it("handles malformed JSON", async () => {
		expect(
			(
				await POST(
					new Request("http://localhost/api/leads", {
						method: "POST",
						body: "{",
					}),
				)
			).status,
		).toBe(400);
	});
	it.each([
		{ ...lead, phone: "1111111111" },
		{ ...lead, zip: "bad" },
		{ ...lead, homeowner: "" },
		{ ...lead, need: "insurance payout" },
		{ ...lead, name: " " },
	])("rejects invalid intake data", async (body) => {
		expect((await POST(request(body))).status).toBe(422);
	});
	it("preserves only source fields and never echoes personal data", async () => {
		const response = await POST(
			request({
				...lead,
				gclid: "test-click",
				gbraid: "test-braid",
				utm_source: "google",
				utm_medium: "cpc",
				utm_campaign: "repair",
				utm_term: "roof repair",
				utm_content: "rsa-a",
				unrelated: "discard",
			}),
		);
		const result = await response.json();
		expect(result).toMatchObject({
			mode: "mock",
			qualification: { qualified: true },
			attribution: {
				gclid: "test-click",
				gbraid: "test-braid",
				utm_source: "google",
				utm_medium: "cpc",
				utm_campaign: "repair",
				utm_term: "roof repair",
				utm_content: "rsa-a",
			},
		});
		expect(result).not.toHaveProperty("phone");
		expect(result).not.toHaveProperty("name");
		expect(result.attribution).not.toHaveProperty("unrelated");
	});
	it("accepts valid contact input while distinguishing business qualification", async () => {
		const result = await (
			await POST(request({ ...lead, homeowner: "no", zip: "78701" }))
		).json();
		expect(result.qualification).toEqual({
			qualified: false,
			reasons: ["not_homeowner", "outside_service_area"],
		});
	});
});
