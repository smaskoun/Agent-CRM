import { nanoid } from "nanoid";
import type { CRMClient, CRMDeal, DashboardSummary, PipelineStage } from "./types";

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

let clients = [...initialClients];
let deals = [...initialDeals];

export function getClients(): CRMClient[] {
  return clients;
}

export function addClient(input: Omit<CRMClient, "id" | "lastContactedOn" | "stage">): CRMClient {
  const client: CRMClient = {
    id: nanoid(),
    stage: "Discovery",
    lastContactedOn: new Date().toISOString(),
    ...input,
  };
  clients = [client, ...clients];
  return client;
}

export function getDeals(): CRMDeal[] {
  return deals;
}

export function getPipeline(): PipelineStage[] {
  const stages: Record<string, PipelineStage> = {
    Discovery: { id: "discovery", label: "Discovery", deals: [] },
    Proposal: { id: "proposal", label: "Proposal", deals: [] },
    Negotiation: { id: "negotiation", label: "Negotiation", deals: [] },
    Closed: { id: "closed", label: "Closed", deals: [] },
  };

  for (const deal of deals) {
    const stage = stages[deal.stage as keyof typeof stages];
    if (stage) {
      stage.deals.push(deal);
    } else {
      stages.Discovery.deals.push(deal);
    }
  }

  return Object.values(stages);
}

export function getDashboardSummary(): DashboardSummary {
  const openDeals = deals.filter((deal) => deal.status === "open").length;
  const wonDeals = deals.filter((deal) => deal.status === "won").length;
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const newLeadsThisMonth = clients.filter((client) => {
    const created = new Date(client.lastContactedOn);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return {
    openDeals,
    wonDeals,
    totalPipelineValue,
    newLeadsThisMonth,
  };
}

export function resetData(): void {
  clients = [...initialClients];
  deals = [...initialDeals];
}
