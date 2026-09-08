const rows = [
  ["Roof Replacement", "$1,842", "11", "$167", "6", "2", "Good"],
  ["Storm Damage", "$1,106", "5", "$221", "4", "2", "Good"],
  ["Roof Repair", "$812", "7", "$116", "2", "0", "Watch"],
  ["Broad / Research", "$426", "1", "$426", "0", "0", "Waste"]
];

export default function Operator() {
  return (
    <main className="wrap" style={{paddingTop:32}}>
      <div className="demo-note">Mock operator data. The production connector should start read-only and require explicit approval before any Google Ads write.</div>
      <div className="nav"><div><div className="kicker">Roofing Revenue OS</div><div className="brand" style={{fontSize:30}}>Operator dashboard</div></div><a className="btn btn-secondary" href="/">← Funnel</a></div>
      <div className="cards">
        <div className="card"><div className="muted">Spend</div><div className="metric">$4,186</div></div>
        <div className="card"><div className="muted">Qualified leads</div><div className="metric">24</div></div>
        <div className="card"><div className="muted">Booked inspections</div><div className="metric">12</div></div>
      </div>
      <section className="section"><div className="card"><strong>Campaign performance</strong>
      <table className="table"><thead><tr><th>Campaign</th><th>Spend</th><th>Qualified</th><th>CPQL</th><th>Booked</th><th>Won</th><th>Status</th></tr></thead>
      <tbody>{rows.map((r) => <tr key={r[0]}>{r.slice(0,6).map((v,i)=><td key={i}>{v}</td>)}<td><span className={`pill ${r[6]==="Watch"?"warn":r[6]==="Waste"?"bad":""}`}>{r[6]}</span></td></tr>)}</tbody></table></div></section>
      <section style={{paddingBottom:50}}>
        <div className="kicker">Daily Ads Analyst — mock output</div><h2 style={{fontSize:34}}>Recommended actions</h2>
        <div className="reco"><strong>Cut waste:</strong> Broad / Research spent $426 for one qualified lead and zero booked inspections. Recommend pausing after human approval and reallocating test budget to Replacement.</div>
        <div className="reco"><strong>Protect quality:</strong> Roof Repair has the cheapest CPQL but only 2/7 qualified leads booked and no won jobs. Do not scale based on CPL alone.</div>
        <div className="reco"><strong>Investigate search terms:</strong> Pull terms with spend ≥ $50 and zero qualified leads; draft negatives for review.</div>
      </section>
    </main>
  );
}
