import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
}

const DB_PATH = resolve(process.env['DB_PATH'] || 'data/store.db');

let db: DatabaseSync | undefined;

// Opened lazily so that building/prerendering the app never touches the database.
export function getDb(): DatabaseSync {
  if (!db) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }
  return db;
}

export function findUserByEmail(email: string): UserRow | undefined {
  return getDb()
    .prepare('SELECT id, email, password_hash FROM users WHERE email = ?')
    .get(email) as UserRow | undefined;
}

/** Throws if the email is already taken (UNIQUE constraint). */
export function createUser(email: string, passwordHash: string): { id: number; email: string } {
  const result = getDb()
    .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    .run(email, passwordHash);
  return { id: Number(result.lastInsertRowid), email };
}

export function findUserById(id: number): UserRow | undefined {
  return getDb()
    .prepare('SELECT id, email, password_hash FROM users WHERE id = ?')
    .get(id) as UserRow | undefined;
}
