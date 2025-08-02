"use client";

import Link from "next/link";
import { getDisplayName, getInitials } from "@/lib/utils";
import { UserComponentProps } from "@/types/auth";
import { Button } from "@/components/common/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/auth";


export default function DashboardNavbar({ user }: UserComponentProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    document.body.classList.add("logging-out");
    try {
      await logout(); // handles redirect to /login internally
    } catch (error) {
      console.error("Error during sign out:", error);
      // fallback redirect
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
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
              <Image
                src="/logo.png"
                alt="StudyPool Logo"
                width={100}
                height={40}
                className="mr-2"
              />
          
            <div className="flex items-center">
              <span className="font-bold text-[#182b5c] text-2xl">STUDY</span>
              <span className="font-bold text-[#ff914d] text-2xl">pool</span>
            </div>
            </Link>
          </div>

          {/* User & Sign Out */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
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
