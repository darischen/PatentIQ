import { auth0 } from './auth0';

export async function getAuthUser() {
  try {
    const session = await auth0.getSession();
    return session?.user;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
