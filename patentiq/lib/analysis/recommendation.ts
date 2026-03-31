import OpenAI from 'openai';
import type { RankedReasoning } from './reasoning';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const RECOMMENDATION_THRESHOLDS = {
  HIGH_MATCH: 0.85,
  MEDIUM_MATCH: 0.70,
  LOW_MATCH: 0.50,
};

export type MatchLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'POOR';
export type RecommendationAction = 'Proceed' | 'Refine' | 'Caution';

export interface PatentRecommendation {
  patent_id: string;
  match_level: MatchLevel;
  recommendation: RecommendationAction;
  recommendation_reasoning: string;
}

export interface RecommendationResult {
  patents: PatentRecommendation[];
  overall_recommendation: RecommendationAction;
  overall_reasoning: string;
}

export function getMatchLevel(score: number): MatchLevel {
  if (score >= RECOMMENDATION_THRESHOLDS.HIGH_MATCH) return 'HIGH';
  if (score >= RECOMMENDATION_THRESHOLDS.MEDIUM_MATCH) return 'MEDIUM';
  if (score >= RECOMMENDATION_THRESHOLDS.LOW_MATCH) return 'LOW';
  return 'POOR';
}

function getDefaultAction(level: MatchLevel): RecommendationAction {
  if (level === 'HIGH') return 'Caution';
  if (level === 'MEDIUM') return 'Refine';
  return 'Proceed';
}

/**
 * Generates actionable recommendations for each patent and an overall recommendation.
 * Accepts already-ranked patents (no duplicate DB query).
 * Uses a single batched GPT call for efficiency.
 */
export async function generateRecommendations(
  userInput: string,
  patents: RankedReasoning[]
): Promise<RecommendationResult> {
  // Assign match levels from thresholds
  const patentsWithLevels = patents.map((p) => ({
    id: p.id,
    title: p.title,
    abstract: p.abstract,
    similarity_score: p.similarity_score,
    reasoning: p.reasoning,
    match_level: getMatchLevel(p.similarity_score),
  }));

  // If no patents, return a default Proceed recommendation
  if (patentsWithLevels.length === 0) {
    return {
      patents: [],
      overall_recommendation: 'Proceed',
      overall_reasoning: 'No similar patents found in the database. The invention appears to be novel based on available data.',
    };
  }

  try {
    const patentSummaries = patentsWithLevels.map((p, i) =>
      `Patent ${i + 1} (ID: ${p.id}):
  Title: ${p.title}
  Similarity: ${(p.similarity_score * 100).toFixed(1)}%
  Match Level: ${p.match_level}
  Why it matched: ${p.reasoning}`
    ).join('\n\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a patent strategy advisor. Given a user's invention and similar patents found, provide actionable recommendations.

For each patent, recommend one of:
- "Proceed" — Low overlap, the invention is sufficiently distinct from this patent
- "Refine" — Moderate overlap, the user should differentiate their claims from this patent
- "Caution" — High overlap, significant risk of prior art conflict

Also provide an overall recommendation for the invention as a whole.

Return valid JSON:
{
  "patents": [
    {
      "patent_id": "exact ID from input",
      "recommendation": "Proceed" | "Refine" | "Caution",
      "recommendation_reasoning": "1-2 sentence explanation"
    }
  ],
  "overall_recommendation": "Proceed" | "Refine" | "Caution",
  "overall_reasoning": "2-3 sentence strategic summary"
}`,
        },
        {
          role: 'user',
          content: `User's Invention: ${userInput}

Similar Patents Found:
${patentSummaries}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Merge LLM recommendations with threshold-based match levels
    const enrichedPatents: PatentRecommendation[] = patentsWithLevels.map((p) => {
      const llmRec = result.patents?.find((r: any) => r.patent_id === p.id);
      return {
        patent_id: p.id,
        match_level: p.match_level,
        recommendation: llmRec?.recommendation || getDefaultAction(p.match_level),
        recommendation_reasoning: llmRec?.recommendation_reasoning || `${p.match_level} similarity match (${(p.similarity_score * 100).toFixed(1)}%).`,
      };
    });

    return {
      patents: enrichedPatents,
      overall_recommendation: result.overall_recommendation || getDefaultAction(patentsWithLevels[0].match_level),
      overall_reasoning: result.overall_reasoning || 'Analysis complete. Review individual patent recommendations for details.',
    };
  } catch (error) {
    console.error('[Recommendations] GPT recommendation generation failed:', error);

    // Fallback: use threshold-based defaults
    return {
      patents: patentsWithLevels.map((p) => ({
        patent_id: p.id,
        match_level: p.match_level,
        recommendation: getDefaultAction(p.match_level),
        recommendation_reasoning: `${p.match_level} similarity match (${(p.similarity_score * 100).toFixed(1)}%).`,
      })),
      overall_recommendation: getDefaultAction(patentsWithLevels[0].match_level),
      overall_reasoning: 'Recommendation generated from similarity thresholds. GPT analysis was unavailable.',
    };
  }
}
