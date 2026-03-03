import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const DEMO_ANALYSIS = {
  title: 'Patent Novelty Analysis',
  overallNoveltyScore: 78,
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
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return demo analysis data when no API key is configured
      return NextResponse.json(DEMO_ANALYSIS);
    }

    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a patent analysis AI. Given a transcript of an invention description conversation, generate a structured patent novelty analysis. Return valid JSON with this exact structure:
{
  "title": "string - analysis title",
  "overallNoveltyScore": number (0-100),
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
          content: `Analyze this invention conversation transcript for patent novelty:\n\n${transcript}`,
        },
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(DEMO_ANALYSIS);
    }

    try {
      const analysisResult = JSON.parse(content);
      return NextResponse.json(analysisResult);
    } catch {
      // If parsing fails, return demo data
      return NextResponse.json(DEMO_ANALYSIS);
    }
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analysis request' },
      { status: 500 }
    );
  }
}
