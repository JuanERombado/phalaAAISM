import Database from 'better-sqlite3';

const db = new Database('sentinel.db');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS referenda (
      id INTEGER PRIMARY KEY,
      post_id INTEGER UNIQUE,
      title TEXT,
      proposer TEXT,
      content TEXT,
      status TEXT,
      track_no INTEGER,
      evidence_hash TEXT,
      risk_score INTEGER,
      analyzed_at DATETIME
    );
  `);
  console.log("Database initialized: sentinel.db");
}

export function saveReferendum(ref: any) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO referenda (post_id, title, proposer, content, status, track_no, evidence_hash, analyzed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  
  stmt.run(ref.id, ref.title, ref.proposer, ref.content, ref.status, ref.track_no, ref.evidence_hash);
}

export function getUnanalyzed() {
  return db.prepare('SELECT * FROM referenda WHERE risk_score IS NULL').all();
}
