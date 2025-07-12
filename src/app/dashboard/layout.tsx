"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider> {children} </SessionProvider>;
}
