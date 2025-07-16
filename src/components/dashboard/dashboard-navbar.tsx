"use client";

import Link from "next/link";
import { handleLogout } from "@/lib/logout";
import { getDisplayName, getInitials } from "@/lib/utils";
import { UserComponentProps } from "@/types/auth";
import { Button } from "@/components/common/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function DashboardNavbar({ user }: UserComponentProps) {
   const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

   const handleSignOut = () => {
    setIsLoggingOut(true);
    
    document.body.classList.add("logging-out");

    router.push("/");
    
    handleLogout().catch((error) => {
      console.error("Error during sign out:", error);
    });
  };


  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <span className="text-xl font-bold text-text">AI Assessment</span>
            </Link>
          </div>

          {/* User & Sign Out */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text">
                  {displayName}
                </span>
                {user?.role && (
                  <span className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outlined"
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-red-200 hover:border-red-300"
            >
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
