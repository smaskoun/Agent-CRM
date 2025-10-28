# Agent CRM – Quick Start

This guide walks through cloning the repository, running the demo stack, and understanding the moving pieces.

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Start the Dev Server

```bash
pnpm dev
```

- Express serves JSON on `http://localhost:3000/api/*`.
- Vite proxies the React client to the same origin.
- Data persists to a shared JSON database managed by `shared/data.ts`, so everyone sees the same records without extra
  setup.

## 3. Explore the UI

| Page | What to look for |
| ---- | ---------------- |
| Overview | Dashboard metrics pulled from `/api/summary`. |
| Pipeline | Kanban-style columns sourced from `/api/pipeline`. |
| Clients | Form that posts to `/api/clients` and renders the roster. |
| Deals | Revenue snapshots from `/api/deals`. |

## 4. Useful Commands

```bash
pnpm build     # Bundle server and client for production
pnpm start     # Run the compiled server (serves dist/public)
pnpm check     # Type-check the entire project
pnpm test      # Reserved for future Vitest suites
```

## 5. Configure for Production

1. Copy `.env.example` to `.env` (create one if it does not exist).
2. Set `PORT` to whatever your hosting provider expects.
3. When adding a database, set `DATABASE_URL` so Drizzle can run migrations.
4. Build with `pnpm build` and start with `pnpm start`.

## 6. Deploying

- **Render** – free web service tier suitable for the Express server. Use `pnpm install && pnpm build` as the build command.
- **Netlify / Vercel** – great for hosting the static build located in `dist/public` if you run the API separately.

## 7. Next Steps

- Replace mock helpers with real repositories or services.
- Add Vitest coverage for the data helpers.
- Expand the Drizzle schema to cover additional CRM entities.

You now have a working baseline instead of empty folders—extend it however you like.
