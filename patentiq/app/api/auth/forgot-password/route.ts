import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    const clientId = process.env.AUTH0_CLIENT_ID;

    if (!auth0Domain || !clientId) {
      return NextResponse.json(
        { error: 'Auth0 configuration missing' },
        { status: 500 }
      );
    }

    // Redirect to Auth0's login page - users will see "Forgot Password?" link there
    const loginUrl = `https://${auth0Domain}/login?client_id=${clientId}&protocol=oauth2&response_type=code&redirect_uri=${encodeURIComponent(
      `${process.env.AUTH0_BASE_URL}/api/auth/callback`
    )}&scope=openid%20profile%20email`;

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate password reset' },
      { status: 500 }
    );
  }
}
