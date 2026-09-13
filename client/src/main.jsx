import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import QuestionForm from "./components/QuestionForm.jsx";
import ExperimentCard from "./components/ExperimentCard.jsx";
import ClarificationPanel from "./components/ClarificationPanel.jsx";
import HistoryList from "./components/HistoryList.jsx";
import EmptyState from "./components/EmptyState.jsx";
import "./styles/global.css";

function App() {
  const [question, setQuestion] = useState("");
  const [experiment, setExperiment] = useState(null);
  const [missingInformation, setMissingInformation] = useState([]);
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/experiments")
      .then((r) => r.json())
      .then((data) => setHistory(data.experiments || []))
      .catch(() => {});
  }, []);

  async function analyze() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setStatus("loading");
    try {
      const response = await fetch("/api/experiments/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to analyze question.");
      setExperiment(data.experiment);
      setMissingInformation(data.missing_information);
      setStatus(data.status);
      setHistory((current) =>
        [data, ...current.filter((item) => item.id !== data.id)].slice(0, 20),
      );
    } catch (e) {
      setError(e.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setExperiment((current) => ({
      ...current,
      [field]:
        field === "filters"
          ? value
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : value || null,
    }));
  }

  function selectHistory(item) {
    setQuestion(item.question);
    setExperiment(item.experiment);
    setStatus(item.status);
    setMissingInformation([]);
  }
  
  return (
    <main className="shell">
      <header className="hero">
        <div className="eyebrow">
          RESEARCH WORKBENCH <span>●</span> AI-ASSISTED
        </div>
        <h1>
          Turn a market question
          <br />
          <em>into a testable experiment.</em>
        </h1>
        <p className="intro">
          Describe a trading idea in plain language. The assistant structures
          it, spots what’s missing, and gets it ready for research.
        </p>
      </header>
      <QuestionForm
        question={question}
        setQuestion={setQuestion}
        onAnalyze={analyze}
        loading={loading}
      />
      {error && <div className="error card">Something went wrong: {error}</div>}
      {experiment ? (
        <>
          <section className="question-block">
            <div className="section-label">ORIGINAL QUESTION</div>
            <blockquote>“{question}”</blockquote>
          </section>
          <ExperimentCard
            experiment={experiment}
            status={status}
            onChange={updateField}
          />
          {status !== "ready" && (
            <ClarificationPanel
              missingInformation={missingInformation}
              onSelect={updateField}
            />
          )}
        </>
      ) : (
        status === "idle" && <EmptyState />
      )}
      <HistoryList history={history} onSelect={selectHistory} />
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
