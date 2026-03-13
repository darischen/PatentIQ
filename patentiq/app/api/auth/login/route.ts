import { NextResponse, NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest) {
  try {
    const res = await auth0.startInteractiveLogin({
      returnTo: '/projects',
    });
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to start login' },
      { status: 500 }
    );
  }
}
