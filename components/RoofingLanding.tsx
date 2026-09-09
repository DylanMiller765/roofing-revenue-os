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

const order: LandingIntent[] = ["replacement", "storm", "repair"];
const scenes = {
	replacement: {
		title: "A new roof.\nA clearer path forward.",
		description:
			"Thinking about replacing your roof? Start with an inspection request and a conversation about what your Houston home needs.",
		image: "/images/roof-replacement.webp",
		alt: "Illustrative Houston home with a charcoal shingle roof and mature oak trees",
		detail: "For the place you call home",
		question: "A roof showing its age?",
		answer:
			"You don’t need to know whether it’s time to replace it. Tell us what you’ve noticed, and start with an inspection request.",
	},
	storm: {
		title: "After the storm,\nstart with your roof.",
		description:
			"Missing shingles. A new water stain. Something that doesn’t look right. Request an inspection to take the next step.",
		image: "/images/roof-storm.webp",
		alt: "Illustrative shingle roof after rain beneath clearing storm clouds",
		detail: "A little clarity after the storm",
		question: "Not sure what the storm left behind?",
		answer:
			"Share your concern without climbing onto the roof. An inspection request starts the conversation; it doesn’t determine insurance coverage.",
	},
	repair: {
		title: "A small leak.\nA reason to take a look.",
		description:
			"A ceiling stain or a few loose shingles can leave you with questions. Tell us what’s happening and request a roof inspection.",
		image: "/images/roof-repair.webp",
		alt: "Illustrative close-up of roof shingles and chimney flashing",
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
					<span>Fictional company demo · No services offered</span>
					<Link href="/operator">
						How we manage your ads <Icon name="external" />
					</Link>
				</div>
			</div>
			{showDemo && (
				<section className="intent-switcher" aria-label="Landing page examples">
					<div className="roof-wrap intent-switcher-inner">
						<div className="intent-instruction">
							<strong>Different search. Different page.</strong>
							<span>Slide to see what your customers would see.</span>
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
					<a href="#approach">Our approach</a>
					<a href="#questions">Roofing questions</a>
				</nav>
				<a className="roof-call" href={`tel:${clientConfig.phone}`}>
					<Icon name="phone" />
					<span>
						{clientConfig.phoneDisplay}
						<small>Fictional demo number</small>
					</span>
				</a>
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
								Houston {copy.label.toLowerCase()}
							</p>
							<h1>
								{scene.title.split("\n").map((line) => (
									<span key={line}>{line}</span>
								))}
							</h1>
							<p className="roof-description">{scene.description}</p>
							<a href="#request" className="roof-primary">
								Request an inspection <Icon name="arrow" />
							</a>
							<p className="roof-cta-note">
								A few details. One clear next step.
							</p>
						</div>
						<div className="roof-photo-caption">
							<span>{scene.detail}</span>
							<small>AI-generated illustration · Not client work</small>
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
					<Icon name="roof" />
					<span>
						Your home.<strong>Your roofing concern.</strong>
					</span>
				</div>
				<div>
					<Icon name="check" />
					<span>
						No roof diagnosis needed.
						<strong>Start with what you notice.</strong>
					</span>
				</div>
				<div>
					<Icon name="phone" />
					<span>
						A straightforward next step.<strong>Request an inspection.</strong>
					</span>
				</div>
			</div>
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
								For a live client, the roofing team would review your request
								and contact you about inspection availability. This demo checks
								the details without sending them.
							</p>
						</div>
					</div>
					<p className="roof-service-area">
						Houston homeowners · Replacement, storm damage & repair
					</p>
				</div>
				<div id="request">
					<LeadForm initialNeed={intent} title={copy.action} />
				</div>
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
							fictional demo, no contractor is contacted and no appointment is
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
						Fictional company and illustrative imagery.
						<br />
						No reviews, credentials or project results are represented.
					</p>
					<Link href="/operator">
						Our acquisition workspace <Icon name="external" />
					</Link>
				</div>
			</footer>
			<nav className="roof-mobile-actions" aria-label="Inspection actions">
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
