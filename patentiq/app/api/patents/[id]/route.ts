import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/patents/:id - Get patent details
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    // TODO: Fetch patent from USPTO or local database
    return NextResponse.json({
      id,
      patentNumber: "",
      title: "",
      abstract: "",
      claims: [],
      message: "Patent not found - placeholder",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch patent" },
      { status: 500 }
    );
  }
}
