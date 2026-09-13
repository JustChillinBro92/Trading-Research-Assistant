# AI Trading Research Assistant

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`. Set `GEMINI_API_KEY` in `.env`; analysis is Gemini-only and the key is never exposed to the browser. History is stored in SQLite at `data/experiments.db`.

The API preserves the original question, validates the extracted experiment independently of Gemini, and returns `needs_clarification` until a required entry/exit or holding period is present. Gemini is only called server-side.
