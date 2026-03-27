export type AnalysisStatus = 'idle' | 'analyzing' | 'completed';
export type AnalysisType = 'concept';

export interface PatentFeature {
  id: string;
  name: string;
  status: 'unique' | 'partial' | 'high-risk' | 'standard';
  description: string;
  domain?: string;
  category?: 'Core' | 'Secondary' | 'Technical';
}

export interface SimilarPatent {
  id: string;
  application_number?: string;
  title: string;
  abstract: string;
  similarity_score: number;
  reasoning?: string;
  match_level?: 'HIGH' | 'MEDIUM' | 'LOW' | 'POOR';
  recommendation?: 'Proceed' | 'Refine' | 'Caution';
  recommendation_reasoning?: string;
  concept_overlaps?: {
    overlap_count: number;
    overlaps: Array<{
      invention_concept: string;
      patent_concept: string;
      similarity_score: number;
      match_type: 'exact' | 'partial' | 'related' | 'none';
      invention_section: string;
      patent_section: string;
    }>;
    highlight_terms: string[];
    average_similarity: number;
    risk_level: 'High' | 'Moderate' | 'Low';
  } | null;
}

export interface AnalysisResult {
  noveltyScore: number;
  confidence: number;
  summary: string;
  features: PatentFeature[];
  topRiskFeature: string;
  closestPriorArt: string;
  featuresAnalyzed: number;
  similarPatents: number;
  similarPatentsList?: SimilarPatent[];
  analysisType: AnalysisType;
  overallRecommendation?: 'Proceed' | 'Refine' | 'Caution';
  overallRecommendationReasoning?: string;
  cpcCodes?: Array<{ code: string; title: string }>;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export interface Project {
  id: string;
  name: string;
  date?: string; // For backward compatibility
  createdAt: number; // timestamp in ms
  deletedAt?: number; // timestamp when deleted, only set for trash items
  thumbnail?: string;
  chatHistory?: ChatMessage[];
  analysisResult?: AnalysisResult;
}
