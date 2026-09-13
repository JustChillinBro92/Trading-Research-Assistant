import Database from "better-sqlite3";

const db = new Database(
    process.env.DATABASE_PATH
);

db.exec(
  "CREATE TABLE IF NOT EXISTS experiments (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, experiment_json TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
);

export function saveExperiment(result) {
  return db
    .prepare(
      "INSERT INTO experiments (question, experiment_json, status) VALUES (?, ?, ?)",
    )
    .run(result.question, JSON.stringify(result.experiment), result.status)
    .lastInsertRowid;
}

export function listExperiments() {
  return db
    .prepare(
      "SELECT id, question, experiment_json, status, created_at FROM experiments ORDER BY id DESC LIMIT 20",
    )
    .all()
    .map((row) => ({
      id: row.id,
      question: row.question,
      experiment: JSON.parse(row.experiment_json),
      status: row.status,
      created_at: row.created_at,
    }));
}
