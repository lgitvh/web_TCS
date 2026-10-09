import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const file = process.env.DB_FILE || new URL('../data/game.db', import.meta.url).pathname
mkdirSync(dirname(file), { recursive: true })

export const db = new DatabaseSync(file)
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE COLLATE NOCASE,
    name TEXT UNIQUE COLLATE NOCASE,
    pass TEXT,
    created INTEGER,
    state TEXT,
    power INTEGER DEFAULT 0,
    lv INTEGER DEFAULT 1,
    endless INTEGER DEFAULT 0,
    arena_rank INTEGER,
    bot INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER, created INTEGER);
  CREATE TABLE IF NOT EXISTS chat (id INTEGER PRIMARY KEY, user_id INTEGER, name TEXT, text TEXT, kind TEXT, ts INTEGER);
  CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT);
`)

export function kvGet(key) {
  const row = db.prepare('SELECT value FROM kv WHERE key = ?').get(key)
  return row ? JSON.parse(row.value) : null
}

export function kvSet(key, value) {
  db.prepare('INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, JSON.stringify(value))
}
