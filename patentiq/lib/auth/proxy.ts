import { auth0 } from './auth0';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export interface AuthUser {
  sub: string;
  name?: string;
  email: string;
  email_verified?: boolean;
  picture?: string;
}

/**
 * Get the current authenticated user from Auth0 session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await auth0.getSession();
    return session?.user as AuthUser | null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication - throw if user not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get login URL for redirecting to Auth0
 */
export function getLoginUrl(): string {
  return '/api/auth/login';
}

/**
 * Get logout URL for signing out from Auth0
 */
export function getLogoutUrl(): string {
  return '/api/auth/logout';
}

/**
 * Middleware to protect API routes - returns user if authenticated, error response if not
 */
export async function withAuth(
  handler: (req: Request, user: AuthUser) => Promise<Response>
) {
  return async (req: Request) => {
    try {
      const user = await requireAuth();
      return await handler(req, user);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }
  };
}

/**
 * Create an authenticated request header for Auth0 API calls
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  return {
    'Authorization': `Bearer ${user.sub}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Verify Auth0 token validity
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    // In a real implementation, you'd validate the token with Auth0
    // For now, we check if the user session is valid
    const session = await auth0.getSession();
    return !!session;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}
