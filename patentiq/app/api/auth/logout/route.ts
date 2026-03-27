import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const returnTo = req.nextUrl.searchParams.get('returnTo') || `${process.env.AUTH0_BASE_URL}/login`;
    const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') || '';
    const clientId = process.env.AUTH0_CLIENT_ID || '';

    const logoutUrl = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;

    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
