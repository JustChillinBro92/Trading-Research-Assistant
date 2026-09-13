import "../styles/experiment-card.css";

const labels = {
  instrument: "Instrument",
  timeframe: "Timeframe",
  entry_condition: "Entry",
  exit_condition: "Exit",
  holding_period: "Holding period",
  filters: "Filters",
  objective: "Objective",
};

export default function ExperimentCard({ experiment, status, onChange }) {
  return (
    <section className="card experiment">
      <div className="card-title">
        <div>
          <div className="section-label">STRUCTURED EXPERIMENT</div>
          <h2>Research specification</h2>
        </div>
        <span className={`badge ${status}`}>
          {status === "ready" ? "● Ready" : "⚠ Needs clarification"}
        </span>
      </div>
      <div className="fields">
        {Object.entries(experiment).map(([field, value]) => (
          <label className="field" key={field}>
            <span>{labels[field]}</span>
            <input
              value={Array.isArray(value) ? value.join(", ") : value || ""}
              placeholder="Not specified"
              onChange={(e) => onChange(field, e.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
