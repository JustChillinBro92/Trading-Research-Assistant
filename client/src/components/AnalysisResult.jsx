import ExperimentCard from "./ExperimentCard.jsx";
import ClarificationPanel from "./ClarificationPanel.jsx";

export default function AnalysisResult({
  experiment,
  status,
  question,
  originalQuestion,
  onChange,
  onSave,
  saving,
  missingInformation,
  batchMode,
  batchIndex,
  batchCount,
  onPrevious,
  onNext,
}) {
  if (!experiment) return null;
  return (
    <>
      <section className="question-block">
        <div className="section-label">ORIGINAL QUESTION</div>
        <blockquote>“{batchMode ? question : originalQuestion}”</blockquote>
      </section>
      <ExperimentCard
        experiment={experiment}
        status={status}
        onChange={onChange}
        onSave={onSave}
        saving={saving}
        readOnly={false}
        currentIndex={batchIndex}
        totalCount={batchCount}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      {status !== "ready" && (
        <ClarificationPanel
          missingInformation={missingInformation}
          onSelect={onChange}
        />
      )}
    </>
  );
}
