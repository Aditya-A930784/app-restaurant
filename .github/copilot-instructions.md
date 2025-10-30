## Purpose
This file gives a concise, actionable summary for AI coding assistants to be immediately productive in this repository (RWOS — Restaurant Work Order System).

## Big-picture architecture (quick)
- Monorepo-like layout with separate admin frontend and backend apps:
  - Backend: `rwos-admin-app/rwos-app/backend` — Express + MongoDB + Socket.io; routes under `routes/`, data models in `models/`.
  - Admin Frontend: `rwos-admin-frontend` — Expo (React Native) app. Uses `src/services/api.js` to call backend.
  - Mobile/other apps live under `rwos-app-mobile`, `rwos-mobile`, and `rwos-admin-app/rwos-app/frontend` (inspect when required).

## Key files to reference
- Server entry: `rwos-admin-app/rwos-app/backend/server.js` (sets up middleware, rate-limit, socket.io, attaches `io` to `req`).
- Auth middleware: `rwos-admin-app/rwos-app/backend/middleware/auth.js` (JWT verification & attaches `req.user`).
- Example route: `rwos-admin-app/rwos-app/backend/routes/auth.js` (register/login flows, JWT creation).
- Example model: `rwos-admin-app/rwos-app/backend/models/Menu.js` (schema enums and required fields).
- Frontend API wrapper: `rwos-admin-frontend/src/services/api.js` (uses `http://localhost:5000/api` and sends `Authorization: Bearer <token>`).

## Environment & integration points
- Backend expects environment variables: `MONGODB_URI`, `JWT_SECRET`, optionally `PORT`.
- Socket.io: server emits/receives events and routes access `req.io` to broadcast (see `server.js` and route handlers that use `req.io`).
- API base path: all backend routes are mounted under `/api` (e.g. `/api/auth`, `/api/menu`).

## Developer workflows & exact commands
- Backend (development):
  - cd `rwos-admin-app/rwos-app/backend`
  - npm install
  - npm run dev        # uses nodemon (hot reload)
  - npm start          # production-like (node server.js)
  - npm test           # runs Jest tests if present
- Admin frontend (Expo):
  - cd `rwos-admin-frontend`
  - npm install
  - npm start          # runs `expo start` (use `npx expo start` if needed)
  - For device: use Expo Go or `eas build` for production

Notes: many folders have their own `package.json`. Run npm commands in the folder you intend to work on.

## Project-specific conventions & patterns
- Tokens: backend creates JWTs (`jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })`) and frontend passes tokens in `Authorization` header as `Bearer <token>` (see `src/services/api.js`).
- Socket rooms: Clients join a restaurant room using `join_restaurant` (see `server.js`). Use room-based emits to limit broadcasts.
- Schema enums: models use explicit enums (e.g., `Menu.category` and `Menu.status`) — prefer those string values when creating test fixtures.
- Routes structure: `routes/*.js` files export an Express router and are mounted in `server.js` as `/api/<resource>`.

## Testing and exports useful for tests
- `server.js` exports `{ app, io }` — useful for integration tests (supertest + socket.io test setups).
- Backend has Jest configured in `rwos-admin-app/rwos-app/backend/package.json` as `test` script.

## Quick examples (what an agent should change/inspect)
- To add a new menu route: add `routes/menu.js`, use `models/Menu.js` for schema, mount in `server.js` as `app.use('/api/menu', menuRoutes)`.
- To call backend from frontend: use `rwos-admin-frontend/src/services/api.js`, ensure `API_BASE_URL` points to the running backend.

## Safety & operational notes
- Keep secrets out of the repo. Use `.env` for `MONGODB_URI` and `JWT_SECRET` when running locally.
- Rate limiting and `helmet()` are configured in `server.js`; be mindful when writing tests that hit many requests quickly.

## When in doubt / pointers
- Start by running the backend locally and the Expo frontend so you can reproduce API requests (`/api/*`) and socket events.
- Useful entry files to open first: `server.js`, `middleware/auth.js`, `routes/auth.js`, `models/Menu.js`, `rwos-admin-frontend/src/services/api.js`.

---
If you want, I can (a) add a short checklist for PR reviewers, (b) add specific testing examples (supertest + jest) referencing `server.js`, or (c) expand the file with CI hints. Which would you prefer?
