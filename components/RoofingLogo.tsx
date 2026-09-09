import { clientConfig } from "@/config/client";

export default function RoofingLogo() {
	return (
		<>
			<svg
				className="roof-logo-mark"
				viewBox="0 0 56 48"
				fill="none"
				aria-hidden="true"
			>
				<path d="M2 24 28 4l26 20-6 6-20-15L8 30Z" fill="currentColor" />
				<path
					className="roof-logo-star"
					d="m28 24 2.8 7.1 7.6.5-5.9 4.9 1.9 7.4-6.4-4.2-6.4 4.2 1.9-7.4-5.9-4.9 7.6-.5Z"
					fill="currentColor"
				/>
			</svg>
			<span className="roof-logo-type">
				<span>{clientConfig.logoName}</span>
				<small>{clientConfig.logoDescriptor}</small>
			</span>
		</>
	);
}
