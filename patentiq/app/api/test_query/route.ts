import { NextResponse } from 'next/server';
// Make sure this path correctly points to your lib folder!
import { buildSafeQuery } from '../../../lib/query_builder';; 

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
    
    // 3. If it passes validation, return the safe object!
    return NextResponse.json({ 
        message: "SUCCESS! Query is perfectly safe.", 
        data: safeQuery 
    });

  } catch (error: any) {
    // 4. If your Zod service catches a rule break, display the error
    return NextResponse.json({ 
        message: "BLOCKED! Validation caught an error.", 
        errors: error.issues 
    }, { status: 400 });
  }
}