import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type { CRMClient, CRMDeal, DashboardSummary, PipelineStage } from "./types";

interface DatabaseSnapshot {
  clients: CRMClient[];
  deals: CRMDeal[];
}

const databaseFilePath = (() => {
  const override = process.env.AGENT_CRM_DB_PATH;
  if (override && override.trim().length > 0) {
    return path.isAbsolute(override) ? override : path.resolve(process.cwd(), override);
  }

  return path.resolve(process.cwd(), "data", "agent-crm.json");
})();

function readSnapshotFromDisk(): DatabaseSnapshot | null {
  if (!fs.existsSync(databaseFilePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(databaseFilePath, "utf8");
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<DatabaseSnapshot>;
    if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.deals)) {
      return null;
    }

    return {
      clients: parsed.clients as CRMClient[],
      deals: parsed.deals as CRMDeal[],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[data] Failed to read database snapshot, falling back to defaults", error);
    return null;
  }
}

function writeSnapshotToDisk(snapshot: DatabaseSnapshot): void {
  fs.mkdirSync(path.dirname(databaseFilePath), { recursive: true });
  fs.writeFileSync(databaseFilePath, JSON.stringify(snapshot, null, 2), "utf8");
}

const initialClients: CRMClient[] = [
  {
    id: nanoid(),
    name: "Harper Realty Group",
    email: "contact@harperrealty.com",
    phone: "(415) 555-0186",
    stage: "Discovery",
    lastContactedOn: new Date().toISOString(),
  },
  {
    id: nanoid(),
    name: "Rivera Family",
    email: "luis@riverahomes.com",
    phone: "(305) 555-0149",
    stage: "Negotiation",
    lastContactedOn: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: nanoid(),
    name: "Aster Commercial",
    email: "leasing@astercommercial.com",
    phone: "(212) 555-0193",
    stage: "Proposal",
    lastContactedOn: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
];

const initialDeals: CRMDeal[] = [
  {
    id: nanoid(),
    title: "Marina Point Condos",
    value: 840000,
    status: "open",
    stage: "Discovery",
    updatedAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    title: "Cedar Avenue Estate",
    value: 1250000,
    status: "open",
    stage: "Proposal",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: nanoid(),
    title: "Elm Street Retail",
    value: 460000,
    status: "won",
    stage: "Closed",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];

function buildInitialSnapshot(): DatabaseSnapshot {
  return {
    clients: [...initialClients],
    deals: [...initialDeals],
  };
}

let snapshot: DatabaseSnapshot = (() => {
  const fromDisk = readSnapshotFromDisk();
  if (fromDisk) {
    return {
      clients: [...fromDisk.clients],
      deals: [...fromDisk.deals],
    };
  }

  const initialSnapshot = buildInitialSnapshot();
  writeSnapshotToDisk(initialSnapshot);
  return initialSnapshot;
})();

function updateSnapshot(mutator: (state: DatabaseSnapshot) => DatabaseSnapshot): void {
  snapshot = mutator(snapshot);
  writeSnapshotToDisk(snapshot);
}

export function getClients(): CRMClient[] {
  return [...snapshot.clients];
}

export function addClient(input: Omit<CRMClient, "id" | "lastContactedOn" | "stage">): CRMClient {
  const client: CRMClient = {
    id: nanoid(),
    stage: "Discovery",
    lastContactedOn: new Date().toISOString(),
    ...input,
  };
  updateSnapshot((state) => ({
    ...state,
    clients: [client, ...state.clients],
  }));
  return client;
}

export function getDeals(): CRMDeal[] {
  return [...snapshot.deals];
}

export function getPipeline(): PipelineStage[] {
  const stages: Record<string, PipelineStage> = {
    Discovery: { id: "discovery", label: "Discovery", deals: [] },
    Proposal: { id: "proposal", label: "Proposal", deals: [] },
    Negotiation: { id: "negotiation", label: "Negotiation", deals: [] },
    Closed: { id: "closed", label: "Closed", deals: [] },
  };

  for (const deal of snapshot.deals) {
    const stage = stages[deal.stage as keyof typeof stages];
    if (stage && typeof stage === "object" && Array.isArray(stage.deals)) {
      stage.deals.push(deal);
    } else {
      stages.Discovery.deals.push(deal);
    }
  }

  return Object.values(stages);
}

function isSameCalendarMonth(dateString: string, reference: Date): boolean {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.getFullYear() === reference.getFullYear() && parsed.getMonth() === reference.getMonth();
}

export function getDashboardSummary(): DashboardSummary {
  const now = new Date();
  const openDeals = snapshot.deals.filter((deal) => deal.status === "open");
  const wonDealsThisMonth = snapshot.deals.filter(
    (deal) => deal.status === "won" && isSameCalendarMonth(deal.updatedAt, now),
  );
  const totalPipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0);
  const newLeadsThisMonth = snapshot.clients.filter((client) =>
    isSameCalendarMonth(client.lastContactedOn, now),
  );
  const totalContacts = snapshot.clients.length;
  const averageDaysInPipeline = (() => {
    if (openDeals.length === 0) {
      return 0;
    }

    const totalDays = openDeals.reduce((sum, deal) => {
      const updatedAt = new Date(deal.updatedAt);
      if (Number.isNaN(updatedAt.getTime())) {
        return sum;
      }

      const diffMs = Math.max(0, now.getTime() - updatedAt.getTime());
      return sum + diffMs / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.max(1, Math.round(totalDays / openDeals.length));
  })();

  return {
    totalContacts,
    openDeals: openDeals.length,
    wonDealsThisMonth: wonDealsThisMonth.length,
    totalPipelineValue,
    newLeadsThisMonth: newLeadsThisMonth.length,
    averageDaysInPipeline,
  };
}

export function resetData(): void {
  const initialSnapshot = buildInitialSnapshot();
  snapshot = initialSnapshot;
  writeSnapshotToDisk(initialSnapshot);
}
