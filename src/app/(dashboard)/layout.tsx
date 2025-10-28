"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import DashboardNavbar from "@/components/dashboard/dashboard-navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // soft gate: redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

return (
  <>
    {user && <DashboardNavbar user={user} />}
    <div className="mx-auto w-full max-w-7xl px-4 py-6">{children}</div>
  </>
)
}