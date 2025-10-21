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

## Free Hosting Recommendation (Render)

For a zero-cost managed deployment that can run both the Express API and the built React client, **Render**
(https://render.com) is the smoothest option. Their free Web Service tier includes enough resources for demos and
automatically rebuilds on every push. Below is an end-to-end walkthrough that assumes you are deploying the repository as
is, with the API and client served from the same Node process.

### 1. Prepare the Repository

1. Commit any pending changes and push the repo to GitHub or GitLab.
2. Ensure the `pnpm-lock.yaml` file is present so Render can reuse exact dependency versions.
3. If you plan to connect to a real database, update `.env.example` and add the required keys to your Render dashboard
   later (Render injects them at runtime).

### 2. Create the Render Web Service

1. Sign in at [dashboard.render.com](https://dashboard.render.com/) and click **New → Web Service**.
2. Choose **Build and Deploy from a Git repository**, then authorize Render to access your repo.
3. Select the repository and branch you want to deploy.

### 3. Configure Build & Runtime Settings

Render pre-fills some defaults; replace them with the following values:

| Setting            | Value                                        | Notes |
| ------------------ | -------------------------------------------- | ----- |
| **Environment**    | Node                                         |       |
| **Region**         | Closest to your users                        |       |
| **Build Command**  | `pnpm install && pnpm build`                 | Installs dependencies and produces the production bundle. |
| **Start Command**  | `pnpm start`                                 | Runs the compiled Express server which also serves the client. |
| **Instance Type**  | Free                                         | Perfect for staging and demos. |

Add the following environment variables under **Advanced → Environment Variables**:

| Key             | Value                        | Required | Description |
| --------------- | ---------------------------- | -------- | ----------- |
| `PORT`          | `10000` (or leave blank)      | Yes      | Render automatically assigns `PORT`; leaving it blank lets Render manage it. |
| `NODE_ENV`      | `production`                  | Yes      | Ensures Express serves the built client. |
| `DATABASE_URL`  | `<your database connection>`  | Optional | Only needed when you introduce a persistent database. |

> 💡 Render injects a `PORT` value during deploys. If you leave the field empty, our server will pick up the injected
> value. You only need to hard-code a value when running the service locally.

### 4. Deploy

1. Click **Create Web Service**. Render will clone the repo, install dependencies, and run `pnpm build` followed by
   `pnpm start`.
2. Watch the build logs to confirm `Build succeeded` and `Server listening on port ...` appear.
3. Once the instance turns green, open the generated URL to interact with the CRM UI.

Subsequent pushes to the configured branch trigger automatic redeploys. Use Render’s **Manual Deploy** button if you need
to rebuild from the latest commit without pushing new code.

### Optional: Provision a Database on Render

1. From the Render dashboard, click **New → PostgreSQL** and choose the free tier.
2. After creation, copy the internal connection string.
3. Back on your Web Service, add `DATABASE_URL=<connection string>` to the environment variables and redeploy.
4. Run `pnpm db:push` locally to apply the Drizzle schema to the new database.

## Alternative Free Hosts

If Render is unavailable in your region, **Railway** and **Fly.io** both offer free Node runtimes. The deployment process is
similar—use the same build (`pnpm install && pnpm build`) and start (`pnpm start`) commands, then set `PORT` and optional
database URLs in their respective dashboards.

## Static Asset Hosting Only?

If you only need the React client (and plan to host the API elsewhere), run `pnpm build` and deploy the contents of
`dist/public` to Netlify or Vercel. Remember to configure the API base URL via `VITE_API_BASE_URL` before building.

## Next Steps

- Replace the in-memory helpers in `shared/data.ts` with database access.
- Expand the Drizzle schema and migrations as requirements grow.
- Add authentication and background jobs as needed.

You now have a transparent structure that can evolve alongside your product without relying on external archives.
