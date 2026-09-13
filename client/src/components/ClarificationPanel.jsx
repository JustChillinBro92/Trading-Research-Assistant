import "../styles/clarification.css";

export default function ClarificationPanel({ missingInformation, onSelect }) {
  return (
    <section className="clarify">
      <div className="section-label">NEXT STEP</div>
      <h2>Let’s make this testable.</h2>
      <p>
        The experiment needs a little more definition before it can be
        evaluated.
      </p>
      {missingInformation.map((item) => (
        <div className="missing" key={item.field}>
          <span>⚠</span>
          <div>
            <strong>{item.question}</strong>
            <div className="choices">
              {item.field === "holding_period" &&
                ["1 day", "3 days", "5 days", "Custom"].map((x) => (
                  <button key={x} onClick={() => onSelect("holding_period", x)}>
                    {x}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
