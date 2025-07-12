import { getSession, signOut } from "next-auth/react";

export const getToken = async (): Promise<string | null> => {
  const session = await getSession();
  
  // Check if there's a token refresh error
  if (session?.error === "RefreshAccessTokenError") {
    // Force sign out if refresh failed
    signOut({ callbackUrl: "/" });
    return null;
  }
  
  return session?.accessToken || null;
};

export const getAuthHeaders = async (): Promise<{ Authorization: string }> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Missing session token");
  }
  return { Authorization: `Bearer ${token}` };
};