import { signOut } from "next-auth/react";
import { userService } from "@/services/userService";

export const handleLogout = async () => {
  // Start the NextAuth signOut process immediately 
  // Don't wait for the API call to complete
  const signOutPromise = signOut({ 
    callbackUrl: "/", 
    redirect: true 
  });
  
  // In parallel, try to call the backend logout
  try {
    // We're deliberately NOT awaiting this, letting it run in the background
    userService.logout().catch(err => {
      // Just log errors, don't block the signout
      console.warn("Backend logout failed:", err);
    });
  } catch (error) {
    // Ignore errors with the backend logout
    console.warn("Error during backend logout:", error);
  }

  // Wait for signOut to complete
  return signOutPromise;
};