// Adds a user who is allowed to log in, or resets their password if they already exist.
// Usage: npm run create-user -- <email> <password>
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import bcrypt from 'bcryptjs';

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: npm run create-user -- <email> <password>');
  process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('That does not look like a valid email address.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const dbPath = resolve(process.env.DB_PATH || 'data/store.db');
mkdirSync(dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const hash = bcrypt.hashSync(password, 12);
db.prepare(`
  INSERT INTO users (email, password_hash) VALUES (?, ?)
  ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
`).run(email.trim(), hash);

console.log(`User ${email} saved in ${dbPath}`);
