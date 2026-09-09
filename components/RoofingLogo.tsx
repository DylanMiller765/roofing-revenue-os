import { clientConfig } from "@/config/client";

/** Typeset concept wordmark; original identity belongs to Ronnie Roofer. */
export default function RoofingLogo() {
	return (
		<span className="roof-logo-type ronnie-wordmark">
			<span>
				{clientConfig.logoName}
				<b>.</b>
			</span>
			<small>{clientConfig.logoDescriptor}</small>
		</span>
	);
}
