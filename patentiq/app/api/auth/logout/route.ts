import { NextResponse, NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest) {
  try {
    const returnTo = req.nextUrl.searchParams.get('returnTo') || '/login';
    const res = await auth0.logout({ returnTo });
    return res;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
