import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/analysis/:id/sandbox - Get sandbox state
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    // TODO: Initialize or retrieve sandbox state
    return NextResponse.json({
      analysisId: id,
      enabledFeatures: [],
      liveNoveltyScore: null,
      claimOverlapData: [],
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to get sandbox state" },
      { status: 500 }
    );
  }
}

// POST /api/analysis/:id/sandbox - Toggle a feature and recalculate
export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { featureId, enabled } = body;

    // TODO: Toggle feature, recalculate scores
    return NextResponse.json({
      analysisId: id,
      featureId,
      enabled,
      message: "Sandbox updated",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update sandbox" },
      { status: 500 }
    );
  }
}
