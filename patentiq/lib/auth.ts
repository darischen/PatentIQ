import { getSession } from "@auth0/nextjs-auth0";

export async function getAuthUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
