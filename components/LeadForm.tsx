"use client";

import { FormEvent, useState } from "react";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setStatus("done");
  }

  if (status === "done") {
    return <div className="card"><strong>Demo lead captured.</strong><p className="muted">In production this would route to the roofer + CRM and preserve the click ID for offline conversion tracking.</p></div>;
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Request a roof inspection</h2>
      <div className="field"><label>Are you the homeowner?</label><select name="homeowner" required><option value="">Choose one</option><option>Yes</option><option>No</option></select></div>
      <div className="field"><label>What do you need help with?</label><select name="need" required><option value="">Choose one</option><option>Roof replacement</option><option>Leak / repair</option><option>Storm / hail damage inspection</option><option>Not sure</option></select></div>
      <div className="grid2">
        <div className="field"><label>ZIP code</label><input name="zip" inputMode="numeric" required /></div>
        <div className="field"><label>Roof age</label><select name="roofAge"><option>Unknown</option><option>0–5 years</option><option>6–10 years</option><option>11–20 years</option><option>20+ years</option></select></div>
      </div>
      <div className="grid2">
        <div className="field"><label>Name</label><input name="name" required /></div>
        <div className="field"><label>Phone</label><input name="phone" type="tel" required /></div>
      </div>
      <input type="hidden" name="gclid" value="demo-gclid-placeholder" />
      <button className="btn btn-primary" disabled={status === "sending"} style={{width:"100%"}}>{status === "sending" ? "Submitting…" : "Schedule my inspection"}</button>
      <p className="muted" style={{fontSize:12}}>Demo only. No real roofing service is being offered from this page.</p>
    </form>
  );
}
