// src/app/(public)/layout.tsx
"use client";

import { useAuth } from "@/context/auth";
import Navbar from "@/components/common/Navbar";
import DashboardNavbar from "@/components/dashboard/dashboard-navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <>
      {user ? <DashboardNavbar user={user} /> : <Navbar />}
      <div className="h-16 md:h-[72px]" />
      {children}
    </>
  );
}