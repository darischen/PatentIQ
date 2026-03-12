
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

export interface AnalysisResult {
  noveltyScore: number;
  confidence: number;
  summary: string;
  features: PatentFeature[];
  topRiskFeature: string;
  closestPriorArt: string;
  featuresAnalyzed: number;
  similarPatents: number;
  analysisType: AnalysisType;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export interface Project {
  id: string;
  name: string;
  date: string;
  thumbnail?: string;
  chatHistory?: ChatMessage[];
  analysisResult?: AnalysisResult;
}

export type Screen = 'login' | 'projects' | 'welcome' | 'dashboard' | 'sandbox' | 'heatmap' | 'explorer' | 'capture' | 'features' | 'overlap' | 'similar-patents' | 'confidence' | 'history' | 'help' | 'settings' | 'profile';
