import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AnalysisResult } from '@/lib/types/project';
import { rankPatents } from '@/lib/analysis/query_builder';
import { generateRankingReasoning, type RankedReasoning } from '@/lib/analysis/reasoning';
import { generateRecommendations, type RecommendationResult } from '@/lib/analysis/recommendation';
import { expandQueryWithLLM } from '@/lib/search/queryExpander';
import { encryptData } from '@/lib/infra/encryption';
import { detectConceptOverlaps } from '@/lib/analysis/overlapDetection';
import { auth0 } from '@/lib/auth/auth0';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to detect concept overlaps using TypeScript
function getConceptOverlaps(
  inventionText: string,
  patents: RankedReasoning[]
): Record<string, any>[] {
  try {
    const patentsInput = patents.map(p => ({
      id: p.id,
      text: p.abstract || p.title || '',
    }));

    return detectConceptOverlaps(inventionText, patentsInput);
  } catch (error) {
    console.error('[Analyze API] Overlap detection failed:', error);
    return [];
  }
}

// Helper: Map invention concepts from overlaps to features and determine feature-level risk
function determineFeatureStatusFromOverlaps(
  features: any[],
  overlaps: Record<string, any>[]
): Record<string, { status: string; overlapCount: number; avgRisk: number }> {
  const featureRiskMap: Record<
    string,
    { status: string; overlapCount: number; avgRisk: number }
  > = {};

  // Initialize each feature
  features.forEach((f: any) => {
    featureRiskMap[f.name] = { status: 'unique', overlapCount: 0, avgRisk: 0 };
  });

  // Process each patent's overlaps
  if (!Array.isArray(overlaps) || overlaps.length === 0) {
    return featureRiskMap;
  }

  const featureOverlaps: Record<string, number[]> = {}; // Track overlap count per feature

  overlaps.forEach((patentOverlap: any) => {
    if (!patentOverlap.overlaps || !Array.isArray(patentOverlap.overlaps)) {
      return;
    }

    // For each overlap in this patent, find which feature it relates to
    patentOverlap.overlaps.forEach((overlap: any) => {
      const inventionConcept = (overlap.invention_concept || '').toLowerCase();

      // Find which feature this invention concept most closely relates to
      let bestFeatureMatch = null;
      let highestSimilarity = 0;

      features.forEach((f: any) => {
        const featureName = (f.name || '').toLowerCase();
        // Check if the invention concept is part of or related to the feature name
        if (
          inventionConcept.includes(featureName) ||
          featureName.includes(inventionConcept) ||
          // Also check if they share significant terms
          inventionConcept.split(' ').some((term: string) =>
            featureName.includes(term) && term.length > 2
          )
        ) {
          bestFeatureMatch = f.name;
          highestSimilarity = Math.max(highestSimilarity, overlap.similarity_score || 0);
        }
      });

      if (bestFeatureMatch) {
        if (!featureOverlaps[bestFeatureMatch]) {
          featureOverlaps[bestFeatureMatch] = [];
        }
        featureOverlaps[bestFeatureMatch].push(overlap.similarity_score || 0);
      }
    });
  });

  // Update feature statuses based on overlap evidence
  Object.keys(featureOverlaps).forEach((featureName: string) => {
    const scores = featureOverlaps[featureName];
    const overlapCount = scores.length;
    const avgSimilarity = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;

    // Determine status based on overlap frequency and severity
    let status = 'unique';
    if (overlapCount >= 3 && avgSimilarity >= 0.75) {
      status = 'high-risk'; // Multiple overlaps with high similarity
    } else if (overlapCount >= 2 && avgSimilarity >= 0.65) {
      status = 'high-risk'; // Two significant overlaps
    } else if (overlapCount >= 1 && avgSimilarity >= 0.7) {
      status = 'high-risk'; // Single strong overlap
    } else if (overlapCount >= 1) {
      status = 'partial'; // Some overlap detected
    }

    featureRiskMap[featureName] = {
      status,
      overlapCount,
      avgRisk: avgSimilarity,
    };
  });

  return featureRiskMap;
}

// Transform real patent search results to AnalysisResult format
async function transformRealPatentsToAnalysis(
  userInput: string,
  realPatents: any[],
  recommendations: RecommendationResult | null,
  overlaps: Record<string, any> = {},
  analysisType: string = 'concept'
): Promise<AnalysisResult> {
  // Extract top patent as closest prior art
  const closestPriorArt = realPatents[0]?.application_number || realPatents[0]?.id || realPatents[0]?.patent_id || '';

  // Build patent context for the LLM
  const patentContext = realPatents.length > 0
    ? realPatents.map((p, i) => `${i + 1}. "${p.title}" (Similarity: ${(p.similarity_score * 100).toFixed(1)}%)`).join('\n')
    : 'No similar patents found in database.';

  // Use OpenAI to analyze the user's input and extract features
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a patent analysis AI. Analyze the invention description and extract key technical features. Return valid JSON with this structure:
{
  "title": "string - brief invention title",
  "features": [
    {
      "name": "string - feature name",
      "description": "string - what it does",
      "domain": "string - technical domain",
      "riskLevel": "low" | "medium" | "high"
    }
  ],
  "noveltyScore": number (0-100),
  "confidence": number (0-100),
  "contextOverview": "string - 2-3 sentence summary",
  "cpcCodes": [
    {
      "code": "string - CPC code (e.g., G06F, H04L)",
      "title": "string - CPC category title"
    }
  ]
}`,
      },
      {
        role: 'user',
        content: `Analyze this invention: ${userInput}

Similar patents found in database:
${patentContext}

Based on these patent search results, assess the novelty score (0-100):
- If the most similar patent has high overlap (>80% similarity), novelty should be LOW (20-40)
- If overlap is moderate (60-80% similarity), novelty should be MEDIUM (40-70)
- If overlap is low (<60% similarity) or no patents found, novelty should be HIGH (70-100)
- The novelty score should inversely correlate with the highest similarity score found

Also suggest 2-4 relevant CPC (Cooperative Patent Classification) codes that best classify this invention.`,
      },
    ],
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const analysisData = JSON.parse(
    completion.choices[0]?.message?.content || '{}'
  );

  // Map real patents to SimilarPatent format with recommendation and overlap data
  const similarPatentsList = realPatents.map((patent: any) => {
    const rec = recommendations?.patents.find((r) => r.patent_id === (patent.id || patent.patent_id));
    const patentOverlaps = Array.isArray(overlaps)
      ? overlaps.find((o: any) => o.patent_id === (patent.id || patent.patent_id))
      : overlaps[patent.id || patent.patent_id];

    return {
      id: patent.id || patent.patent_id || '',
      application_number: patent.application_number || '',
      title: patent.title || 'Unknown Patent',
      abstract: patent.abstract || '',
      similarity_score: patent.similarity_score || 0,
      reasoning: patent.reasoning || '',
      match_level: rec?.match_level,
      recommendation: rec?.recommendation,
      recommendation_reasoning: rec?.recommendation_reasoning,
      concept_overlaps: patentOverlaps || null,
    };
  });

  // Determine feature statuses based on actual patent overlap data
  const featureRiskData = determineFeatureStatusFromOverlaps(
    analysisData.features || [],
    Array.isArray(overlaps) ? overlaps : []
  );

  return {
    noveltyScore: analysisData.noveltyScore || 70,
    confidence: analysisData.confidence || 85,
    summary: analysisData.contextOverview || 'Patent analysis completed.',
    features: (analysisData.features || []).map((f: any, idx: number) => {
      const riskData = featureRiskData[f.name];
      // Use overlap-based status if available, otherwise fall back to OpenAI's assessment
      const status = riskData
        ? riskData.status
        : f.riskLevel === 'high'
          ? 'high-risk'
          : f.riskLevel === 'low'
            ? 'unique'
            : 'partial';

      return {
        id: `feature-${idx}`,
        name: f.name || '',
        status: status as 'unique' | 'partial' | 'high-risk' | 'standard',
        description: f.description || '',
        domain: f.domain || 'Technical',
        category: idx === 0 ? ('Core' as const) : ('Technical' as const),
      };
    }),
    topRiskFeature: analysisData.features?.[0]?.name || 'Technical Implementation',
    closestPriorArt: closestPriorArt,
    featuresAnalyzed: analysisData.features?.length || 3,
    similarPatents: realPatents.length,
    similarPatentsList: similarPatentsList,
    analysisType: analysisType as any,
    overallRecommendation: recommendations?.overall_recommendation,
    overallRecommendationReasoning: recommendations?.overall_reasoning,
    cpcCodes: analysisData.cpcCodes || [],
  };
}


// Update project's updated_timestamp
async function updateProjectTimestamp(projectId: string) {
  if (!projectId) {
    console.warn('[Analyze API] No projectId provided, skipping timestamp update');
    return;
  }

  try {
    console.log(`[Analyze API] Updating timestamp for project: ${projectId}`);
    const session = await auth0.getSession();
    const userId = session?.user?.sub;

    if (!userId) {
      console.warn('[Analyze API] No userId in session, skipping timestamp update');
      return;
    }

    console.log(`[Analyze API] userId: ${userId}`);

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Use milliseconds for updated_at (BIGINT column, like created_at)
    const timestampMs = Date.now();
    console.log(`[Analyze API] Setting updated_at to: ${timestampMs}`);

    const result = await supabase
      .from('projects')
      .update({ updated_at: timestampMs })
      .eq('id', projectId)
      .eq('user_id', userId);

    if (result.error) {
      console.error('[Analyze API] Supabase update error:', result.error);
    } else {
      console.log('[Analyze API] Timestamp updated successfully');
    }
  } catch (error) {
    console.error('[Analyze API] Failed to update project timestamp:', error);
    // Don't throw - analysis succeeded, just timestamp update failed
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content, transcript, projectId, analysisType } = await req.json();
    const text = content || transcript;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Content or transcript is required' },
        { status: 400 }
      );
    }

    // 1. Expand query with LLM for better search coverage
    console.log('[Analyze API] Expanding query...');
    const { expanded } = await expandQueryWithLLM(text);
    console.log('[Analyze API] Query expanded');

    // 2. Search database for similar patents using expanded query
    console.log('[Analyze API] Searching for real patents...');
    let realPatents: RankedReasoning[] = [];
    let recommendations: RecommendationResult | null = null;
    let overlaps: Record<string, any> = {};

    try {
      const rawPatents = await rankPatents(expanded, 25);
      console.log(`[Analyze API] Found ${rawPatents.length} real patents`);

      // 3. Generate AI explanations for why each patent matched (uses original text)
      if (rawPatents.length > 0) {
        console.log('[Analyze API] Generating reasoning for patents...');
        realPatents = await generateRankingReasoning(text, rawPatents);

        // 4. Generate recommendations (Proceed/Refine/Caution)
        console.log('[Analyze API] Generating recommendations...');
        recommendations = await generateRecommendations(text, realPatents);
        console.log(`[Analyze API] Overall recommendation: ${recommendations.overall_recommendation}`);
        console.log(`[Analyze API] Overall reasoning: ${recommendations.overall_reasoning}`);

        // Log per-patent recommendations
        recommendations.patents.forEach((rec, idx) => {
          console.log(`[Analyze API] Patent ${idx + 1} (${rec.patent_id}): ${rec.recommendation} (${rec.match_level}) - ${rec.recommendation_reasoning}`);
        });

        // 5. Detect concept overlaps
        console.log('[Analyze API] Detecting concept overlaps...');
        overlaps = getConceptOverlaps(text, realPatents);
        console.log('[Analyze API] Concept overlaps detected');

        // Log overlap details
        if (Array.isArray(overlaps) && overlaps.length > 0) {
          overlaps.forEach((overlap: any, idx: number) => {
            console.log(
              `[Analyze API] Patent ${idx + 1} overlaps: ${overlap.overlap_count} matches, ` +
              `avg similarity ${overlap.average_similarity.toFixed(2)}, risk level: ${overlap.risk_level}`
            );
            if (overlap.highlight_terms && overlap.highlight_terms.length > 0) {
              console.log(`[Analyze API]   → Terms: ${overlap.highlight_terms.join(', ')}`);
            }
          });
        }
      } else {
        console.warn('[Analyze API] No patents found in database');
      }
    } catch (searchError) {
      console.error('[Analyze API] Patent search error:', searchError);
      console.warn('[Analyze API] Continuing with feature analysis without patents');
    }

    // 6. Transform to AnalysisResult with recommendation and overlap data
    const analysisResult = await transformRealPatentsToAnalysis(
      text,
      realPatents,
      recommendations,
      overlaps,
      analysisType
    );

    // 7. Encrypt analysis result for storage
    console.log('[Analyze API] Encrypting analysis result...');
    const { success: encryptSuccess, encrypted } = await encryptData(analysisResult);

    // 8. Update project's updated_at timestamp
    const timestamp = Date.now();
    await updateProjectTimestamp(projectId);

    if (encryptSuccess) {
      console.log('[Analyze API] Analysis result encrypted successfully');
      // Include encrypted version and timestamp in response
      const responseWithEncryption = {
        ...analysisResult,
        _encrypted: encrypted, // For backend storage
        _projectUpdatedAt: timestamp, // For frontend to update locally
      };
      return NextResponse.json(responseWithEncryption);
    } else {
      console.warn('[Analyze API] Encryption failed, returning unencrypted');
      return NextResponse.json({
        ...analysisResult,
        _projectUpdatedAt: timestamp,
      });
    }
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analysis request' },
      { status: 500 }
    );
  }
}
