import OpenAI from 'openai';
import { db } from './db';
import { PatentResult } from './query_builder';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Define explicit scoring thresholds for recommendation quality.
 * These thresholds are used to categorize and filter search results.
 */
export const RECOMMENDATION_THRESHOLDS = {
  HIGH_MATCH: 0.85,    // Highly relevant patents
  MEDIUM_MATCH: 0.70,  // Moderately relevant patents
  LOW_MATCH: 0.50,     // Loosely related patents
};

export type MatchLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'POOR';

export interface ScoredRecommendation extends PatentResult {
  match_level: MatchLevel;
}

/**
 * Determines the match level based on the similarity score.
 */
function getMatchLevel(score: number): MatchLevel {
  if (score >= RECOMMENDATION_THRESHOLDS.HIGH_MATCH) return 'HIGH';
  if (score >= RECOMMENDATION_THRESHOLDS.MEDIUM_MATCH) return 'MEDIUM';
  if (score >= RECOMMENDATION_THRESHOLDS.LOW_MATCH) return 'LOW';
  return 'POOR';
}

/**
 * Standalone recommendation engine that retrieves and filters patents
 * based on the defined scoring thresholds.
 * 
 * @param queryText The user's search query or patent description
 * @param minimumScore The exact similarity threshold required for inclusion
 * @param limit Maximum number of results to return
 */
export async function getRecommendations(
  queryText: string,
  minimumScore: number = RECOMMENDATION_THRESHOLDS.MEDIUM_MATCH,
  limit: number = 5
): Promise<ScoredRecommendation[]> {
  try {
    // 1. Get Vector Embedding for the incoming query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: queryText,
    });
    const queryVector = embeddingResponse.data[0].embedding;
    const vectorString = `[${queryVector.join(',')}]`;

    // 2. Query Postgres for semantic similarity
    // We compute: 1 - cosine_distance as the similarity score
    const queryResult = await db.query(
      `SELECT
        id,
        title,
        abstract,
        1 - (embedding <=> $1::vector) AS similarity_score
      FROM patents
      ORDER BY embedding <=> $1::vector
      LIMIT 20`,
      [vectorString]
    );
    const results = queryResult.rows as PatentResult[];

    // 3. Filter using the strict recommendation threshold and assign levels
    const filteredAndScored = results
      .filter((patent) => patent.similarity_score >= minimumScore)
      .map((patent) => ({
        ...patent,
        match_level: getMatchLevel(patent.similarity_score)
      }))
      // Sort strictly by score highest to lowest
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);

    return filteredAndScored;

  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw new Error("Failed to process recommendation logic");
  }
}
