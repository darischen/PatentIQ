export interface Patent {
  id: string;
  patentNumber: string;
  title: string;
  abstract: string;
  claims: PatentClaim[];
  inventors: string[];
  assignee: string | null;
  filingDate: string;
  publicationDate: string;
  status: "granted" | "pending";
  cpcCodes: string[];
  similarityScore?: number;
}

export interface PatentClaim {
  claimNumber: number;
  text: string;
  isIndependent: boolean;
  parentClaimNumber?: number;
}

export interface PatentSearchParams {
  query: string;
  cpcCodes?: string[];
  dateFrom?: string;
  dateTo?: string;
  status?: "granted" | "pending" | "all";
  limit?: number;
  offset?: number;
}

export interface PatentSearchResult {
  patents: Patent[];
  totalCount: number;
  query: string;
}

export interface PriorArt {
  patent: Patent;
  relevanceScore: number;
  overlappingFeatures: string[];
  riskLevel: "high" | "medium" | "low";
}
