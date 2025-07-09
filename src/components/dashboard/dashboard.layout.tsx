"use client"

import type React from "react"

import DashboardNavbar from "./dashboard-navbar"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    name: string
    email: string
    role: string
    avatar: string
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
