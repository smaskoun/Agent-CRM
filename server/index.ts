import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  addClient,
  getClients,
  getDashboardSummary,
  getDeals,
  getPipeline,
} from "../shared/data";
import type { CreateClientRequest } from "@shared/types";

const app = express();
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/summary", (_request, response) => {
  response.json(getDashboardSummary());
});

app.get("/api/clients", (_request, response) => {
  response.json(getClients());
});

app.post("/api/clients", (request, response) => {
  const body = request.body as Partial<CreateClientRequest>;
  if (!body?.name || !body?.email) {
    response.status(400).json({ error: "Name and email are required" });
    return;
  }

  const client = addClient({ name: body.name, email: body.email, phone: body.phone ?? "" });
  response.status(201).json({ client });
});

app.get("/api/deals", (_request, response) => {
  response.json(getDeals());
});

app.get("/api/pipeline", (_request, response) => {
  response.json(getPipeline());
});

const dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublicPath = path.resolve(dirname, "public");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPublicPath));
  app.get("*", (_request, response) => {
    response.sendFile(path.join(distPublicPath, "index.html"));
  });
}

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${port}`);
});
