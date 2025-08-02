// src/hooks/useRequireAuth.ts
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth";

export function useRequireAuth(): { user: User | null; loading: boolean } {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  return { user, loading };
}
