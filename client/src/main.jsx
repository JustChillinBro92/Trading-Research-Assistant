import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import QuestionForm from "./components/QuestionForm.jsx";
import ExperimentCard from "./components/ExperimentCard.jsx";
import ClarificationPanel from "./components/ClarificationPanel.jsx";
import EmptyState from "./components/EmptyState.jsx";
import HistoryPage from "./components/HistoryPage.jsx";
import "./styles/global.css";

function App() {
  if (window.location.pathname === "/history") return <HistoryPage />;
  const [question, setQuestion] = useState("");
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [experiment, setExperiment] = useState(null);
  const [missingInformation, setMissingInformation] = useState([]);
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setOriginalQuestion(data.question);
      setMissingInformation(data.missing_information);
      setStatus(data.status);
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

  return (
    <main className="shell">
      <header className="hero">
        <div className="top-nav"><div className="eyebrow">
          RESEARCH WORKBENCH <span>●</span> AI-ASSISTED
        </div><a href="/history">View history ↗</a></div>
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
            <blockquote>“{originalQuestion}”</blockquote>
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
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
