// Auth0 integration ready — uncomment below and remove mock when Auth0 callback URLs are configured.
// import { auth0 } from './auth0';

export async function getAuthUser() {
  // Mock user for development — replace with Auth0 when ready:
  // const session = await auth0.getSession();
  // return session?.user;
  return {
    sub: 'mock-user-id',
    name: 'Johnathan Inventor',
    email: 'john.inventor@innovatelabs.io',
  };
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
