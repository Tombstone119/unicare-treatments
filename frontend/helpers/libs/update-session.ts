import { getSession, signIn } from "next-auth/react";

/**
 * Updates the Next.js session with a new access token
 */
export async function updateNextAuthSession(
  accessToken: string,
  refreshToken?: string
): Promise<void> {
  // Get current session
  const session = await getSession();

  if (!session) return;

  // Update the session object
  session.user = {
    ...session.user,
    accessToken,
    ...(refreshToken && { refreshToken }),
  };

  // Force a session update by triggering a silent sign-in
  await signIn("credentials", {
    redirect: false,
    refreshToken: refreshToken || session.user.refreshToken,
    accessToken,
  });
}

/**
 * Handle authentication failure
 */
export async function handleAuthFailure(): Promise<void> {
  // Redirect to sign-in page with callback URL
  const callbackUrl = window.location.pathname;
  await signIn(undefined, { callbackUrl });
}
