import { Patent, PriorArt } from "./patent";

export interface Analysis {
  id: string;
  userId: string;
  title: string;
  inputMethod: "guided" | "document" | "text";
  inputContent: string;
  status: AnalysisStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type AnalysisStatus =
  | "draft"
  | "processing"
  | "features_extracted"
  | "analyzing"
  | "completed"
  | "error";

export interface ExtractedFeature {
  id: string;
  analysisId: string;
  name: string;
  description: string;
  category: string;
  isNovel: boolean | null;
  confidence: number;
  enabled: boolean; // for sandbox toggling
}

export interface NoveltyScore {
  overall: number; // 0-100 XNS™ score
  featureScores: FeatureNoveltyScore[];
  calculatedAt: Date;
}

export interface FeatureNoveltyScore {
  featureId: string;
  featureName: string;
  score: number; // 0-100
  closestPriorArt: PriorArt[];
  riskLevel: "high" | "medium" | "low";
}

export interface BaselineAnalysisSummary {
  analysisId: string;
  noveltyScore: NoveltyScore;
  keyRisks: RiskItem[];
  closestPriorArt: PriorArt[];
  contextOverview: string;
  generatedAt: Date;
}

export interface RiskItem {
  featureId: string;
  featureName: string;
  riskLevel: "high" | "medium" | "low";
  description: string;
  mitigationSuggestion: string;
  relatedPatents: Patent[];
}

export interface SandboxState {
  analysisId: string;
  enabledFeatures: string[]; // feature IDs that are toggled on
  liveNoveltyScore: NoveltyScore;
  claimOverlapData: ClaimOverlap[];
}

export interface ClaimOverlap {
  featureId: string;
  featureName: string;
  overlappingClaims: {
    patentId: string;
    patentNumber: string;
    claimNumber: number;
    overlapPercentage: number;
  }[];
}

export interface AnalysisReport {
  id: string;
  analysisId: string;
  format: "pdf" | "visual" | "data";
  generatedAt: Date;
  downloadUrl: string;
}

export interface AnalysisVersion {
  id: string;
  analysisId: string;
  versionNumber: number;
  snapshot: BaselineAnalysisSummary;
  createdAt: Date;
  notes: string;
}

export interface ExplainabilityResult {
  analysisId: string;
  featureExplanations: FeatureExplanation[];
  methodology: string;
  dataSources: string[];
}

export interface FeatureExplanation {
  featureId: string;
  featureName: string;
  reasoning: string;
  evidencePatents: string[];
  confidenceFactors: string[];
}
