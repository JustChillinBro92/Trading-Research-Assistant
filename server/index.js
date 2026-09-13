import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeQuestion } from "./services/analyzer.js";
import { listExperiments, saveExperiment } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () =>
  console.log(`API running on http://localhost:${process.env.PORT}`),
);

app.get("/", (_, res) =>
  res.json({
    service: "AI Trading Research Assistant API",
    ui: "http://localhost:5173",
    health: "/api/health",
  }),
);

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/experiments/analyze", async (req, res) => {
  try {
    if (!req.body?.question?.trim())
      return res
        .status(400)
        .json({ error: "A research question is required." });
    const result = await analyzeQuestion(req.body.question.trim());
    result.id = saveExperiment(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

app.get("/api/experiments", (_, res) =>
  res.json({ experiments: listExperiments() }),
);
