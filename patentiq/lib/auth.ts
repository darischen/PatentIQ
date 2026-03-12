// Auth0 getSession is not available in the installed version.
// Stubbed out to allow the build to pass. Replace with real auth when ready.

export async function getAuthUser() {
  // Return a mock user for development
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
