import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dbPath = process.env.DB_PATH ?? './data/openretention.sqlite';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE,
    name TEXT NOT NULL,
    mrr REAL NOT NULL DEFAULT 0,
    renewal_at TEXT,
    usage_7d REAL NOT NULL DEFAULT 0,
    usage_prev_7d REAL NOT NULL DEFAULT 0,
    last_seen_at TEXT,
    payment_status TEXT NOT NULL DEFAULT 'ok',
    health_score INTEGER NOT NULL DEFAULT 100,
    health_band TEXT NOT NULL DEFAULT 'green',
    health_reasons TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL
  );
`);
