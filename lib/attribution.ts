export const attributionKeys = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"gclid",
	"gbraid",
] as const;

export type AttributionKey = (typeof attributionKeys)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

export function extractAttribution(
	params: Pick<URLSearchParams, "get">,
): Attribution {
	return Object.fromEntries(
		attributionKeys.flatMap((key) => {
			const value = params.get(key)?.trim();
			return value ? [[key, value]] : [];
		}),
	);
}

export const attributionSessionKey = "roofing-demo-attribution-v1";
export const attributionMaxAge = 30 * 60 * 1000;

type AttributionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** A new tagged visit replaces the whole source, never mixing unrelated click IDs. */
export function captureSessionAttribution(
	search: string,
	storage?: AttributionStorage,
	now = Date.now(),
): Attribution {
	const current = extractAttribution(new URLSearchParams(search));
	try {
		const target = storage ?? window.sessionStorage;
		if (Object.keys(current).length) {
			target.setItem(
				attributionSessionKey,
				JSON.stringify({ capturedAt: now, attribution: current }),
			);
			return current;
		}
		const saved = JSON.parse(target.getItem(attributionSessionKey) || "null");
		if (
			saved &&
			typeof saved.capturedAt === "number" &&
			now >= saved.capturedAt &&
			now - saved.capturedAt < attributionMaxAge &&
			saved.attribution &&
			typeof saved.attribution === "object"
		) {
			return extractAttribution({
				get: (key) =>
					typeof saved.attribution[key] === "string"
						? saved.attribution[key]
						: null,
			});
		}
		target.removeItem(attributionSessionKey);
	} catch {
		/* Storage may be disabled. Query attribution must still work. */
	}
	return current;
}
