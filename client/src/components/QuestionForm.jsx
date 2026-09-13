import "../styles/question-form.css";

export default function QuestionForm({
  question,
  setQuestion,
  onAnalyze,
  loading,
}) {
  return (
    <section className="ask card">
      <label htmlFor="question">Your research question</label>
      <div className="input-row">
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), onAnalyze())
          }
          placeholder="e.g. Does buying NIFTY after a 1% fall work better during high-volatility periods?"
        />
        <button onClick={onAnalyze} disabled={loading || !question.trim()}>
          {loading ? "Analyzing…" : "Analyze"} <span>↗</span>
        </button>
      </div>
      <div className="hint">
        Press Enter to analyze · Shift + Enter for a new line
      </div>
    </section>
  );
}
