import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/proxy';

/**
 * Example protected API route
 * Only authenticated users can access this endpoint
 */
export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    return NextResponse.json({
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized - authentication required' },
      { status: 401 }
    );
  }
}
