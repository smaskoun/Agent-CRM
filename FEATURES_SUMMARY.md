# Agent CRM – Feature Snapshot

This repository now reflects a transparent baseline build that can be reviewed and extended. Instead of claiming finished
modules that do not exist, the goal is to show a working foundation with a clear upgrade path.

## Implemented

### Client experience
- **Overview dashboard** – renders live metrics returned by `/api/summary`.
- **Pipeline explorer** – simple Kanban-style layout populated by `/api/pipeline`.
- **Client capture** – form posts to `/api/clients` and renders the in-memory roster.
- **Deal rollup** – list of sample deals with quick revenue totals.

### API surface
- `GET /api/health` – readiness probe for hosting platforms.
- `GET /api/summary` – aggregates mock deal data for dashboard cards.
- `GET /api/clients` – returns the current client list.
- `POST /api/clients` – creates a client in the in-memory store.
- `GET /api/deals` – exposes sample deals for the deals page.
- `GET /api/pipeline` – groups deals into stages for the pipeline page.

### Shared assets
- `shared/types.ts` – TypeScript contracts used by both client and server.
- `shared/data.ts` – deterministic mock data source with helpers to add clients.
- `drizzle/schema.ts` – starter Drizzle schema for clients and deals with matching types.

## Not Implemented Yet

These capabilities were referenced in earlier documentation but are intentionally **not** present in this starter:
- Authentication, OAuth flows, or session handling.
- Drag-and-drop pipeline interactions.
- Analytics charts or advanced reporting.
- Background jobs, reminders, or email delivery.
- File uploads, S3 integration, or vendor modules.

## Roadmap Suggestions

1. Replace `shared/data.ts` with a persistence layer backed by Drizzle ORM.
2. Add Vitest tests that cover the in-memory services before swapping in a database.
3. Layer in authentication (Clerk, Auth0, or custom JWT) and gate the API routes.
4. Introduce charts for the dashboard using a lightweight library such as Recharts.
5. Expand the schema with migrations for activities, tasks and documents as needed.

The current codebase is intentionally small but functional, giving teams an honest starting point that matches the
published docs.
