import Link from "next/link";
import RoofingLogo from "@/components/RoofingLogo";

export default function PilotPage() {
	return (
		<main className="roof-site pilot-site">
			<div className="roof-demo-note">
				<div className="roof-wrap">
					<span>
						Independent proposal · Prepared for Ronnie Roofer · No campaign is
						live
					</span>
					<Link href="/">View your demo →</Link>
				</div>
			</div>
			<header className="roof-wrap roof-header">
				<Link
					href="/"
					className="roof-brand"
					aria-label="Ronnie Roofer proposed demo"
				>
					<RoofingLogo />
				</Link>
				<span className="pilot-label">Founding-client invitation</span>
			</header>
			<section className="pilot-hero roof-wrap">
				<p className="roof-kicker">Prepared for Ronnie & Amy</p>
				<h1>
					Your next customer
					<br />
					starts with a search.
				</h1>
				<p>
					You already have the work and the customer feedback. This proposal
					puts them in front of homeowners searching for the roofing services
					you want to grow.
				</p>
				<Link href="/?intent=repair" className="roof-primary">
					Explore your personalized demo →
				</Link>
				<div className="pilot-example-grid">
					<Link href="/?intent=repair">
						<small>A homeowner searches</small>
						<strong>“roof leak repair Clear Lake”</strong>
						<span>A page focused on their leak →</span>
					</Link>
					<Link href="/?intent=replacement">
						<small>A homeowner searches</small>
						<strong>“roof replacement League City”</strong>
						<span>A page focused on a new roof →</span>
					</Link>
				</div>
				<p className="pilot-note">
					The slider explains the idea. An ad visitor would arrive directly on
					the matching page. This concept uses your published project photos and
					short customer review excerpts; branding and assets need your approval
					before launch.
				</p>
			</section>
			<section className="pilot-offer">
				<div className="roof-wrap">
					<p className="roof-kicker">Start small. Decide together.</p>
					<h2>A focused first test.</h2>
					<div className="pilot-price-grid">
						<article>
							<small>Setup</small>
							<strong>$0</strong>
							<p>
								Campaign setup, a focused landing page, and call/form tracking.
								Setup is permanently waived for this founding pilot.
							</p>
						</article>
						<article>
							<small>First 30 live days</small>
							<strong>$0</strong>
							<p>
								Management and weekly review. The clock starts when ads launch
								with working tracking.
							</p>
						</article>
						<article>
							<small>Initial advertising cap</small>
							<strong>$1,000</strong>
							<p>
								Paid directly to Google. Proposed total test limit, not a daily
								budget. Further spend needs your explicit approval.
							</p>
						</article>
					</div>
					<p className="pilot-budget-note">
						Already running Google Ads? We would first discuss using an agreed
						portion of your existing budget. For a new account, we check local
						search costs before recommending this test. If $1,000 cannot produce
						useful learning, we say so before you spend.
					</p>
				</div>
			</section>
			<section className="pilot-details roof-wrap">
				<div>
					<p className="roof-kicker">We handle</p>
					<h2>
						The path from search
						<br />
						to your phone.
					</h2>
					<ul>
						<li>Google Search campaign setup and management.</li>
						<li>One agreed service and a small, approved service area.</li>
						<li>A mobile landing page matched to the campaign.</li>
						<li>Call tracking, form attribution, and direct lead delivery.</li>
						<li>
							A short weekly review of spend, inquiries, and lead quality.
						</li>
					</ul>
				</div>
				<div>
					<p className="roof-kicker">You handle</p>
					<h2>
						The work you
						<br />
						already know.
					</h2>
					<ul>
						<li>Approve the services, area, photos, and business details.</li>
						<li>
							Keep ownership of your Google Ads account and pay Google directly.
						</li>
						<li>Have a named person answer calls and return inquiries.</li>
						<li>Reply with simple feedback: good lead, wrong fit, or spam.</li>
					</ul>
					<p>No new CRM or mandatory sales pipeline.</p>
				</div>
			</section>
			<section className="pilot-next roof-wrap">
				<p className="roof-kicker">No surprises after the test</p>
				<h2>Continue only if it makes sense.</h2>
				<p>
					We review progress around day 21. If you choose to continue after the
					free month, the proposed founding rate is{" "}
					<strong>
						$1,250 per month for the next three months, then $1,500 per month
					</strong>
					, with advertising separate. The service scope and price are agreed
					before launch.
				</p>
				<p>
					Ads stop at the agreed spend cap or the end of the trial, whichever
					comes first, unless you approve continuation. No retroactive setup
					fee. A small test can reveal search quality and early inquiry costs;
					it may not produce enough leads to judge profitability. No lead, job,
					or revenue guarantee.
				</p>
				<div className="pilot-status">
					<strong>Proposal status: ready to discuss</strong>
					<p>
						Business approval, account access, keyword forecasts, asset
						permission, and live call/form delivery tests are still required. No
						money has been committed and no ads are running.
					</p>
				</div>
				<Link className="roof-primary" href="/?intent=repair">
					Open the homeowner demo →
				</Link>
				<Link className="pilot-secondary" href="/operator">
					See our internal workspace · Mock numbers →
				</Link>
			</section>
		</main>
	);
}
