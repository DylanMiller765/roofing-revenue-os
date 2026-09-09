export const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid"
] as const;

export type AttributionKey = (typeof attributionKeys)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

export function extractAttribution(params: Pick<URLSearchParams, "get">): Attribution {
  return Object.fromEntries(
    attributionKeys.flatMap((key) => {
      const value = params.get(key)?.trim();
      return value ? [[key, value]] : [];
    })
  );
}
