import { useEffect, useState } from "react";
import ExperimentCard from "./ExperimentCard.jsx";
import "../styles/history-page.css";
import { apiUrl } from "../api.js";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/experiments"))
      .then((r) => r.json())
      .then((data) => setHistory(data.experiments || []));
  }, []);
  
  return (
    <main className="shell history-page">
      <div className="page-nav">
        <a href="/">← Home</a>
      </div>
      <div className="section-label">RESEARCH ARCHIVE</div>
      <h1>Past experiments</h1>
      <p className="page-intro">
        Review every question you have structured, without changing the original
        research record.
      </p>
      {history.length ? (
        <div className="history-entries">
          {history.map((item) => (
            <article className="history-entry" key={item.id}>
              <button
                className="history-toggle"
                onClick={() => setOpen(open === item.id ? null : item.id)}
              >
                <span>
                  <small>
                    {item.status === "ready" ? "READY" : "NEEDS CLARIFICATION"}
                  </small>
                  {item.question}
                </span>
                <b>{open === item.id ? "−" : "+"}</b>
              </button>
              {open === item.id && (
          <ExperimentCard
            experiment={item.experiment}
            status={item.status}
            readOnly
          />
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="history-empty">
          No saved experiments yet. Return home to analyze a question.
        </p>
      )}
    </main>
  );
}
