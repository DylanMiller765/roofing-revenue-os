import type { CSSProperties } from "react";

const paths = {
	roof: "M3 12 12 4l9 8M5 10v10h14V10M9 20v-6h6v6",
	arrow: "M5 12h14m-6-6 6 6-6 6",
	phone:
		"M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z",
	chart: "M4 4v16h17M8 15l4-5 4 2 5-8",
	funnel: "M3 4h18l-7 8v7l-4 2v-9L3 4Z",
	search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
	shield: "M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6l-9-3Zm-4 9 3 3 5-6",
	check: "m5 12 4 4L19 6",
	clock: "M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
	brief: "M8 6V3h8v3M3 6h18v15H3V6Zm0 6h18M10 12v3h4v-3",
	external: "M14 3h7v7M10 14 21 3M10 3H3v18h18v-7",
} as const;
export default function Icon({
	name,
	style,
}: {
	name: keyof typeof paths;
	style?: CSSProperties;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="20"
			height="20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			style={style}
		>
			<path d={paths[name]} />
		</svg>
	);
}
