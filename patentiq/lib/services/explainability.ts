/**
 * Explainability Service
 *
 * Generates human-readable explanations for analysis results.
 * Part of the Explainability Layer in the AI flow.
 *
 * Provides:
 * - Why each feature scored the way it did
 * - What evidence was used
 * - How the scoring methodology works
 * - What-if exploration support
 */

import { ExplainabilityResult, FeatureExplanation, ExtractedFeature, NoveltyScore } from "@/lib/types/analysis";
import { PriorArt } from "@/lib/types/patent";

export async function generateExplanations(
  analysisId: string,
  features: ExtractedFeature[],
  noveltyScore: NoveltyScore,
  priorArt: PriorArt[]
): Promise<ExplainabilityResult> {
  const featureExplanations = await Promise.all(
    features.map((feature) =>
      explainFeatureScore(feature, noveltyScore, priorArt)
    )
  );

  return {
    analysisId,
    featureExplanations,
    methodology: getMethodologyDescription(),
    dataSources: getDataSourcesList(),
  };
}

async function explainFeatureScore(
  feature: ExtractedFeature,
  noveltyScore: NoveltyScore,
  priorArt: PriorArt[]
): Promise<FeatureExplanation> {
  // TODO: Use LLM to generate natural language explanation
  // of why this feature scored the way it did
  const featureScore = noveltyScore.featureScores.find(
    (fs) => fs.featureId === feature.id
  );

  return {
    featureId: feature.id,
    featureName: feature.name,
    reasoning: "", // LLM-generated explanation
    evidencePatents: featureScore?.closestPriorArt.map(
      (pa) => pa.patent.patentNumber
    ) || [],
    confidenceFactors: [],
  };
}

function getMethodologyDescription(): string {
  return `PatentIQ uses the eXplainable Novelty Score (XNS™) methodology which combines:
1. Semantic similarity analysis between invention features and prior art claims
2. CPC classification-based patent landscape mapping
3. Feature-level granular comparison
4. Risk assessment based on overlap thresholds

Data is sourced from the USPTO patent database, including both granted patents and pending applications.`;
}

function getDataSourcesList(): string[] {
  return [
    "USPTO Patent Full-Text Database",
    "USPTO Patent Application Database",
    "CPC Classification System",
  ];
}

export async function generateWhatIfExplanation(
  analysisId: string,
  modifiedFeatures: string[]
): Promise<string> {
  // Used by Strategy Sandbox for what-if exploration
  // TODO: Generate explanation of how toggling features affects the score
  return "";
}
