import { describe, expect, it } from "vitest";
import { extractAttribution } from "./attribution";

describe("lead attribution", () => {
	it("preserves UTM values plus Google click identifiers", () => {
		const params = new URLSearchParams(
			"utm_source=google&utm_medium=cpc&utm_campaign=storm&gclid=click-123&gbraid=braid-456",
		);

		expect(extractAttribution(params)).toEqual({
			utm_source: "google",
			utm_medium: "cpc",
			utm_campaign: "storm",
			gclid: "click-123",
			gbraid: "braid-456",
		});
	});

	it("drops blank values and unrelated query parameters", () => {
		const params = new URLSearchParams(
			"utm_source=%20%20&phone=7135550100&ref=partner",
		);
		expect(extractAttribution(params)).toEqual({});
	});
});

import {
	attributionMaxAge,
	attributionSessionKey,
	captureSessionAttribution,
} from "./attribution";

function memoryStorage() {
	const values = new Map<string, string>();
	return {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
		removeItem: (key: string) => {
			values.delete(key);
		},
	};
}

describe("source continuity", () => {
	it("keeps source across untagged navigation without retaining personal query fields", () => {
		const storage = memoryStorage();
		captureSessionAttribution(
			"?gclid=one&utm_source=google&phone=private",
			storage,
			100,
		);
		expect(captureSessionAttribution("?intent=repair", storage, 200)).toEqual({
			gclid: "one",
			utm_source: "google",
		});
	});
	it("replaces the whole attribution group for a new tagged visit", () => {
		const storage = memoryStorage();
		captureSessionAttribution("?gclid=old&utm_source=google", storage, 100);
		expect(captureSessionAttribution("?utm_source=new", storage, 200)).toEqual({
			utm_source: "new",
		});
		expect(captureSessionAttribution("", storage, 300)).not.toHaveProperty(
			"gclid",
		);
	});
	it("expires a stored source after 30 minutes", () => {
		const storage = memoryStorage();
		captureSessionAttribution("?gclid=one", storage, 100);
		expect(
			captureSessionAttribution("", storage, 100 + attributionMaxAge),
		).toEqual({});
		expect(storage.getItem(attributionSessionKey)).toBeNull();
	});
	it("does not break intake when storage is disabled or malformed", () => {
		const storage = memoryStorage();
		storage.setItem(attributionSessionKey, "invalid");
		expect(captureSessionAttribution("", storage, 100)).toEqual({});
		expect(
			captureSessionAttribution(
				"?gclid=one",
				{
					...storage,
					setItem: () => {
						throw new Error("Disabled");
					},
				},
				100,
			),
		).toEqual({ gclid: "one" });
	});
});
