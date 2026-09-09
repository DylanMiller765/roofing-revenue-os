import RoofingLanding from "@/components/RoofingLanding";
import { clientConfig } from "@/config/client";
import { resolveLandingIntent } from "@/lib/landing-intent";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const params = await searchParams;
	return (
		<RoofingLanding
			initialIntent={resolveLandingIntent(params.intent)}
			showDemo={clientConfig.isDemo && params.preview !== "homeowner"}
		/>
	);
}
