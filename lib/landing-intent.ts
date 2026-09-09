export const landingIntents = {
	replacement: {
		label: "Roof replacement",
		search: "roof replacement houston",
		title: "A new roof starts with a clear picture.",
		body: "Considering a roof replacement? Share a few details about your Houston home to start an inspection request.",
		action: "Request a replacement inspection",
		reason:
			"They’re considering a new roof. The page speaks to replacement and makes requesting an inspection the next step.",
	},
	storm: {
		label: "Storm damage",
		search: "hail damage roof inspection",
		title: "After the storm, start with your roof.",
		body: "Noticed missing shingles or a new leak? Tell us what changed and start a roof inspection request for your Houston home.",
		action: "Request a storm damage inspection",
		reason:
			"They’re worried about storm damage. The page addresses what they noticed and offers an inspection, without promising an insurance outcome.",
	},
	repair: {
		label: "Roof repair",
		search: "roof leak repair near me",
		title: "A roof leak needs a clear next step.",
		body: "Tell us where you’re seeing a problem. Start with a roof inspection request for your Houston home.",
		action: "Request a leak inspection",
		reason:
			"They need help with a leak. The page focuses on their repair concern, so they can request help without hunting through a general website.",
	},
} as const;

export type LandingIntent = keyof typeof landingIntents;

export function resolveLandingIntent(value: unknown): LandingIntent {
	return value === "storm" || value === "repair" ? value : "replacement";
}
