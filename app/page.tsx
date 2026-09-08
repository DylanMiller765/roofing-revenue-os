import LeadForm from "@/components/LeadForm";

export default function Page() {
  return (
    <main>
      <div className="topbar"><div className="wrap">DEMO FUNNEL — fictional roofing company for sales demonstrations</div></div>
      <div className="wrap">
        <nav className="nav"><div className="brand">Lone Star Roof Co.</div><a className="btn btn-secondary" href="/operator">Operator dashboard →</a></nav>
        <div className="demo-note">This is deliberately labeled as a demo. Replace brand claims, reviews, licenses, warranties, service area, phone numbers and testimonials only with verified client information.</div>
        <section className="hero">
          <div>
            <span className="badge">Houston roof inspection demo</span>
            <h1>Think your roof took storm damage?</h1>
            <p className="sub">A high-intent landing page designed to turn paid search traffic into qualified homeowner inspection requests—without making sketchy insurance promises.</p>
            <div className="ctas"><a href="#lead" className="btn btn-primary">Schedule an inspection</a><a href="tel:+10000000000" className="btn btn-secondary">Call now</a></div>
            <div className="proof"><span>✓ Fast response</span><span>✓ Houston-area service</span><span>✓ Repair & replacement intent</span></div>
          </div>
          <div id="lead"><LeadForm /></div>
        </section>

        <section className="section">
          <div className="kicker">How the system works</div><h2>Track the whole roofing sales journey.</h2><p className="sub">The first version is built around the metric we actually care about: what happens after the lead.</p>
          <div className="cards">
            <div className="card"><strong>1. Search intent</strong><p className="muted">Separate replacement, repair, inspection and storm intent so spend is understandable.</p></div>
            <div className="card"><strong>2. Qualified lead</strong><p className="muted">Capture homeowner, need, ZIP, roof age, phone and click attribution.</p></div>
            <div className="card"><strong>3. Offline outcome</strong><p className="muted">Push inspection booked, estimate and won-job outcomes back into measurement.</p></div>
          </div>
        </section>
        <footer className="footer">Roofing Revenue OS MVP — demo brand only.</footer>
      </div>
    </main>
  );
}
