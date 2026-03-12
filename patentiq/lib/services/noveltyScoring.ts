/**
 * Novelty Scoring Service (XNS™ - eXplainable Novelty Score)
 *
 * Calculates the novelty score for an invention based on:
 * - Feature-level comparison with prior art
 * - Claim overlap analysis
 * - Risk assessment
 *
 * Part of the Patent Analysis stage in the AI flow.
 * Pipeline: Patent Retrieval -> Novelty Scoring -> Explainability
 */

import { ExtractedFeature, NoveltyScore, FeatureNoveltyScore, RiskItem } from "@/lib/types/analysis";
import { Patent, PriorArt } from "@/lib/types/patent";

export async function calculateNoveltyScore(
  features: ExtractedFeature[],
  priorArt: PriorArt[]
): Promise<NoveltyScore> {
  const featureScores = await Promise.all(
    features
      .filter((f) => f.enabled)
      .map((feature) => scoreFeature(feature, priorArt))
  );

  const overall = calculateOverallScore(featureScores);

  return {
    overall,
    featureScores,
    calculatedAt: new Date(),
  };
}

async function scoreFeature(
  feature: ExtractedFeature,
  priorArt: PriorArt[]
): Promise<FeatureNoveltyScore> {
  // TODO: Implement LLM-based similarity scoring
  // 1. Compare feature against each prior art patent's claims
  // 2. Use semantic similarity + keyword matching
  // 3. Calculate overlap percentage
  // 4. Determine risk level based on thresholds

  const relevantPriorArt = priorArt.filter((pa) =>
    pa.overlappingFeatures.includes(feature.id)
  );

  const maxSimilarity = relevantPriorArt.length > 0
    ? Math.max(...relevantPriorArt.map((pa) => pa.relevanceScore))
    : 0;

  const noveltyScore = Math.round((1 - maxSimilarity) * 100);

  return {
    featureId: feature.id,
    featureName: feature.name,
    score: noveltyScore,
    closestPriorArt: relevantPriorArt.slice(0, 5),
    riskLevel: getRiskLevel(noveltyScore),
  };
}

function calculateOverallScore(featureScores: FeatureNoveltyScore[]): number {
  if (featureScores.length === 0) return 0;
  const sum = featureScores.reduce((acc, fs) => acc + fs.score, 0);
  return Math.round(sum / featureScores.length);
}

function getRiskLevel(score: number): "high" | "medium" | "low" {
  if (score < 40) return "high";
  if (score < 70) return "medium";
  return "low";
}

export async function assessRisks(
  features: ExtractedFeature[],
  priorArt: PriorArt[]
): Promise<RiskItem[]> {
  // TODO: LLM-based risk assessment
  // For each feature with overlapping prior art, generate:
  // - Risk description
  // - Mitigation suggestions
  // - Related patent references
  return [];
}

export async function recalculateWithToggles(
  analysisId: string,
  enabledFeatureIds: string[]
): Promise<NoveltyScore> {
  // Used by Strategy Sandbox for live score updates
  // TODO: Fetch features and prior art, recalculate with only enabled features
  throw new Error("Not yet implemented");
}
