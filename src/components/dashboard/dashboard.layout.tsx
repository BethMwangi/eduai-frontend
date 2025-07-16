"use client";

import { useUser } from "@/hooks/userUser";
import DashboardNavbar from "./dashboard-navbar";
import type { ReactNode } from "react";
import { Session } from "next-auth";


type User = Session["user"];

interface DashboardLayoutProps {
  children: (user: User) => ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useUser();



  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={user} />
      <main className="flex-1">{children(user)}</main>
    </div>
  );
}
