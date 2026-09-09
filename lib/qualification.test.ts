import { describe, expect, it } from "vitest";
import { isReachablePhone, qualifyLead } from "./qualification";

const serviceAreaZips = ["77002", "77008"];
const validLead = { homeowner: true, need: "replacement" as const, zip: "77008", phone: "(713) 555-0184" };

describe("lead qualification", () => {
  it("qualifies a homeowner with a relevant need, service-area ZIP and reachable phone", () => {
    expect(qualifyLead(validLead, { serviceAreaZips })).toEqual({ qualified: true, reasons: [] });
  });

  it.each([
    [{ ...validLead, homeowner: false }, "not_homeowner"],
    [{ ...validLead, zip: "78701" }, "outside_service_area"],
    [{ ...validLead, phone: "111-111-1111" }, "unreachable_contact"]
  ])("rejects an invalid qualification condition", (lead, reason) => {
    const result = qualifyLead(lead, { serviceAreaZips });
    expect(result.qualified).toBe(false);
    expect(result.reasons).toContain(reason);
  });

  it("rejects duplicate and spam context even when contact details are valid", () => {
    expect(qualifyLead(validLead, { serviceAreaZips, duplicate: true, spam: true })).toEqual({
      qualified: false,
      reasons: ["duplicate", "spam"]
    });
  });
});

describe("reachable phone validation", () => {
  it("accepts formatted US numbers and an optional country code", () => {
    expect(isReachablePhone("+1 713 555 0184")).toBe(true);
    expect(isReachablePhone("7135550184")).toBe(true);
  });

  it("rejects short or repeated-digit placeholders", () => {
    expect(isReachablePhone("713-555")).toBe(false);
    expect(isReachablePhone("0000000000")).toBe(false);
  });
});
