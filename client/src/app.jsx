import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import AppHeader from "./components/AppHeader.jsx";
import ModeToggle from "./components/ModeToggle.jsx";
import BatchUploadPanel from "./components/BatchUploadPanel.jsx";
import AnalysisResult from "./components/AnalysisResult.jsx";
import QuestionForm from "./components/QuestionForm.jsx";
import EmptyState from "./components/EmptyState.jsx";
import HistoryPage from "./components/HistoryPage.jsx";
import "./styles/global.css";
import "./styles/batch-analyzer.css";

function App() {
  if (window.location.pathname === "/history") return <HistoryPage />;
  const [question, setQuestion] = useState("");
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [experiment, setExperiment] = useState(null);
  const [missingInformation, setMissingInformation] = useState([]);
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchFile, setBatchFile] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [batchIndex, setBatchIndex] = useState(0);

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
      setQuestion("");
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

  async function saveChanges() {
    setSaving(true);
    setError(null);

    const savedQuestion = batchMode
      ? batchResults[batchIndex]?.question
      : originalQuestion;

    const savedExperiment = batchMode
      ? batchResults[batchIndex]?.experiment
      : experiment;

    try {
      const response = await fetch("/api/save-experiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: savedQuestion,
          experiment: savedExperiment,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to save experiment.");

      if (batchMode) {
        setBatchResults((current) =>
          current.filter((_, index) => index !== batchIndex),
        );
        setBatchIndex((index) =>
          Math.min(index, Math.max(batchResults.length - 2, 0)),
        );
      } else {
        setExperiment(null);
        setOriginalQuestion("");
        setStatus("idle");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function analyzeBatch() {
    if (!batchFile) return;
    setLoading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", batchFile);
      const response = await fetch("/api/experiments/batch-analyze", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setBatchResults(data.results || []);
      setBatchIndex(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    const source = batchMode
      ? batchResults[batchIndex]?.experiment
      : experiment;
      
    const next = {
      ...source,
      [field]:
        field === "filters"
          ? value
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : value || null,
    };

    const missing = [];
    if (!next.instrument)
      missing.push({
        field: "instrument",
        question: "Which instrument should be tested?",
      });
    if (!next.timeframe)
      missing.push({
        field: "timeframe",
        question: "What timeframe should be used?",
      });
    if (!next.entry_condition)
      missing.push({
        field: "entry_condition",
        question: "What exactly triggers the entry?",
      });
    if (!next.exit_condition && !next.holding_period)
      missing.push({
        field: "holding_period",
        question:
          "How long should the position be held, or what defines the exit?",
      });

    const nextStatus = missing.length ? "needs_clarification" : "ready";
    if (batchMode)
      setBatchResults((current) =>
        current.map((item, index) =>
          index === batchIndex
            ? {
                ...item,
                experiment: next,
                status: nextStatus,
                missing_information: missing,
              }
            : item,
        ),
      );
    else {
      setExperiment(next);
      setMissingInformation(missing);
      setStatus(nextStatus);
    }
  }

  const currentBatch = batchResults[batchIndex];
  const displayedExperiment = batchMode ? currentBatch?.experiment : experiment;
  const displayedStatus = batchMode ? currentBatch?.status : status;

  return (
    <main className="shell">
      <AppHeader />
      <ModeToggle
        batchMode={batchMode}
        onToggle={() => setBatchMode((value) => !value)}
      />
      {batchMode ? (
        <BatchUploadPanel
          file={batchFile}
          loading={loading}
          onFileChange={(e) => {
            setBatchFile(e.target.files?.[0] || null);
            setBatchResults([]);
          }}
          onAnalyze={analyzeBatch}
        />
      ) : (
        <QuestionForm
          question={question}
          setQuestion={setQuestion}
          onAnalyze={analyze}
          loading={loading}
        />
      )}
      {error && <div className="error card">Something went wrong: {error}</div>}
      {displayedExperiment ? (
        <AnalysisResult
          experiment={displayedExperiment}
          status={displayedStatus}
          question={currentBatch?.question}
          originalQuestion={originalQuestion}
          onChange={updateField}
          onSave={saveChanges}
          saving={saving}
          missingInformation={batchMode ? currentBatch?.missing_information || [] : missingInformation}
          batchMode={batchMode}
          batchIndex={batchMode ? batchIndex : undefined}
          batchCount={batchMode ? batchResults.length : undefined}
          onPrevious={() => setBatchIndex((value) => value - 1)}
          onNext={() => setBatchIndex((value) => value + 1)}
        />
      ) : (
        status === "idle" && <EmptyState />
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
