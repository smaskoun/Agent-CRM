export interface CRMClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: string;
  lastContactedOn: string;
}

export interface CRMDeal {
  id: string;
  title: string;
  value: number;
  status: "open" | "won" | "lost";
  stage: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  deals: CRMDeal[];
}

export interface DashboardSummary {
  openDeals: number;
  wonDeals: number;
  totalPipelineValue: number;
  newLeadsThisMonth: number;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
}

export interface CreateClientResponse {
  client: CRMClient;
}
