import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeQuestion, analyzeQuestionsBatch } from "./services/analyzer.js";
import { extractDocument } from "./services/documentExtractor.js";
import { listExperiments, saveExperiment } from "./db.js";
import { validate } from "./services/validator.js";
import multer from "multer";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () =>
  console.log(`API running on port ${port}`),
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
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

app.post("/api/experiments/batch-analyze",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ error: "Upload a TXT, DOCX, or PDF file." });

      const text = await extractDocument(req.file);
      const analyzed = await analyzeQuestionsBatch(text);
      const results = [];

      for (const result of analyzed) {
        results.push(result);
      }

      res.json({ filename: req.file.originalname, results });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: error.message || "Batch analysis failed." });
    }
  },
);

app.get("/api/experiments", (_, res) =>
  res.json({ experiments: listExperiments() }),
);

app.post("/api/save-experiment", (req, res) => {
  try {
    const experiment = req.body?.experiment;
    if (!experiment)
      return res.status(400).json({ error: "An experiment is required." });
    const result = { experiment, ...validate(experiment) };
    const id = saveExperiment({ question: req.body.question, ...result });
    res.status(201).json({ id, question: req.body.question, ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save experiment." });
  }
});
