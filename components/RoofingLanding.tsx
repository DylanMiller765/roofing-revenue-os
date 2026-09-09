"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clientConfig } from "@/config/client";
import {
	landingIntents,
	type LandingIntent,
	resolveLandingIntent,
} from "@/lib/landing-intent";
import LeadForm from "./LeadForm";
import RoofingLogo from "./RoofingLogo";
import Icon from "./Icon";
import DemoCallButton from "./DemoCallButton";
import { ronnieProof } from "@/config/ronnie-proof";

const order: LandingIntent[] = ["replacement", "storm", "repair"];
const scenes = {
	replacement: {
		title: "Your home.\nA roof you trust.",
		description:
			"Considering a new roof in League City? Start with a free inspection from Ronnie Roofer and a clear conversation about your options.",
		image: "/images/ronnie/brick.webp",
		alt: "Brick home and shingle roof pictured in Ronnie Roofer’s project gallery",
		detail: "For the place you call home",
		question: "A roof showing its age?",
		answer:
			"You don’t need to know whether it’s time to replace it. Tell us what you’ve noticed, and start with an inspection request.",
	},
	storm: {
		title: "After the storm,\nstart with your roof.",
		description:
			"Missing shingles or a new water stain after a storm? Start with a free roof inspection for your Clear Lake home.",
		image: "/images/ronnie/workers.webp",
		alt: "Roofing crew at work, pictured on Ronnie Roofer’s website",
		detail: "A little clarity after the storm",
		question: "Not sure what the storm left behind?",
		answer:
			"Share your concern without climbing onto the roof. An inspection request starts the conversation; it doesn’t determine insurance coverage.",
	},
	repair: {
		title: "A small leak.\nA reason to take a look.",
		description:
			"A ceiling stain. Loose shingles. A leak that keeps coming back. Tell Ronnie Roofer what’s happening at your Clear Lake home.",
		image: "/images/ronnie/ranch.webp",
		alt: "Shingle roof on a home pictured in Ronnie Roofer’s project gallery",
		detail: "Start with the problem you can see",
		question: "A leak doesn’t tell the whole story.",
		answer:
			"Choose the concern that comes closest. You don’t need to diagnose the problem or decide on a repair before reaching out.",
	},
} as const;

export default function RoofingLanding({
	initialIntent,
	showDemo,
}: {
	initialIntent: LandingIntent;
	showDemo: boolean;
}) {
	const [intent, setIntent] = useState(initialIntent);
	const [direction, setDirection] = useState(1);
	const drag = useRef<{ x: number; y: number } | null>(null);
	const touch = useRef<{ x: number; y: number } | null>(null);
	const current = order.indexOf(intent);
	const copy = landingIntents[intent];
	const scene = scenes[intent];
	const review = ronnieProof.reviews[intent];
	useEffect(() => {
		setIntent(initialIntent);
	}, [initialIntent]);
	useEffect(() => {
		const sync = () =>
			setIntent(
				resolveLandingIntent(
					new URLSearchParams(window.location.search).get("intent"),
				),
			);
		window.addEventListener("popstate", sync);
		return () => window.removeEventListener("popstate", sync);
	}, []);
	function select(next: LandingIntent, movement: number) {
		if (next === intent) return;
		setDirection(movement);
		setIntent(next);
		const url = new URL(window.location.href);
		url.searchParams.set("intent", next);
		window.history.replaceState(null, "", url);
	}
	function move(delta: number) {
		select(order[(current + delta + order.length) % order.length], delta);
	}
	return (
		<main className="roof-site" id="top">
			<a className="skip-link" href="#request">
				Skip to inspection request
			</a>
			<div className="roof-demo-note">
				<div className="roof-wrap">
					<span>
						Ronnie Roofer · Independent proposal · Calls & forms simulated
					</span>
					<Link href="/pilot">
						Your pilot proposal <Icon name="external" />
					</Link>
				</div>
			</div>
			{showDemo && (
				<section className="intent-switcher" aria-label="Landing page examples">
					<div className="roof-wrap intent-switcher-inner">
						<div className="intent-instruction">
							<strong>Different search. Different page.</strong>
							<span>Choose a search. See your page match it.</span>
						</div>
						<fieldset
							className="search-slider"
							aria-label="Choose an example homeowner search"
							onKeyDown={(event) => {
								if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
									event.preventDefault();
									move(event.key === "ArrowRight" ? 1 : -1);
								}
							}}
						>
							<button
								type="button"
								className="slide-arrow"
								aria-label="Previous roofing example"
								onClick={() => move(-1)}
							>
								<Icon name="arrow" style={{ transform: "rotate(180deg)" }} />
							</button>
							<div className="search-window" aria-live="polite">
								<Icon name="search" />
								<span key={intent}>{copy.search}</span>
							</div>
							<button
								type="button"
								className="slide-arrow"
								aria-label="Next roofing example"
								onClick={() => move(1)}
							>
								<Icon name="arrow" />
							</button>
						</fieldset>
						<span className="slide-count">
							0{current + 1}
							<span> / 03</span>
						</span>
					</div>
				</section>
			)}
			<header className="roof-header roof-wrap">
				<Link
					className="roof-brand"
					href="/"
					aria-label={`${clientConfig.name} demo home`}
				>
					<RoofingLogo />
				</Link>
				<nav aria-label="Page sections">
					<a href="#work">Our work</a>
					<a href="#reviews">Customer reviews</a>
					<a href="#questions">Roofing questions</a>
				</nav>
				<DemoCallButton className="roof-call">
					<Icon name="phone" />
					<span>
						{clientConfig.phoneDisplay}
						<small>Call Ronnie · Demo preview</small>
					</span>
				</DemoCallButton>
			</header>
			<section
				className={`roof-hero ${showDemo ? "roof-hero--interactive" : ""}`}
				aria-label={`${copy.label} landing page`}
				aria-roledescription={showDemo ? "carousel" : undefined}
				onPointerDown={
					showDemo
						? (event) => {
								if (
									event.pointerType !== "mouse" ||
									(event.target as HTMLElement).closest("a, button")
								)
									return;
								drag.current = { x: event.clientX, y: event.clientY };
								event.currentTarget.setPointerCapture(event.pointerId);
							}
						: undefined
				}
				onPointerUp={
					showDemo
						? (event) => {
								if (!drag.current) return;
								const dx = event.clientX - drag.current.x;
								const dy = event.clientY - drag.current.y;
								if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4)
									move(dx < 0 ? 1 : -1);
								drag.current = null;
							}
						: undefined
				}
				onPointerCancel={() => {
					drag.current = null;
				}}
				onTouchStart={
					showDemo
						? (event) => {
								touch.current = {
									x: event.touches[0].clientX,
									y: event.touches[0].clientY,
								};
							}
						: undefined
				}
				onTouchEnd={
					showDemo
						? (event) => {
								if (!touch.current) return;
								const dx = event.changedTouches[0].clientX - touch.current.x;
								const dy = event.changedTouches[0].clientY - touch.current.y;
								if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4)
									move(dx < 0 ? 1 : -1);
								touch.current = null;
							}
						: undefined
				}
				onTouchCancel={() => {
					touch.current = null;
				}}
			>
				<div
					className={`roof-scene ${direction < 0 ? "roof-scene--back" : ""}`}
					key={intent}
				>
					<Image
						src={scene.image}
						alt={scene.alt}
						fill
						sizes="100vw"
						priority
						quality={85}
						className="roof-photo"
					/>
					<div className="roof-shade" />
					<div className="roof-wrap roof-hero-content">
						<div className="roof-hero-copy">
							<p className="roof-service">
								<span />
								{intent === "replacement" ? "League City" : "Clear Lake"} ·{" "}
								{copy.label}
							</p>
							<h1>
								{scene.title.split("\n").map((line) => (
									<span key={line}>{line}</span>
								))}
							</h1>
							<p className="roof-description">{scene.description}</p>
							<a href="#request" className="roof-primary">
								Get my free inspection <Icon name="arrow" />
							</a>
							<p className="roof-cta-note">Free inspection · No obligation</p>
						</div>
						<div className="roof-photo-caption">
							<span>{scene.detail}</span>
							<small>Photo from Ronnie Roofer’s published work</small>
						</div>
					</div>
				</div>
				{showDemo && (
					<div className="hero-pagination roof-wrap">
						<nav
							className="hero-pagination-buttons"
							aria-label="Select roofing need"
						>
							{order.map((item, index) => (
								<button
									key={item}
									type="button"
									aria-pressed={intent === item}
									onClick={() => select(item, index > current ? 1 : -1)}
								>
									<span>0{index + 1}</span>
									{landingIntents[item].label}
									<i />
								</button>
							))}
						</nav>
						<span className="swipe-hint">Swipe left or right to explore</span>
					</div>
				)}
			</section>
			<div className="roof-promise-bar roof-wrap">
				<div>
					<span className="roof-stars" aria-hidden="true">
						★★★★★
					</span>
					<span>
						<strong>
							{ronnieProof.rating} / 5 · {ronnieProof.reviewCount} Google
							reviews
						</strong>
						<a href={ronnieProof.mapsUrl} target="_blank" rel="noreferrer">
							View on Google Maps
						</a>
					</span>
				</div>
				<div>
					<Icon name="roof" />
					<span>
						Clear Lake · League City
						<strong>Local roofing, personal service.</strong>
					</span>
				</div>
				<div>
					<Icon name="check" />
					<span>
						A clear place to start.<strong>Free roof inspections.</strong>
					</span>
				</div>
			</div>
			<section
				className="roof-review roof-wrap"
				id="reviews"
				aria-label="Selected customer review"
			>
				<div>
					<p className="roof-kicker">From Ronnie’s customers</p>
					<span className="roof-stars" aria-hidden="true">
						★★★★★
					</span>
				</div>
				<figure key={intent}>
					<blockquote>“{review.quote}”</blockquote>
					<figcaption>
						{review.name} · {review.context} ·{" "}
						<a href={review.url} target="_blank" rel="noreferrer">
							Read Google review ↗
						</a>
					</figcaption>
				</figure>
				<small>
					Selected excerpt relevant to this page. Rating checked{" "}
					{ronnieProof.checkedAt}; not a live feed.
				</small>
			</section>
			<section className="roof-intake roof-wrap">
				<div className="roof-intake-copy">
					<p className="roof-kicker">Let’s start with your home</p>
					<h2>{scene.question}</h2>
					<p>{scene.answer}</p>
					<div className="roof-next-step">
						<span>
							<Icon name="phone" />
						</span>
						<div>
							<h3>What happens after you reach out?</h3>
							<p>
								On the live page, your request would go directly to Ronnie’s
								team to discuss inspection availability. This preview checks
								your details without sending them.
							</p>
						</div>
					</div>
					<p className="roof-service-area">
						Clear Lake · League City · Webster · Houston Bay Area
					</p>
				</div>
				<div id="request">
					<LeadForm initialNeed={intent} title={copy.action} />
				</div>
			</section>
			<section className="roof-projects roof-wrap" id="work">
				<div className="roof-section-heading">
					<p className="roof-kicker">A closer look at Ronnie’s work</p>
					<h2>Real homes. Real roofing.</h2>
					<p>Project photographs published by Ronnie Roofer.</p>
				</div>
				<div className="roof-project-grid">
					<figure>
						<Image
							src="/images/ronnie/brick.webp"
							alt="Brick home with a shingle roof from Ronnie Roofer’s gallery"
							width={1000}
							height={563}
							sizes="(max-width: 650px) 100vw, 60vw"
						/>
						<figcaption>A finished roof, from Ronnie’s gallery.</figcaption>
					</figure>
					<figure>
						<Image
							src="/images/ronnie/workers.webp"
							alt="Ronnie Roofer job site with crew and company sign"
							width={1000}
							height={1000}
							sizes="(max-width: 650px) 100vw, 40vw"
						/>
						<figcaption>A look at the crew on the job.</figcaption>
					</figure>
				</div>
				<a
					className="roof-source-link"
					href={ronnieProof.projectSource}
					target="_blank"
					rel="noreferrer"
				>
					Explore the original project gallery ↗
				</a>
			</section>
			<section className="roof-approach" id="approach">
				<div className="roof-wrap">
					<div className="roof-section-heading">
						<p className="roof-kicker">A simple place to start</p>
						<h2>
							Roof questions shouldn’t
							<br />
							feel complicated.
						</h2>
					</div>
					<ol>
						<li>
							<span>01</span>
							<h3>Tell us what you see.</h3>
							<p>
								A leak, an aging roof, or a change after a storm. Start with
								your concern and your property ZIP.
							</p>
						</li>
						<li>
							<span>02</span>
							<h3>Start a conversation.</h3>
							<p>
								A roofing team would confirm your area and discuss inspection
								availability with you.
							</p>
						</li>
						<li>
							<span>03</span>
							<h3>Understand your next step.</h3>
							<p>
								An inspection helps inform a conversation about the roof’s
								condition and possible options.
							</p>
						</li>
					</ol>
				</div>
			</section>
			<section className="roof-questions roof-wrap" id="questions">
				<div>
					<p className="roof-kicker">Before you reach out</p>
					<h2>A little more clarity.</h2>
				</div>
				<div className="roof-faq-list">
					<details>
						<summary>What if I don’t know what my roof needs?</summary>
						<p>
							That’s fine. Select “Not sure yet” in the form. You don’t need to
							know your roof’s age or diagnose the issue before requesting an
							inspection.
						</p>
					</details>
					<details>
						<summary>Does a request book an appointment?</summary>
						<p>
							A request would need confirmation from the roofing team. In this
							proposal demo, no contractor is contacted and no appointment is
							booked.
						</p>
					</details>
					<details>
						<summary>What happens to my details in this demo?</summary>
						<p>
							Use made-up contact details. The form checks your answers without
							saving or delivering them. Campaign tags and click IDs may remain
							in this browser tab for 30 minutes to demonstrate attribution.
						</p>
					</details>
				</div>
			</section>
			<footer className="roof-footer">
				<div className="roof-wrap">
					<Link
						className="roof-brand"
						href="/"
						aria-label={`${clientConfig.name} demo home`}
					>
						<RoofingLogo />
					</Link>
					<p>
						Independent concept prepared for Ronnie Roofer.
						<br />
						Public-source photos and review excerpts · Not an approved live
						website.
					</p>
					<Link href="/operator">
						Our acquisition workspace <Icon name="external" />
					</Link>
				</div>
			</footer>
			<nav className="roof-mobile-actions" aria-label="Inspection actions">
				<DemoCallButton>
					<Icon name="phone" />
					Call Ronnie
				</DemoCallButton>
				<a href="#request">
					Request inspection <Icon name="arrow" />
				</a>
			</nav>
		</main>
	);
}
