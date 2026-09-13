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

export default function ExperimentCard({
  experiment,
  status,
  onChange,
  onSave,
  saving = false,
  readOnly = false,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
}) {
  
  return (
    <section className={`card experiment ${readOnly ? "read-only" : ""}`}>
      <div className="card-title">
        <div>
          <div className="section-label">STRUCTURED EXPERIMENT</div>
          <h2>Research specification</h2>
        </div>
        <span className={`badge ${status}`}>
          {status === "ready" ? "● Ready" : "⚠ Needs clarification"}
        </span>
      </div>
      {totalCount > 1 && (
        <div className="experiment-pagination">
          <button disabled={currentIndex === 0} onClick={onPrevious}>
            ← Previous
          </button>
          <span>
            Experiment {currentIndex + 1} of {totalCount}
          </span>
          <button disabled={currentIndex === totalCount - 1} onClick={onNext}>
            Next →
          </button>
        </div>
      )}
      <div className="fields">
        {Object.entries(experiment).map(([field, value]) => (
          <label className="field" key={field}>
            <span>{labels[field]}</span>
            {readOnly ? (
              <div className="readonly-value">
                {Array.isArray(value)
                  ? value.join(", ") || "Not specified"
                  : value || "Not specified"}
              </div>
            ) : (
              <input
                value={Array.isArray(value) ? value.join(", ") : value || ""}
                placeholder="Not specified"
                onChange={(e) => onChange(field, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>
      {!readOnly && onSave && (
        <div className="card-actions">
          <button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}
    </section>
  );
}
