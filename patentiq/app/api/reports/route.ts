import { NextResponse } from "next/server";

// GET /api/reports - List all reports
export async function GET() {
  try {
    // TODO: Fetch reports from database for authenticated user
    return NextResponse.json({ reports: [], total: 0 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
