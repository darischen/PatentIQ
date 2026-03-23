import { NextResponse } from 'next/server';
import { rankPatents } from '@/lib/analysis/query_builder';
import { generateRankingReasoning } from '@/lib/analysis/reasoning';
import { searchResultCache } from '@/lib/database/cache';

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

    // 2. Check cache before database hit
    let cacheKey = '';
    try {
      cacheKey = JSON.stringify({ query, filters });
      const cachedResults = searchResultCache.get(cacheKey);
      if (cachedResults) {
        console.log('[Search API] Cache hit for query:', query);
        return NextResponse.json({ results: cachedResults });
      }
    } catch (cacheEx) {
      console.error('[Search API] Cache read failed:', cacheEx);
      // Continue without cache if it fails
    }

    // 3. Perform Hybrid Search (Vector Ranking + Boolean Filters)
    // We pass the 'filters' as the third argument
    const rankedResults = await rankPatents(query, 5, filters);

    // If no results come back from the database, handle it gracefully
    if (!rankedResults || rankedResults.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 4. Generate the AI Explanations (Reasoning)
    const resultsWithReasoning = await generateRankingReasoning(query, rankedResults);

    // 5. Store in cache for future queries
    try {
      if (cacheKey) {
        searchResultCache.set(cacheKey, resultsWithReasoning);
        console.log('[Search API] Cached results for query:', query);
      }
    } catch (cacheEx) {
      console.error('[Search API] Cache write failed:', cacheEx);
      // Continue even if cache write fails
    }

    // 6. Send the final, enriched payload back to the frontend
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