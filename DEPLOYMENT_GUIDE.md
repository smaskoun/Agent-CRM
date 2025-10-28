# Agent CRM – Deployment Guide

This repository now contains a working TypeScript monorepo with a small Express API, a Vite + React client and a Drizzle
schema to illustrate how data would be persisted. The goal is to provide a clear starting point that you can run locally
and deploy without needing to hunt for missing archives.

## Project Layout

```
.
├── client/             # Vite + React single page application
├── server/             # Express entry point exposing JSON endpoints
├── shared/             # Shared TypeScript types and mock data helpers
├── drizzle/            # Drizzle ORM schema (and future migrations)
├── package.json        # Workspace scripts & dependencies
└── tsconfig.json       # Shared TypeScript configuration
```

## Local Development

### Prerequisites
- Node.js 18+
- pnpm 9+ (recommended) or npm

### Install & Run
```bash
pnpm install
pnpm dev
```

`pnpm dev` starts the Express server on port **3000** and serves the Vite client in development mode. The API persists
records to a shared JSON database on disk (managed by `shared/data.ts`), so every user sees the same data set even after
restarts.

## Environment Variables

Create a `.env` (or `.env.local`) file in the repository root when you are ready to connect to a database or run Drizzle
migrations. You can also control where the shared JSON database is stored by setting `AGENT_CRM_DB_PATH`:

```env
DATABASE_URL=mysql://user:password@host:3306/agent_crm
PORT=3000
AGENT_CRM_DB_PATH=./data/agent-crm.json
```

The development server only requires `PORT`. `DATABASE_URL` is read by `drizzle-kit` commands.

## Database (Optional)

The application currently ships with mock data. When you are ready to persist records, use the schema in
`drizzle/schema.ts` as the foundation for your migrations. Generate migrations with:

```bash
pnpm db:push       # Push the schema to the target database
pnpm db:generate   # Generate SQL migration files under drizzle/migrations
```

## Building for Production

```bash
pnpm build
pnpm start
```

`pnpm build` outputs the static client to `dist/public` and bundles the Express entry point to `dist/index.js`.
`pnpm start` runs the bundled server with `NODE_ENV=production` so the client is served directly from Express.

## Free Hosting Recommendation

For hobby deployments, **Render** (https://render.com) offers a free web service tier suitable for Node.js apps and pairs
nicely with a free PostgreSQL instance if you later decide to persist data.

### Deploying to Render with `render.yaml`

This repository includes a [`render.yaml`](./render.yaml) blueprint so Render can provision the web service with the
correct build/start commands and Node.js version automatically.

1. Push the repository to GitHub (or another Git provider Render supports).
2. In Render, choose **New +** → **Blueprint** and point it at the repository.
3. Accept the defaults – the blueprint installs dependencies with `pnpm`, runs `pnpm build`, and launches the bundled Express server via `pnpm start`.
4. Render injects the `PORT` variable automatically. Add any other variables you need (for example `AGENT_CRM_DB_PATH` or `DATABASE_URL`) on the service **Environment** tab.
5. Deploy. Subsequent pushes to the tracked branch will trigger rebuilds using the same commands.

If you prefer to configure the service manually instead of using the blueprint, create a new Web Service on Render and
reuse the same build (`corepack enable && pnpm install --frozen-lockfile && pnpm build`) and start (`pnpm start`) commands.

This repository includes a [`render.yaml`](./render.yaml) blueprint so Render can provision the web service with the
correct build/start commands and Node.js version automatically.

1. Push the repository to GitHub (or another Git provider Render supports).
2. In Render, choose **New +** → **Blueprint** and point it at the repository.
3. Accept the defaults – the blueprint installs dependencies with `pnpm`, runs `pnpm build`, and launches the bundled Express server via `pnpm start`.
4. Render injects the `PORT` variable automatically. Add any other variables you need (for example `AGENT_CRM_DB_PATH` or `DATABASE_URL`) on the service **Environment** tab.
5. Deploy. Subsequent pushes to the tracked branch will trigger rebuilds using the same commands.

If you prefer to configure the service manually instead of using the blueprint, create a new Web Service on Render and
reuse the same build (`corepack enable && pnpm install --frozen-lockfile && pnpm build`) and start (`pnpm start`) commands.

Render’s free plan keeps the app alive for quick demos without extra setup.

## Static Asset Hosting Only?

If you only need the React client (and plan to host the API elsewhere), run `pnpm build` and deploy the contents of
`dist/public` to Netlify or Vercel. Remember to configure the API base URL via `VITE_API_BASE_URL` before building.

## Next Steps

- Replace the JSON helpers in `shared/data.ts` with database access.
- Expand the Drizzle schema and migrations as requirements grow.
- Add authentication and background jobs as needed.

You now have a transparent structure that can evolve alongside your product without relying on external archives.
