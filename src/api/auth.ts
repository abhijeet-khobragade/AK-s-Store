import express, { NextFunction, Request, Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { createUser, findUserByEmail, findUserById } from './db';

const COOKIE_NAME = 'store_session';
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours

const JWT_SECRET = resolveSecret();

// Compared against when the email is unknown, so a missing user takes as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

function resolveSecret(): string {
  const secret = process.env['JWT_SECRET'];
  if (secret) {
    return secret;
  }
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('JWT_SECRET must be set in production.');
  }
  console.warn('JWT_SECRET not set; using a random secret. Sessions will end when the server restarts.');
  return randomBytes(32).toString('hex');
}

interface SessionPayload {
  sub: string;
  email: string;
}

export interface AuthedRequest extends Request {
  user?: { id: number; email: string };
}

/** Rejects requests without a valid session cookie. Use on any route that serves private data. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: 'Not logged in.' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload;
    const user = findUserById(Number(payload.sub));
    if (!user) {
      res.status(401).json({ message: 'Not logged in.' });
      return;
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many sign-up attempts. Try again later.' },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
// bcrypt ignores anything past 72 bytes, so longer passwords would silently be truncated.
const MAX_PASSWORD_BYTES = 72;

function readCredentials(req: Request): { email: string; password: string } {
  return {
    email: typeof req.body?.email === 'string' ? req.body.email.trim() : '',
    password: typeof req.body?.password === 'string' ? req.body.password : '',
  };
}

function startSession(req: Request, res: Response, user: { id: number; email: string }): void {
  const token = jwt.sign({ sub: String(user.id), email: user.email } satisfies SessionPayload, JWT_SECRET, {
    expiresIn: SESSION_MS / 1000,
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: req.secure,
    maxAge: SESSION_MS,
    path: '/',
  });
}

export function authRouter(): Router {
  const router = Router();
  router.use(express.json({ limit: '10kb' }));

  router.post('/register', registerLimiter, async (req: Request, res: Response) => {
    const { email, password } = readCredentials(req);
    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      res.status(400).json({ message: 'Enter a valid email address.' });
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
      return;
    }
    if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
      res.status(400).json({ message: 'Password is too long.' });
      return;
    }
    if (findUserByEmail(email)) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let user;
    try {
      user = createUser(email, passwordHash);
    } catch {
      // Another request registered the same email while we were hashing.
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    startSession(req, res, user);
    res.status(201).json({ email: user.email });
  });

  router.post('/login', loginLimiter, async (req: Request, res: Response) => {
    const { email, password } = readCredentials(req);
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = findUserByEmail(email);
    const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
    if (!user || !valid) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    startSession(req, res, user);
    res.json({ email: user.email });
  });

  router.post('/logout', (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.status(204).end();
  });

  router.get('/me', requireAuth, (req: AuthedRequest, res: Response) => {
    res.json({ email: req.user!.email });
  });

  return router;
}
