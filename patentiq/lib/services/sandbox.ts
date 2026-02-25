/**
 * Strategy Sandbox Service
 *
 * Enables interactive what-if exploration of patent strategies.
 * Users can toggle features on/off and see live impact on novelty scores.
 *
 * Part of the Iteration stage in the AI flow.
 * Provides: Feature Toggles, Live Novelty Score, Claim Overlap View, Feature Heatmap
 */

import { SandboxState, ClaimOverlap, ExtractedFeature, NoveltyScore } from "@/lib/types/analysis";
import { calculateNoveltyScore } from "./noveltyScoring";
import { PriorArt } from "@/lib/types/patent";

export async function initializeSandbox(
  analysisId: string,
  features: ExtractedFeature[],
  priorArt: PriorArt[]
): Promise<SandboxState> {
  const enabledFeatures = features
    .filter((f) => f.enabled)
    .map((f) => f.id);

  const liveNoveltyScore = await calculateNoveltyScore(features, priorArt);
  const claimOverlapData = await calculateClaimOverlap(features, priorArt);

  return {
    analysisId,
    enabledFeatures,
    liveNoveltyScore,
    claimOverlapData,
  };
}

export async function toggleFeature(
  sandboxState: SandboxState,
  featureId: string,
  enabled: boolean,
  allFeatures: ExtractedFeature[],
  priorArt: PriorArt[]
): Promise<SandboxState> {
  const enabledFeatures = enabled
    ? [...sandboxState.enabledFeatures, featureId]
    : sandboxState.enabledFeatures.filter((id) => id !== featureId);

  const updatedFeatures = allFeatures.map((f) => ({
    ...f,
    enabled: enabledFeatures.includes(f.id),
  }));

  const liveNoveltyScore = await calculateNoveltyScore(updatedFeatures, priorArt);
  const claimOverlapData = await calculateClaimOverlap(updatedFeatures, priorArt);

  return {
    ...sandboxState,
    enabledFeatures,
    liveNoveltyScore,
    claimOverlapData,
  };
}

async function calculateClaimOverlap(
  features: ExtractedFeature[],
  priorArt: PriorArt[]
): Promise<ClaimOverlap[]> {
  // TODO: Calculate detailed claim overlap for each enabled feature
  return features
    .filter((f) => f.enabled)
    .map((feature) => ({
      featureId: feature.id,
      featureName: feature.name,
      overlappingClaims: [],
    }));
}

export function generateHeatmapData(
  sandboxState: SandboxState
): { featureId: string; featureName: string; score: number; color: string }[] {
  return sandboxState.liveNoveltyScore.featureScores.map((fs) => ({
    featureId: fs.featureId,
    featureName: fs.featureName,
    score: fs.score,
    color: getHeatmapColor(fs.score),
  }));
}

function getHeatmapColor(score: number): string {
  if (score >= 70) return "#22c55e"; // green - novel
  if (score >= 40) return "#eab308"; // yellow - moderate risk
  return "#ef4444"; // red - high risk
}
