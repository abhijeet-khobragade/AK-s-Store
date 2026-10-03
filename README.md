# AK's Store

A small e-commerce store built with **Angular 19**, **Angular Material** and **Tailwind CSS**, with a **Node/Express** backend for user accounts.

Users sign up or log in, browse a product catalogue, filter and sort it, and manage a shopping cart.

## Features

- **Accounts**: sign up, log in and log out. Passwords are hashed with bcrypt and stored in SQLite; sessions use a JWT in an httpOnly cookie.
- **Protected pages**: the store and cart are only available to logged-in users.
- **Product catalogue**: 24 products across 5 categories, with category filter, price sort, page size and list / 3-column / 4-column layouts.
- **Shopping cart**: add items, change quantities, remove items, and see an order summary.
- **Responsive layout** for phones, tablets and desktop.
- **Server-side rendering** via Angular SSR.

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | Angular 19 (standalone components), Angular Material, Tailwind CSS 4, RxJS |
| Backend | Express (inside the Angular SSR server), `node:sqlite`, bcryptjs, jsonwebtoken, express-rate-limit |

## Getting started

Requires **Node.js 22.13 or newer** (the backend uses the built-in `node:sqlite` module).

```bash
npm install
npm run create-user -- you@example.com YourPassword123   # optional: create an account from the command line
npm start
```

Open http://localhost:4200. You can also create an account from the **Sign up** link on the login page.

### Production build

```bash
npm run build
JWT_SECRET=<long-random-string> npm run serve:ssr:store
```

The server listens on port 4000 by default (set `PORT` to change it).

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `JWT_SECRET` | Secret used to sign login sessions. **Required in production.** | Random per run in development (sessions end when the server restarts) |
| `DB_PATH` | Location of the SQLite database | `data/store.db` |
| `PORT` | Port for the production server | `4000` |

The database file is created automatically and is excluded from git.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account and log in (`{ email, password }`) |
| `POST` | `/api/auth/login` | Log in (`{ email, password }`) |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Current user, or `401` if not logged in |

Login is limited to 10 attempts per 15 minutes and sign-up to 5 per hour, per IP address.

## Project structure

```
src/
  api/                 Express auth routes and SQLite access
  server.ts            Express server (API + Angular SSR)
  app/
    pages/             login, signup, home, cart
    components/        shared header
    services/          auth, cart and product services
    guards/            route guards for logged-in / logged-out pages
    data/products.ts   product catalogue
scripts/create-user.mjs  command-line user creation
public/products/       product images
```

## Roadmap

- Checkout and orders
- Save the cart per user
- Product detail pages

## Credits

Sample product data and images from [DummyJSON](https://dummyjson.com).
