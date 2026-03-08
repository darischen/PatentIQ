import { NextResponse } from 'next/server';

// Auth0 handleAuth is not available in the installed version.
// This is a placeholder route that returns a redirect to the login page.
export async function GET() {
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}

export async function POST() {
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
