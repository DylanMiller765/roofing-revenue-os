import type { Metadata } from "next";
import { clientConfig } from "@/config/client";
import "./globals.css";
import "./roofing.css";

export const metadata: Metadata = {
	title: {
		default: `${clientConfig.name} — Fictional Demo Funnel`,
		template: `%s · Roofing Revenue OS`,
	},
	description: `Fictional ${clientConfig.city} roofing acquisition funnel and operator-dashboard demo.`,
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
