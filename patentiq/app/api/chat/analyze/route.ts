import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { spawn } from 'child_process';
import { join } from 'path';
import type { AnalysisResult } from '@/lib/types/project';
import { rankPatents } from '@/lib/analysis/query_builder';
import { generateRankingReasoning, type RankedReasoning } from '@/lib/analysis/reasoning';
import { generateRecommendations, type RecommendationResult } from '@/lib/analysis/recommendation';
import { expandQueryWithLLM } from '@/lib/search/queryExpander';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to detect concept overlaps using Python
async function detectConceptOverlaps(
  inventionText: string,
  patents: RankedReasoning[]
): Promise<Record<string, any>[]> {
  try {
    const inputData = {
      invention: inventionText,
      patents: patents.map(p => ({
        id: p.id,
        text: p.abstract || p.title || '',
      })),
    };

    const scriptPath = join(process.cwd(), 'scripts', 'detect_overlaps.py');

    return new Promise((resolve, reject) => {
      const python = spawn('python', [scriptPath]);
      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          console.error('[Overlap Detection] Python error:', errorOutput);
          reject(new Error(errorOutput || `Python script exited with code ${code}`));
          return;
        }
        try {
          resolve(JSON.parse(output));
        } catch (e) {
          console.error('[Overlap Detection] JSON parse error:', output);
          reject(e);
        }
      });

      // Send input via stdin
      python.stdin.write(JSON.stringify(inputData));
      python.stdin.end();
    });
  } catch (error) {
    console.error('[Analyze API] Overlap detection failed:', error);
    return [];
  }
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
  "contextOverview": "string - 2-3 sentence summary"
}`,
      },
      {
        role: 'user',
        content: `Analyze this invention: ${userInput}`,
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

  return {
    noveltyScore: analysisData.noveltyScore || 70,
    confidence: analysisData.confidence || 85,
    summary: analysisData.contextOverview || 'Patent analysis completed.',
    features: (analysisData.features || []).map((f: any, idx: number) => ({
      id: `feature-${idx}`,
      name: f.name || '',
      status: f.riskLevel === 'high' ? 'high-risk' : f.riskLevel === 'low' ? 'unique' : 'partial',
      description: f.description || '',
      domain: f.domain || 'Technical',
      category: idx === 0 ? ('Core' as const) : ('Technical' as const),
    })),
    topRiskFeature: analysisData.features?.[0]?.name || 'Technical Implementation',
    closestPriorArt: closestPriorArt,
    featuresAnalyzed: analysisData.features?.length || 3,
    similarPatents: realPatents.length,
    similarPatentsList: similarPatentsList,
    analysisType: analysisType as any,
    overallRecommendation: recommendations?.overall_recommendation,
    overallRecommendationReasoning: recommendations?.overall_reasoning,
  };
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
      const rawPatents = await rankPatents(expanded, 5);
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

        // 5. Detect concept overlaps with Python
        console.log('[Analyze API] Detecting concept overlaps...');
        overlaps = await detectConceptOverlaps(text, realPatents);
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

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analysis request' },
      { status: 500 }
    );
  }
}
