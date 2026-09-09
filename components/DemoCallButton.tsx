"use client";

import { useRef, type ReactNode } from "react";
import { clientConfig } from "@/config/client";

export default function DemoCallButton({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const dialog = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className={className}
				type="button"
				onClick={() => dialog.current?.showModal()}
			>
				{children}
			</button>
			<dialog
				className="roof-call-dialog"
				ref={dialog}
				aria-label="Demo call preview"
			>
				<p className="roof-kicker">Call preview · No call placed</p>
				<h2>A direct line to Ronnie.</h2>
				<p>
					On the live page, this button would connect the homeowner to{" "}
					{clientConfig.name} at:
				</p>
				<strong>{clientConfig.phoneDisplay}</strong>
				<p>
					This proposal does not dial the business or record a call. Call
					tracking is connected and tested before advertising starts.
				</p>
				<form method="dialog">
					<button className="roof-primary" type="submit">
						Back to the demo
					</button>
				</form>
			</dialog>
		</>
	);
}
