import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest) {
  try {
    // Use the middleware to handle the Auth0 callback
    const res = await auth0.middleware(req);

    // The middleware returns a response that handles the callback
    // and creates the session
    return res;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_failed', req.url));
  }
}
