export function validate(experiment) {
  const missing_information = [];

  if (!experiment.instrument)
    missing_information.push({
      field: "instrument",
      question: "Which instrument should be tested?",
    });
  if (!experiment.timeframe)
    missing_information.push({
      field: "timeframe",
      question: "What timeframe should be used?",
    });
  if (!experiment.entry_condition)
    missing_information.push({
      field: "entry_condition",
      question: "What exactly triggers the entry?",
    });
  if (!experiment.exit_condition && !experiment.holding_period)
    missing_information.push({
      field: "holding_period",
      question:
        "How long should the position be held, or what defines the exit?",
    });
    
  return {
    missing_information,
    status: missing_information.length ? "needs_clarification" : "ready",
  };
}
