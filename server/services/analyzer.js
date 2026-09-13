import { GoogleGenerativeAI } from "@google/generative-ai";
import { validate } from "./validator.js";

const schema = {
  type: "object",
  properties: {
    instrument: { type: "string", nullable: true },
    timeframe: { type: "string", nullable: true },
    entry_condition: { type: "string", nullable: true },
    exit_condition: { type: "string", nullable: true },
    holding_period: { type: "string", nullable: true },
    filters: { type: "array", items: { type: "string" } },
    objective: { type: "string", nullable: true },
  },
  required: [
    "instrument",
    "timeframe",
    "entry_condition",
    "exit_condition",
    "holding_period",
    "filters",
    "objective",
  ],
};

const base = () => ({
  instrument: null,
  timeframe: null,
  entry_condition: null,
  exit_condition: null,
  holding_period: null,
  filters: [],
  objective: null,
});

async function fromGemini(question) {
  const model = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY,
  ).getGenerativeModel({
    model: process.env.GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `
    Extract this trading research question into JSON. 
    Never invent missing information; use null. 
    Generate no advice, results, or recommendations.

    Important field definitions:
    - timeframe means the frequency/granularity of the market data being analyzed, such as Daily, Weekly, Hourly, or 15-minute.
    - holding_period means how long the position remains open, such as 3 days.

    Question: ${question}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function analyzeQuestion(question) {
  if (!process.env.GEMINI_API_KEY)
    throw new Error("GEMINI_API_KEY is not configured.");

  let experiment = await fromGemini(question);
  experiment = {
    ...base(),
    ...experiment,
    filters: Array.isArray(experiment.filters) ? experiment.filters : [],
  };
  return { question, experiment, ...validate(experiment) };
}

export async function analyzeQuestionsBatch(text) {
  if (!process.env.GEMINI_API_KEY)
    throw new Error("GEMINI_API_KEY is not configured.");

  const model = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY,
  ).getGenerativeModel({
    model: process.env.GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: { question: { type: "string" }, experiment: schema },
              required: ["question", "experiment"],
            },
          },
        },
        required: ["results"],
      },
    },
  });

  const result = await model.generateContent(`
    Extract every DISTINCT trading research question from this document and structure each. 
    Return one result per question. 
    Ignore headings, notes, answers, and non-question text. 
    Never invent missing information; use null. 
    Generate no advice, results, or recommendations.

    Important field definitions:
    - timeframe means the frequency/granularity of the market data being analyzed, such as Daily, Weekly, Hourly, or 15-minute.
    - holding_period means how long the position remains open, such as 3 days.
    - Only set timeframe when data frequency is explicitly stated.
    
    Document:\n${text}`,
  );

  return JSON.parse(result.response.text()).results.map((item) => {
    const experiment = {
      ...base(),
      ...item.experiment,
      filters: Array.isArray(item.experiment.filters)
        ? item.experiment.filters
        : [],
    };
    return { question: item.question, experiment, ...validate(experiment) };
  });
}
