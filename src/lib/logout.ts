import { signOut, getSession } from "next-auth/react";
import { userService } from "@/services/userService";

export const handleLogout = async () => {
  try {
    const session = await getSession();
    
    // If we have a refresh token, try to logout from API
    if (session?.refreshToken) {
      // Don't wait for API logout to complete - do it in parallel
      userService.logout(session.refreshToken).catch(console.warn);
    }
    
    // Immediately sign out from NextAuth (this is what matters for UI)
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    });
  } catch (error) {
    console.warn("Logout error:", error);
    // Force sign out even if there's an error
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    });
  }
};
