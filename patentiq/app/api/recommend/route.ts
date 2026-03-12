import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/recommendation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, limit = 5, minScore } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'A query string is required for recommendations' },
        { status: 400 }
      );
    }

    // Call the recommendation logic with optional parameters
    const recommendations = await getRecommendations(
      query,
      minScore || undefined,
      limit
    );

    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error('Recommendation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
