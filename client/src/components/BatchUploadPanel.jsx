export default function BatchUploadPanel({
  file,
  loading,
  onFileChange,
  onAnalyze,
}) {
  return (
    <section className="batch-panel card">
      <div className="section-label">BATCH ANALYSIS</div>
      <h2>Analyze questions from a document</h2>
      <p>Upload TXT, DOCX, or PDF containing multiple research questions.</p>
      <div className="batch-controls">
        <label className="file-picker">
          {file ? file.name : "Choose TXT, DOCX, or PDF"}
          <input type="file" accept=".txt,.docx,.pdf" onChange={onFileChange} />
        </label>
        <button onClick={onAnalyze} disabled={!file || loading}>
          {loading ? "Analyzing…" : "Analyze file"}
        </button>
      </div>
    </section>
  );
}
