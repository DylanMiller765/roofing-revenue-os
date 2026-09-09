import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import Icon from "@/components/Icon";
import { clientConfig } from "@/config/client";

const intentCopy = {
	repair: {
		title: "A roof leak needs a clear next step.",
		body: "Tell us where you’re seeing a problem. Start with a roof inspection request for your Houston home.",
		need: "repair",
	},
	replacement: {
		title: "A new roof starts with a clear picture.",
		body: "Considering a roof replacement? Share a few details about your Houston home to start an inspection request.",
		need: "replacement",
	},
	storm: {
		title: "After the storm, start with your roof.",
		body: "Noticed missing shingles or a new leak? Tell us what changed and start a roof inspection request for your Houston home.",
		need: "storm",
	},
	general: {
		title: "Your roof. A clear next step.",
		body: "A leak, storm damage, or a roof showing its age. Tell us what’s happening at your Houston home to start an inspection request.",
		need: "",
	},
};

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const { intent } = await searchParams;
	const copy =
		intentCopy[
			intent === "repair" || intent === "replacement" || intent === "storm"
				? intent
				: "general"
		];
	return (
		<main className="public-shell" id="top">
			<a className="skip-link" href="#request">
				Skip to inspection request
			</a>
			<div className="demo-rail">
				<div className="wrap">
					<span className="demo-dot" />
					Fictional roofing demo. No services offered.
					<Link href="/operator">
						Explore the owner dashboard <Icon name="external" />
					</Link>
				</div>
			</div>
			<header className="public-header wrap">
				<Link
					className="brand-lockup"
					href="/"
					aria-label={`${clientConfig.name} demo home`}
				>
					<span className="brand-mark">
						<Icon name="roof" />
					</span>
					<span>
						{clientConfig.shortName}
						<small>Residential roofing / {clientConfig.city}, TX</small>
					</span>
				</Link>
				<a className="header-call" href={`tel:${clientConfig.phone}`}>
					<Icon name="phone" />
					<span>
						{clientConfig.phoneDisplay}
						<small>Fictional demo number</small>
					</span>
				</a>
			</header>
			<section className="conversion-hero wrap">
				<div className="hero-copy">
					<p className="location-label">
						<span />
						For Houston homeowners
					</p>
					<h1>{copy.title}</h1>
					<p className="hero-subhead">{copy.body}</p>
					<div className="hero-actions">
						<a className="button button--primary" href="#request">
							Request an inspection <Icon name="arrow" />
						</a>
						<a className="text-link" href="#next">
							How it works
						</a>
					</div>
					<div className="hero-reassurance">
						<span>
							<Icon name="check" />A few simple questions
						</span>
						<span>
							<Icon name="check" />
							No roof age required
						</span>
					</div>
					<figure className="roof-study">
						<svg
							viewBox="0 0 620 225"
							fill="none"
							aria-labelledby="roof-title"
							role="img"
						>
							<title id="roof-title">
								Architectural illustration of a residential roof, not an actual
								project
							</title>
							<defs>
								<pattern
									id="shingles"
									width="24"
									height="12"
									patternUnits="userSpaceOnUse"
									patternTransform="skewX(-24)"
								>
									<path
										d="M0 12h24M0 0v12M12 0v6"
										stroke="#91aab7"
										strokeWidth=".6"
									/>
								</pattern>
							</defs>
							<path
								d="M20 193h580M80 193V113l133-82 91 54 95-43 132 80v71"
								stroke="#8399a6"
							/>
							<path
								d="m52 125 161-104 117 73-124 47Zm234-28 111-65 166 98-153 7Z"
								fill="#dbe5e9"
								stroke="#7894a4"
							/>
							<path
								d="m52 125 161-104 117 73-124 47Zm234-28 111-65 166 98-153 7Z"
								fill="url(#shingles)"
							/>
							<path
								d="m206 141 124-47 80 43v56H206v-52ZM115 193v-47h56v47m92 0v-47h47v47m143-30h38v-23h-38v23M350 72V36h23v23"
								stroke="#7894a4"
							/>
							<path
								d="m24 150 176 17m239-104 109-32M330 192v-54"
								stroke="#23776b"
								strokeDasharray="3 4"
							/>
							<circle cx="200" cy="167" r="4" fill="#23776b" />
							<circle cx="439" cy="63" r="4" fill="#23776b" />
						</svg>
						<figcaption>
							Every home starts with the same question: what does the roof need?
							<span>Illustration</span>
						</figcaption>
					</figure>
				</div>
				<div id="request" className="form-anchor">
					<LeadForm key={copy.need} initialNeed={copy.need} />
				</div>
			</section>
			<section className="next-section wrap" id="next">
				<div className="section-intro">
					<p className="muted">The inspection request process</p>
					<h2>
						First, understand the roof.
						<br />
						Then, decide what’s next.
					</h2>
					<p>
						This demo shows the intended intake process. A real appointment
						requires confirmation from a roofing team.
					</p>
				</div>
				<ol className="process-list">
					<li>
						<span>1</span>
						<div>
							<h3>Tell us what you’re noticing</h3>
							<p>
								Choose the closest roof concern and add your property ZIP. It’s
								fine if you don’t know the roof’s age.
							</p>
						</div>
					</li>
					<li>
						<span>2</span>
						<div>
							<h3>Confirm the fit and a time</h3>
							<p>
								In a live service, the team would review your area and concern,
								then contact you about inspection availability.
							</p>
						</div>
					</li>
					<li>
						<span>3</span>
						<div>
							<h3>Make an informed decision</h3>
							<p>
								An inspection would help the team discuss the roof’s condition
								and appropriate next steps with you.
							</p>
						</div>
					</li>
				</ol>
			</section>
			<section className="funnel-faq wrap" aria-label="Inspection questions">
				<h2>A little clarity before you start.</h2>
				<div>
					<details>
						<summary>
							Do I need to know if I need a repair or replacement?
						</summary>
						<p>
							No. Select “Not sure yet” and describe your concern when a team
							follows up. This demo does not provide a roof diagnosis.
						</p>
					</details>
					<details>
						<summary>Does this book an appointment?</summary>
						<p>
							No. This is a fictional demonstration; no contractor receives your
							request and no appointment is booked.
						</p>
					</details>
					<details>
						<summary>What happens to my details in this demo?</summary>
						<p>
							Use made-up contact details. The form validates your entry but
							does not save or route it. Campaign tags and click IDs are
							retained in this browser tab for up to 30 minutes to demonstrate
							source continuity.
						</p>
					</details>
				</div>
			</section>
			<footer className="public-footer wrap">
				<div className="brand-lockup">
					<Icon name="roof" />
					{clientConfig.shortName}
				</div>
				<p>
					Fictional company. No reviews, credentials, work results or service
					guarantees are represented.
				</p>
				<Link className="text-link" href="/operator">
					Built on Roofing Revenue OS <Icon name="external" />
				</Link>
			</footer>
			<nav className="mobile-action-bar" aria-label="Inspection actions">
				<a href={`tel:${clientConfig.phone}`}>
					<Icon name="phone" />
					Demo call
				</a>
				<a href="#request">
					Request inspection <Icon name="arrow" />
				</a>
			</nav>
		</main>
	);
}
