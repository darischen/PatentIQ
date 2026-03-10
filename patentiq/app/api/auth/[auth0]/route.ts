import { handleAuth } from '@auth0/nextjs-auth0';

const authHandler = handleAuth();

export async function GET(request: Request, props: { params: Promise<any> }) {
  const params = await props.params;
  return authHandler(request, { params });
}

export async function POST(request: Request, props: { params: Promise<any> }) {
  const params = await props.params;
  return authHandler(request, { params });
}