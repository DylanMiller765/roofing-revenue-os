"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { captureSessionAttribution, type Attribution } from "@/lib/attribution";
import type { QualificationResult } from "@/lib/qualification";
import Icon from "./Icon";

type Receipt = { qualification: QualificationResult; attribution: Attribution };
const reasonLabels: Record<string, string> = {
	not_homeowner: "The request needs a property-owner review.",
	outside_service_area: "This ZIP is outside the configured demo service area.",
};

export default function LeadForm({
	initialNeed = "",
}: {
	initialNeed?: string;
}) {
	const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
		"idle",
	);
	const [message, setMessage] = useState("");
	const [receipt, setReceipt] = useState<Receipt | null>(null);
	const attribution = useRef<Attribution>({});
	const resultHeading = useRef<HTMLHeadingElement>(null);
	const formHeading = useRef<HTMLHeadingElement>(null);
	useEffect(() => {
		attribution.current = captureSessionAttribution(window.location.search);
	}, []);
	useEffect(() => {
		if (status === "done") resultHeading.current?.focus();
	}, [status]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		setStatus("sending");
		setMessage("");
		try {
			const response = await fetch("/api/leads", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...Object.fromEntries(form.entries()),
					...attribution.current,
				}),
				signal: AbortSignal.timeout(15000),
			});
			const result = await response.json();
			if (!response.ok)
				throw new Error(
					result.error ||
						"The demo could not validate your request. Please try again.",
				);
			setReceipt(result);
			setStatus("done");
		} catch (error) {
			setStatus("error");
			setMessage(
				error instanceof Error &&
					error.name !== "TimeoutError" &&
					error.message !== "Failed to fetch"
					? error.message
					: "Connection interrupted. Your details are still here; please try again.",
			);
		}
	}

	if (status === "done" && receipt)
		return (
			<div className="lead-panel lead-success">
				<span className="success-mark">
					<Icon name="check" />
				</span>
				<p className="muted">Demo request checked</p>
				<h2 ref={resultHeading} tabIndex={-1}>
					You’ve completed the walkthrough.
				</h2>
				<p>
					No contractor was contacted. Your contact details were not saved and
					no inspection is booked.
				</p>
				<div className="receipt">
					<strong>
						{receipt.qualification.qualified
							? "Meets the demo qualification rules"
							: "Needs a review before qualification"}
					</strong>
					<p>
						{receipt.qualification.qualified
							? "Homeowner, supported ZIP, relevant roof need and valid phone format. Contactability has not been verified."
							: receipt.qualification.reasons
									.map(
										(reason) =>
											reasonLabels[reason] || "This request needs review.",
									)
									.join(" ")}
					</p>
					<span>
						Source:{" "}
						{receipt.attribution.utm_source || "No campaign source supplied"}
					</span>
					<span>
						Click identifier:{" "}
						{receipt.attribution.gclid || receipt.attribution.gbraid
							? "Preserved in this mock request"
							: "Not supplied"}
					</span>
				</div>
				<button
					className="button button--primary"
					type="button"
					onClick={() => {
						setStatus("idle");
						setTimeout(() => formHeading.current?.focus(), 0);
					}}
				>
					Try another request
				</button>
			</div>
		);

	return (
		<form
			className="lead-panel"
			onSubmit={submit}
			aria-busy={status === "sending"}
		>
			<div className="form-heading">
				<span className="form-icon">
					<Icon name="roof" />
				</span>
				<h2 ref={formHeading} tabIndex={-1}>
					Request a roof inspection
				</h2>
				<p>Start with a few details about your home.</p>
			</div>
			<fieldset className="homeowner-field">
				<legend>Are you the homeowner?</legend>
				<div className="radio-options">
					<label>
						<input type="radio" name="homeowner" value="yes" required />
						Yes, I own the home
					</label>
					<label>
						<input type="radio" name="homeowner" value="no" />
						No
					</label>
				</div>
			</fieldset>
			<div className="form-grid concern-grid">
				<div className="form-field">
					<label htmlFor="need">Roof concern</label>
					<select id="need" name="need" required defaultValue={initialNeed}>
						<option value="" disabled>
							Select a concern
						</option>
						<option value="replacement">Possible replacement</option>
						<option value="repair">Leak or repair</option>
						<option value="storm">Storm or hail damage</option>
						<option value="unknown">Not sure yet</option>
					</select>
				</div>
				<div className="form-field">
					<label htmlFor="zip">Property ZIP</label>
					<input
						id="zip"
						name="zip"
						inputMode="numeric"
						autoComplete="postal-code"
						pattern="[0-9]{5}"
						maxLength={5}
						placeholder="77008"
						required
					/>
				</div>
			</div>
			<div className="form-field">
				<label htmlFor="name">Your name</label>
				<input
					id="name"
					name="name"
					autoComplete="name"
					placeholder="Alex Morgan"
					maxLength={100}
					required
				/>
			</div>
			<div className="form-field">
				<label htmlFor="phone">Phone number</label>
				<input
					id="phone"
					name="phone"
					type="tel"
					autoComplete="tel"
					placeholder="(713) 555-0184"
					minLength={10}
					maxLength={25}
					required
				/>
			</div>
			<details className="optional-field">
				<summary>
					Add roof age <span>Optional</span>
				</summary>
				<div className="form-field">
					<label htmlFor="roofAge">Approximate roof age</label>
					<select id="roofAge" name="roofAge" defaultValue="unknown">
						<option value="unknown">Not sure</option>
						<option value="0-5">0–5 years</option>
						<option value="6-10">6–10 years</option>
						<option value="11-20">11–20 years</option>
						<option value="20-plus">20+ years</option>
					</select>
				</div>
			</details>
			<p className="form-error" role="alert">
				{status === "error" ? message : ""}
			</p>
			<button
				className="button button--primary form-submit"
				type="submit"
				disabled={status === "sending"}
			>
				{status === "sending" ? "Checking request…" : "Send demo request"}
				<Icon name="arrow" />
			</button>
			<p className="form-legal">
				Demo only. Use made-up details. Nothing is saved or sent to a
				contractor.
			</p>
		</form>
	);
}
