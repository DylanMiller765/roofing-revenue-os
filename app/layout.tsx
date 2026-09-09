import type { Metadata } from "next";
import { clientConfig } from "@/config/client";
import "./globals.css";
import "./roofing.css";

export const metadata: Metadata = {
	title: {
		default: `${clientConfig.name} — Personalized Proposal`,
		template: `%s · Roofing Revenue OS`,
	},
	description: `Independent proposal for ${clientConfig.name}: personalized roofing landing pages and a simulated acquisition walkthrough.`,
	robots: { index: false, follow: false },
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-scroll-behavior="smooth">
			<body>{children}</body>
		</html>
	);
}
