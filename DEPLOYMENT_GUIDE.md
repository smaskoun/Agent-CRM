# Agent CRM – Deployment Guide

This repository now contains a working TypeScript monorepo with a small Express API, a Vite + React client and a Drizzle
schema to illustrate how data would be persisted. The goal is to provide a clear starting point that you can run locally
and deploy without needing to hunt for missing archives.

## Project Layout

```
.
├── client/             # Vite + React single page application
├── server/_core/       # Express entry point exposing JSON endpoints
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

`pnpm dev` starts the Express server on port **3000** and serves the Vite client in development mode. The API is backed by
an in-memory data store located in `shared/data.ts`, so you can explore the UI without a database.

## Environment Variables

Create a `.env` (or `.env.local`) file in the repository root when you are ready to connect to a database or run Drizzle
migrations:

```env
DATABASE_URL=mysql://user:password@host:3306/agent_crm
PORT=3000
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
nicely with a free PostgreSQL instance if you later decide to persist data. The workflow looks like this:

1. Push the repository to GitHub.
2. Create a new Web Service on Render, pointing to the repo.
3. Set the build command to `pnpm install && pnpm build` and the start command to `pnpm start`.
4. Configure the `PORT` environment variable (Render defaults to providing one for you).
5. Deploy – Render will build on every push to the selected branch.

Alternatives include Railway and Fly.io, but Render’s free plan keeps the app alive for quick demos without extra setup.

### Deploying to Railway

If you would rather use [Railway](https://railway.com), follow the same build/start pattern the project already exposes:

1. **Connect the repository.** Create a new project on Railway, choose **Deploy from GitHub**, and pick the branch that contains Agent CRM.
2. **Reuse the existing scripts.** Set the build command to `pnpm install && pnpm build` and the start command to `pnpm start` in the service’s **Deployments** settings so Railway runs the bundled Express server.
3. **Mirror the environment.** Add a `PORT` variable (Railway injects the value at runtime) and any other configuration such as `DATABASE_URL` or `VITE_API_BASE_URL` under the **Variables** tab.
4. **Verify the deployment.** After the pipeline turns green, the deployment card will show an **Active** status. Open the generated Railway domain and confirm both the API and client respond as expected.

Subsequent pushes to the tracked branch will automatically rebuild the service using the commands above, so you can continue iterating locally and rely on Railway for continuous deployment.

## Static Asset Hosting Only?

If you only need the React client (and plan to host the API elsewhere), run `pnpm build` and deploy the contents of
`dist/public` to Netlify or Vercel. Remember to configure the API base URL via `VITE_API_BASE_URL` before building.

## Next Steps

- Replace the in-memory helpers in `shared/data.ts` with database access.
- Expand the Drizzle schema and migrations as requirements grow.
- Add authentication and background jobs as needed.

You now have a transparent structure that can evolve alongside your product without relying on external archives.
