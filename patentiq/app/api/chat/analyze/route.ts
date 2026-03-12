import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AnalysisResult } from '@/lib/types/project';

// Transform API response to AnalysisResult format
function transformToAnalysisResult(data: any, analysisType: string = 'concept'): AnalysisResult {
  return {
    noveltyScore: data.noveltyScore || data.overallNoveltyScore || 0,
    confidence: data.confidence || 0,
    summary: data.contextOverview || data.summary || '',
    features: (data.features || []).map((f: any, idx: number) => ({
      id: f.id || `feature-${idx}`,
      name: f.name || '',
      status: f.riskLevel === 'high' ? 'high-risk' : f.riskLevel === 'low' ? 'unique' : 'partial',
      description: f.description || '',
      domain: f.domain || 'Technical',
      category: f.category || 'Core' as const,
    })),
    topRiskFeature: data.keyRisks?.[0]?.featureName || data.topRiskFeature || '',
    closestPriorArt: data.features?.[0]?.closestPriorArt?.[0]?.patentNumber || data.closestPriorArt || '',
    featuresAnalyzed: data.features?.length || 0,
    similarPatents: (data.features?.reduce((sum: number, f: any) => sum + (f.closestPriorArt?.length || 0), 0)) || 0,
    analysisType: analysisType as any,
  };
}

const DEMO_ANALYSIS = {
  title: 'Patent Novelty Analysis',
  noveltyScore: 78,
  confidence: 92,
  features: [
    {
      name: 'Core Innovation Mechanism',
      noveltyScore: 85,
      riskLevel: 'low' as const,
      description:
        'The primary technical mechanism demonstrates strong novelty with limited overlap in existing patent literature.',
      closestPriorArt: [
        {
          patentNumber: 'US10,234,567',
          title: 'Related Technical Approach',
          overlapPercentage: 23,
        },
      ],
    },
    {
      name: 'Implementation Architecture',
      noveltyScore: 72,
      riskLevel: 'medium' as const,
      description:
        'The system architecture shows moderate novelty. Some structural similarities exist with prior art.',
      closestPriorArt: [
        {
          patentNumber: 'US9,876,543',
          title: 'Similar Architecture Pattern',
          overlapPercentage: 41,
        },
        {
          patentNumber: 'US10,111,222',
          title: 'Comparable System Design',
          overlapPercentage: 35,
        },
      ],
    },
    {
      name: 'Data Processing Pipeline',
      noveltyScore: 91,
      riskLevel: 'low' as const,
      description:
        'The data processing approach is highly novel with minimal prior art overlap.',
      closestPriorArt: [
        {
          patentNumber: 'US10,333,444',
          title: 'Data Handling Method',
          overlapPercentage: 12,
        },
      ],
    },
    {
      name: 'User Interface Method',
      noveltyScore: 45,
      riskLevel: 'high' as const,
      description:
        'The UI interaction pattern has significant overlap with existing patents. Consider alternative approaches.',
      closestPriorArt: [
        {
          patentNumber: 'US9,555,666',
          title: 'Interactive Display System',
          overlapPercentage: 67,
        },
        {
          patentNumber: 'US10,777,888',
          title: 'User Interface Method',
          overlapPercentage: 54,
        },
      ],
    },
  ],
  keyRisks: [
    {
      featureName: 'User Interface Method',
      riskLevel: 'high' as const,
      description:
        'Significant overlap detected with US9,555,666. Consider redesigning the interaction pattern or narrowing claims.',
      mitigation:
        'Focus claims on the novel data processing aspects rather than the UI layer.',
    },
    {
      featureName: 'Implementation Architecture',
      riskLevel: 'medium' as const,
      description:
        'Moderate overlap with existing system architectures. The specific combination may still be patentable.',
      mitigation:
        'Emphasize the unique integration of components rather than individual architectural elements.',
    },
  ],
  contextOverview:
    'The invention demonstrates strong overall novelty, particularly in its core mechanism and data processing pipeline. The primary risk area is the user interface method, which has substantial prior art overlap. A strategic approach focusing claims on the novel technical components while minimizing UI-specific claims would strengthen the patent application.',
  recommendedStrategy:
    'File with emphasis on core mechanism and data processing claims. Consider design patent for UI elements separately.',
};

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

    if (!process.env.OPENAI_API_KEY) {
      // Return demo analysis data when no API key is configured
      return NextResponse.json(transformToAnalysisResult(DEMO_ANALYSIS, analysisType));
    }

    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a patent analysis AI. Given a transcript of an invention description conversation, generate a structured patent novelty analysis. Return valid JSON with this exact structure:
{
  "title": "string - analysis title",
  "noveltyScore": number (0-100),
  "confidence": number (0-100),
  "features": [
    {
      "name": "string",
      "noveltyScore": number (0-100),
      "riskLevel": "low" | "medium" | "high",
      "description": "string",
      "closestPriorArt": [
        {
          "patentNumber": "string",
          "title": "string",
          "overlapPercentage": number (0-100)
        }
      ]
    }
  ],
  "keyRisks": [
    {
      "featureName": "string",
      "riskLevel": "low" | "medium" | "high",
      "description": "string",
      "mitigation": "string"
    }
  ],
  "contextOverview": "string - 2-3 sentence summary",
  "recommendedStrategy": "string - strategic recommendation"
}

Analyze the invention thoroughly and provide realistic patent novelty assessments.`,
        },
        {
          role: 'user',
          content: `Analyze this invention conversation transcript for patent novelty:\n\n${text}`,
        },
      ],
      max_tokens: 5000,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json(transformToAnalysisResult(DEMO_ANALYSIS, analysisType));
    }

    try {
      const apiData = JSON.parse(responseContent);
      return NextResponse.json(transformToAnalysisResult(apiData, analysisType));
    } catch {
      // If parsing fails, return demo data
      return NextResponse.json(transformToAnalysisResult(DEMO_ANALYSIS, analysisType));
    }
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analysis request' },
      { status: 500 }
    );
  }
}
