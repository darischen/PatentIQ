import { NextResponse } from 'next/server';
// Make sure this path correctly points to your lib folder!
import { buildSafeQuery } from '../../../lib/query_builder';
import { rankAndExplain } from '../../../lib/ranking_engine';

export async function GET() {
  // 1. The Fake JSON Payload from a "Frontend User"
  const fakePayload = {
    select: ["title", "hacker_field"], // 1. Requesting a field that doesn't exist in our SCHEMA_RULES
    where: {
      logic: "AND",
      conditions: [
        { field: "salary", operator: "LIKE", value: "eighty thousand" }, // 2. Using text in a number field, with an illegal operator
      ]
    }
  };

  try {
    // 2. Pass the fake payload into your new service
    const safeQuery = buildSafeQuery(fakePayload);

    // Create some mock data to rank
    const mockData = [
      { id: 1, title: 'Software Engineer', salary: 120000, status: 'Interviewing' },
      { id: 2, title: 'Data Scientist', salary: 90000, status: 'Applied' },
      { id: 3, title: 'Frontend Developer', salary: 85000, status: 'Interviewing' },
      { id: 4, title: 'Backend Developer', salary: 110000, status: 'Offer' },
    ];

    // Assuming the user is trying to find 'Engineer' roles OR folks with a high salary
    const customConditions = [
      { field: 'title', operator: 'LIKE', value: 'Engineer' },
      { field: 'salary', operator: '>', value: 100000 },
      { field: 'status', operator: '=', value: 'Interviewing' }
    ];

    // 3. Rank and explain the results
    const rankedResults = rankAndExplain(mockData, customConditions);

    // 4. If it passes validation, return the safe object AND the ranked results!
    return NextResponse.json({
      message: "SUCCESS! Query is perfectly safe.",
      data: safeQuery,
      results: rankedResults
    });

  } catch (error: any) {
    // 5. If your Zod service catches a rule break, display the error
    return NextResponse.json({
      message: "BLOCKED! Validation caught an error.",
      errors: error.issues
    }, { status: 400 });
  }
}