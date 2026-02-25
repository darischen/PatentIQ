import { NextRequest, NextResponse } from "next/server";

// POST /api/analysis - Create a new analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, inputMethod, inputContent } = body;

    if (!title || !inputMethod || !inputContent) {
      return NextResponse.json(
        { error: "Missing required fields: title, inputMethod, inputContent" },
        { status: 400 }
      );
    }

    // TODO: Create analysis in database
    // TODO: Trigger preprocessing pipeline
    const analysis = {
      id: crypto.randomUUID(),
      title,
      inputMethod,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(analysis, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create analysis" },
      { status: 500 }
    );
  }
}

// GET /api/analysis - List all analyses for user
export async function GET() {
  try {
    // TODO: Fetch analyses from database for authenticated user
    const analyses: unknown[] = [];

    return NextResponse.json({ analyses, total: 0 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
