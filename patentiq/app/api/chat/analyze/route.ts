import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AnalysisResult } from '@/lib/types/project';
import { rankPatents } from '@/lib/analysis/query_builder';
import { generateRankingReasoning } from '@/lib/analysis/reasoning';
import { getRecommendations } from '@/lib/analysis/recommendation';
import { rankAndExplain } from '@/lib/analysis/ranking_engine';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Transform real patent search results to AnalysisResult format
async function transformRealPatentsToAnalysis(
  userInput: string,
  realPatents: any[],
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

  // Map real patents to SimilarPatent format
  const similarPatentsList = realPatents.map((patent: any) => ({
    id: patent.id || patent.patent_id || '',
    application_number: patent.application_number || '',
    title: patent.title || 'Unknown Patent',
    abstract: patent.abstract || '',
    similarity_score: patent.similarity_score || 0,
    reasoning: patent.reasoning || '',
  }));

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

    // 1. Search database for REAL similar patents using vector ranking
    console.log('[Analyze API] Searching for real patents...');
    let realPatents: any[] = [];

    try {
      realPatents = await rankPatents(text, 5); // Get top 5 real patents
      console.log(`[Analyze API] Found ${realPatents.length} real patents:`, realPatents);

      // 2. Generate AI explanations for why each patent matched
      if (realPatents.length > 0) {
        console.log('[Analyze API] Generating reasoning for patents...');
        const patentsWithReasoning = await generateRankingReasoning(text, realPatents);
        realPatents = patentsWithReasoning;
        console.log(`[Analyze API] Patents with reasoning:`, realPatents);
      } else {
        console.warn('[Analyze API] No patents found in database');
      }
    } catch (searchError) {
      console.error('[Analyze API] Patent search error:', searchError);
      console.warn('[Analyze API] Continuing with feature analysis without patents');
      // If search fails, still proceed with analysis
    }

    // 3. Transform real patents into analysis result
    const analysisResult = await transformRealPatentsToAnalysis(
      text,
      realPatents,
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
