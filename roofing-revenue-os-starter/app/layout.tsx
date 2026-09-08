import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lone Star Roof Co. — Demo Funnel",
  description: "Demo acquisition funnel for Roofing Revenue OS"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
