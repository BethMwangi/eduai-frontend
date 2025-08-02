"use client";

import { ReactNode } from "react";
import DashboardNavbar from "./dashboard-navbar";
import type { User } from "@/types/auth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
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
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNavbar user={user} />
      <main className="flex-1">{children(user)}</main>
    </div>
  );
}
