import { NextRequest, NextResponse } from "next/server";
import { getPatentSearchQueriesJSON } from "../../../lib/patentQueryGenerator.js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const concepts: string[] = body.concepts;
    if (!Array.isArray(concepts) || concepts.length === 0) {
      return NextResponse.json({ error: "Missing or invalid 'concepts' array." }, { status: 400 });
    }

    // Generate queries
    const queriesJson = getPatentSearchQueriesJSON(concepts);
    const queries = JSON.parse(queriesJson).queries;

    // TODO: Integrate with USPTO API here
    // For now, just return the generated queries
    return NextResponse.json({ queries });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request or server error." }, { status: 500 });
  }
}
