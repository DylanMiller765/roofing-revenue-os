export type ClientConfig = {
  name: string;
  shortName: string;
  city: string;
  market: string;
  serviceAreaLabel: string;
  serviceAreaZips: readonly string[];
  phone: string;
  phoneDisplay: string;
  responseExpectation: string;
  isDemo: boolean;
};

/**
 * The only place the public funnel should get client-specific identity data.
 * Every value below is explicitly fictional and must be replaced with verified
 * client information before setting `isDemo` to false.
 */
export const clientConfig = {
  name: "Lone Star Roof Co.",
  shortName: "Lone Star Roof",
  city: "Houston",
  market: "Houston, TX",
  serviceAreaLabel: "Houston metro demo area",
  serviceAreaZips: ["77002", "77007", "77008", "77018", "77024", "77043", "77055", "77079", "77080", "77084"],
  phone: "+17135550147",
  phoneDisplay: "(713) 555-0147",
  responseExpectation: "Demo response only — no contractor will contact you.",
  isDemo: true
} as const satisfies ClientConfig;

export const demoDisclaimer =
  "Fictional roofing company for product demonstration. No roofing service is offered and no business claims are real.";
