# Working on this repo (NADI AI)

Single process: `server.ts` is an Express server that serves the API (`/api/health`,
`/api/chat`, `/api/generate-slip`) and, when `NODE_ENV !== 'production'`, mounts Vite in
middleware mode so the React app in `src/` is served with live reload on the same port.
There is no separate backend build step and no database — app state lives in
`localStorage` (`src/utils/storage.ts`).

## Run it

```
docker compose -f docker-compose.base44.yml up -d
curl http://localhost:3000/api/health      # {"status":"ok",...}
```

Non-obvious points:

- `bun.lock` is a **bun** lockfile, so the one-shot `deps` service installs with
  `bun install --frozen-lockfile` into a `node_modules` volume. The app itself runs on
  Node (`node_modules/.bin/tsx server.ts`) because Vite's dev middleware expects Node,
  and `oven/bun:1` does not ship a real Node binary.
- After editing `package.json`/`bun.lock`, re-run the stack so `deps` reinstalls:
  `docker compose -f docker-compose.base44.yml up -d` (the `deps` service is one-shot and
  must exit 0 before `web` starts).
- Vite's dev host allowlist is satisfied by passing the platform's
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` through in compose — no config edit needed.
- `GEMINI_API_KEY` powers the AI replies (model `gemini-3.1-flash-lite`). Without a valid
  key, `/api/chat` and `/api/generate-slip` silently fall back to the deterministic
  rule-based triage text in `server.ts`, so the app always "works" — check the logs for
  `Gemini API response fallback triggered` to tell whether the real model answered.
- Demo logins for manual testing (see `DEMO_USERS` in `src/utils/storage.ts`):
  `shadiqia / siswa123`, `pembina / pembina123`, `nakes / nakes123`.

## Checks

```
docker compose -f docker-compose.base44.yml exec -T web node_modules/.bin/tsc --noEmit
```
