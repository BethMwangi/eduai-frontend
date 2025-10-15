"use client";

import { ReactNode } from "react";
import type { User } from "@/types/auth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DashboardNavbar from "./dashboard-navbar";

interface DashboardLayoutProps {
  children: (user: User) => ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    // redirect is in the hook; avoid rendering anything while that's happening
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {typeof children === "function" ? children(user) : children}
      </main>
    </div>
  );
}
