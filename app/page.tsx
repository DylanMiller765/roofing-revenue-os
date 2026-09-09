import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import { clientConfig, demoDisclaimer } from "@/config/client";

const journey = [
  ["Tell us what changed", "Homeowner status, roof need, ZIP, roof age and reachable contact details."],
  ["Keep the source attached", "UTM parameters and click IDs stay with the lead for later outcome measurement."],
  ["Measure what happens next", "Qualified, booked, estimated and won stages matter more than a raw form count."]
] as const;

export default function Page() {
  return (
    <main className="public-shell">
      <div className="demo-rail" role="note">
        <div className="wrap demo-rail__inner">
          <strong>Demo environment</strong>
          <span>{demoDisclaimer}</span>
        </div>
      </div>

      <div className="public-header wrap">
        <a className="brand-lockup" href="#top" aria-label={`${clientConfig.name} demo home`}>
          <span className="brand-mark" aria-hidden="true"><i /></span>
          <span><strong>{clientConfig.shortName}</strong><small>Fictional Houston demo</small></span>
        </a>
        <Link className="text-link" href="/operator">View operator demo <span aria-hidden="true">↗</span></Link>
      </div>

      <div className="wrap" id="top">
        <section className="conversion-hero">
          <div className="hero-copy">
            <p className="context-line"><span aria-hidden="true" /> {clientConfig.city} roof inspection flow</p>
            <h1>Roof concern after a {clientConfig.city} storm?</h1>
            <p className="hero-subhead">
              Walk through a short inspection-request demo built to capture the details a roofing team needs—and keep the ad click connected to the outcome.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#request">Start demo request</a>
              <a className="button button--quiet" href={`tel:${clientConfig.phone}`} aria-label={`Call fictional demo number ${clientConfig.phoneDisplay}`}>
                <span className="phone-icon" aria-hidden="true">⌕</span> Call demo line
              </a>
            </div>
            <p className="callout-line">{clientConfig.phoneDisplay} · fictional 555 demo number</p>

            <section className="field-board" aria-label="Demo inspection request overview">
              <div className="roofline" aria-hidden="true"><span /><i /><b /></div>
              <div className="field-board__header">
                <span>Inspection intake</span><strong>Demo only</strong>
              </div>
              <dl>
                <div><dt>Market</dt><dd>{clientConfig.market}</dd></div>
                <div><dt>Request</dt><dd>Roof concern</dd></div>
                <div><dt>Routing</dt><dd>Mock workflow</dd></div>
              </dl>
            </section>
          </div>

          <div id="request" className="form-anchor">
            <LeadForm />
          </div>
        </section>

        <section className="journey-section" aria-labelledby="journey-title">
          <div className="section-heading">
            <p>What this demo proves</p>
            <h2 id="journey-title">The lead is only the beginning.</h2>
          </div>
          <div className="journey-list">
            {journey.map(([title, description], index) => (
              <article key={title}>
                <span>{index + 1}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="outcome-strip" aria-label="Measured funnel stages">
          <p>Revenue journey</p>
          <ol>
            <li>Search click</li><li>Lead</li><li>Qualified</li><li>Inspection</li><li>Estimate</li><li>Won job</li>
          </ol>
        </section>

        <footer className="public-footer">
          <span>Roofing Revenue OS</span>
          <p>{demoDisclaimer}</p>
          <Link href="/operator">Open operator dashboard</Link>
        </footer>
      </div>

      <nav className="mobile-action-bar" aria-label="Demo actions">
        <a href={`tel:${clientConfig.phone}`}>Call demo</a>
        <a href="#request">Start request</a>
      </nav>
    </main>
  );
}
