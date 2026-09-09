"use client";

import { type FormEvent, useState } from "react";
import { clientConfig } from "@/config/client";
import { extractAttribution } from "@/lib/attribution";

type SubmitState = "idle" | "sending" | "done" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    setMessage("");

    try {
      const form = new FormData(formElement);
      const attribution = extractAttribution(new URLSearchParams(window.location.search));
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form.entries()), ...attribution })
      });

      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "The demo request could not be recorded.");

      setStatus("done");
      formElement.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The demo request could not be recorded.");
    }
  }

  if (status === "done") {
    return (
      <div className="lead-panel lead-success" role="status">
        <span className="success-mark" aria-hidden="true">✓</span>
        <p>Demo request recorded</p>
        <h2>No contractor was contacted.</h2>
        <p className="form-intro">In a configured client account, the lead and its attribution would route into the operator workflow.</p>
        <button className="button button--dark" type="button" onClick={() => setStatus("idle")}>Try another demo</button>
      </div>
    );
  }

  return (
    <form className="lead-panel" onSubmit={submit}>
      <div className="form-heading">
        <p>About 60 seconds</p>
        <h2>Start an inspection request</h2>
        <span>{clientConfig.responseExpectation}</span>
      </div>

      <div className="form-field">
        <label htmlFor="homeowner">Are you the homeowner?</label>
        <select id="homeowner" name="homeowner" required defaultValue="">
          <option value="" disabled>Choose one</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="need">What does the roof need?</label>
        <select id="need" name="need" required defaultValue="">
          <option value="" disabled>Choose the closest option</option>
          <option value="replacement">Possible replacement</option>
          <option value="repair">Leak or repair</option>
          <option value="storm">Storm or hail inspection</option>
          <option value="unknown">Not sure yet</option>
        </select>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="zip">Property ZIP</label>
          <input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}" maxLength={5} placeholder="77008" required />
        </div>
        <div className="form-field">
          <label htmlFor="roofAge">Roof age</label>
          <select id="roofAge" name="roofAge" defaultValue="unknown">
            <option value="unknown">Not sure</option>
            <option value="0-5">0–5 years</option>
            <option value="6-10">6–10 years</option>
            <option value="11-20">11–20 years</option>
            <option value="20-plus">20+ years</option>
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Mobile phone</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(713) 555-0184" minLength={10} required />
        </div>
      </div>

      <button className="button button--primary form-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Recording demo…" : "Record demo request"}
      </button>
      <p className="form-legal">Demo only. Submitting does not request or authorize roofing, insurance, or inspection services.</p>
      <p className="form-error" aria-live="polite">{status === "error" ? message : ""}</p>
    </form>
  );
}
