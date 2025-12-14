import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'core', 'data', 'sentinel.json');

// Interface definition
export interface Referendum {
  id: number;
  post_id: number;
  title: string;
  proposer: string;
  content: string;
  status: string;
  track_no: number;
  evidence_hash: string;
  risk_score: number | null;
  analyzed_at: string;
}

export function initDb() {
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    console.log("Database initialized: sentinel.json");
  }
}

export function saveReferendum(ref: Partial<Referendum>) {
  const current: Referendum[] = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const index = current.findIndex(r => r.post_id === ref.post_id);

  const newRef = {
    ...ref,
    risk_score: ref.risk_score || null,
    analyzed_at: new Date().toISOString()
  } as Referendum;

  if (index >= 0) {
    // Update existing (preserve risk score if not overwritten)
    newRef.risk_score = current[index].risk_score || newRef.risk_score;
    current[index] = newRef;
  } else {
    current.push(newRef);
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(current, null, 2));
}

export function getUnanalyzed() {
  const current: Referendum[] = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  return current.filter(r => r.risk_score === null);
}

export function getAllReferenda() {
    if (!fs.existsSync(DB_PATH)) return [];
    const current: Referendum[] = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    return current.sort((a, b) => b.post_id - a.post_id);
}
