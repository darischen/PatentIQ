import { NextResponse } from 'next/server';
import { rankPatents } from '@/lib/query_builder';
import { generateRankingReasoning } from '@/lib/reasoning';

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming request body
    const body = await req.json();
    
    // We now extract both the text 'query' and the structured 'filters'
    const { query, filters } = body;

    // Validate that a text query was actually provided
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'A valid search query is required' }, 
        { status: 400 }
      );
    }

    // 2. Perform Hybrid Search (Vector Ranking + Boolean Filters)
    // We pass the 'filters' as the third argument
    const rankedResults = await rankPatents(query, 5, filters);

    // If no results come back from the database, handle it gracefully
    if (!rankedResults || rankedResults.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 3. Generate the AI Explanations (Reasoning)
    const resultsWithReasoning = await generateRankingReasoning(query, rankedResults);

    // 4. Send the final, enriched payload back to the frontend
    return NextResponse.json({ results: resultsWithReasoning });

  } catch (error) {
    // Check if the error came from Zod validation in the query builder
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid filter structure provided.' },
        { status: 400 }
      );
    }

    console.error("Search API Route Error:", error);
    return NextResponse.json(
      { error: 'An error occurred while processing your search.' }, 
      { status: 500 }
    );
  }
}