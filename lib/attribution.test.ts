import { describe, expect, it } from "vitest";
import { extractAttribution } from "./attribution";

describe("lead attribution", () => {
  it("preserves UTM values plus Google click identifiers", () => {
    const params = new URLSearchParams(
      "utm_source=google&utm_medium=cpc&utm_campaign=storm&gclid=click-123&gbraid=braid-456"
    );

    expect(extractAttribution(params)).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "storm",
      gclid: "click-123",
      gbraid: "braid-456"
    });
  });

  it("drops blank values and unrelated query parameters", () => {
    const params = new URLSearchParams("utm_source=%20%20&phone=7135550100&ref=partner");
    expect(extractAttribution(params)).toEqual({});
  });
});
