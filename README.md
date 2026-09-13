# AI Trading Research Assistant

A React and Express prototype that turns natural-language trading research questions into structured experiments.

## Technologies used

- React 18 and JavaScript
- Vite
- Node.js and Express
- SQLite via `better-sqlite3`
- Gemini via `@google/generative-ai`
- `multer` for uploads
- `mammoth` for DOCX extraction
- `pdf-parse` for PDF extraction
- Component-level CSS

## AI tools used

-> ChatGpt (For Clarity)
-> Codex (For Building)
-> Gemini (LLM API)

## Architecture

React client → Express API → Gemini structured output → validation → SQLite on explicit save


The client manages UI state and field editing. The server owns Gemini access, document extraction, validation, and persistence. Single and batch analysis share the same experiment card UI.


## Workflow

Single-question analysis extracts an experiment, identifies missing information, allows field edits, and saves only when **Save changes** is pressed.

Batch mode accepts `.txt`, `.docx`, and `.pdf` files. The server makes a request for the complete document and returns all structured experiments. Results appear one at a time with proper navigation. Each batch experiment can be edited, clarified, and saved individually.

A sample text file is provided in the `test` folder for batch extraction



## Key decisions

- Keep the experiment as one object rather than separate state variables per field.
- Analyze a complete batch document with one Gemini request to control cost.
- Reuse `ExperimentCard` for editable, batch, and read-only history views.
- Save only after explicit user confirmation.
- Use SQLite for lightweight local persistence.
- Keep saved history on a separate route with collapsible read-only entries.

## What I would improve with more time

- Add automated frontend and backend tests.
- Improve question-boundary detection and support OCR for scanned PDFs.
- Add upload progress, cancellation, and per-question batch errors.
- Add draft recovery for unsaved edits.
- Add authentication and per-user experiment ownership.
- Add a backtesting execution layer after the experiment-definition workflow is stable.

## Experiment schema

```js
{
  instrument: null,
  timeframe: null,
  entry_condition: null,
  exit_condition: null,
  holding_period: null,
  filters: [],
  objective: null
}
```

## Persistence and history

Open saved experiments at:

```text
http://localhost:5173/history
```

The history page contains collapsible, read-only experiment cards.

## API

- `GET /api/health` — health check
- `POST /api/experiments/analyze` — analyze one question without saving
- `POST /api/experiments/batch-analyze` — analyze all questions in one uploaded document request
- `POST /api/save-experiment` — explicitly save an experiment
- `GET /api/experiments` — list saved experiments

## Structure

```text
client/src/components/   React UI components
client/src/styles/       Global and component styles
server/services/         Gemini extraction, validation, document parsing
server/db.js             SQLite persistence
server/index.js          Express API
data/experiments.db      Runtime database
```

## Run locally


Open `http://localhost:5173`.

Required environment variables:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
PORT=3001
DATABASE_PATH=data/experiments.db
```

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

```

