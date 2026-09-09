import type { Metadata } from "next";
import OperatorDashboard from "@/components/OperatorDashboard";
export const metadata: Metadata = { title: "Acquisition overview" };
export default function Operator() {
	return <OperatorDashboard />;
}
