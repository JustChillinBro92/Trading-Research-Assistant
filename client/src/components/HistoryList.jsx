import "../styles/history.css";

export default function HistoryList({ history, onSelect }) {
  return (
    <section className="history">
      <div className="section-label">RECENT EXPERIMENTS</div>
      {history.length ? (
        history.map((item) => (
          <button key={item.id} onClick={() => onSelect(item)}>
            {item.question}
            <span>↗</span>
          </button>
        ))
      ) : (
        <p className="history-empty">
          No saved experiments yet. Analyze a question to create one.
        </p>
      )}
    </section>
  );
}
