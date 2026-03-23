import { NextResponse } from 'next/server';
import { rankPatents } from '@/lib/analysis/query_builder';
import { generateRankingReasoning } from '@/lib/analysis/reasoning';
import { generateRecommendations } from '@/lib/analysis/recommendation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, limit = 5 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'A query string is required for recommendations' },
        { status: 400 }
      );
    }

    // 1. Search for similar patents
    const patents = await rankPatents(query, limit);

    if (patents.length === 0) {
      return NextResponse.json({
        recommendations: {
          patents: [],
          overall_recommendation: 'Proceed',
          overall_reasoning: 'No similar patents found.',
        },
      });
    }

    // 2. Generate reasoning for each patent
    const patentsWithReasoning = await generateRankingReasoning(query, patents);

    // 3. Generate recommendations
    const recommendations = await generateRecommendations(query, patentsWithReasoning);

    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error('Recommendation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
