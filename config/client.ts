export type ClientConfig = {
	name: string;
	shortName: string;
	logoName: string;
	logoDescriptor: string;
	city: string;
	market: string;
	serviceAreaLabel: string;
	serviceAreaZips: readonly string[];
	phone: string;
	phoneDisplay: string;
	responseExpectation: string;
	isDemo: boolean;
};

/** Public business details for a proposed Ronnie Roofer demo. Never routes leads.
 * ZIP selection is a proposed test area, not a confirmed service boundary.
 */
export const clientConfig = {
	name: "Ronnie Roofer",
	shortName: "Ronnie Roofer",
	logoName: "Ronnie",
	logoDescriptor: "Roofer",
	city: "Houston",
	market: "Clear Lake · League City",
	serviceAreaLabel: "Proposed Clear Lake / League City pilot area",
	serviceAreaZips: ["77058", "77059", "77062", "77573", "77598"],
	phone: "+12815150630",
	phoneDisplay: "(281) 515-0630",
	responseExpectation: "Proposal demo only — no contractor will contact you.",
	isDemo: true,
} as const satisfies ClientConfig;

export const demoDisclaimer =
	"Independent proposal for Ronnie Roofer. Not their live website. Forms and calls are simulated; advertising results are mock.";
