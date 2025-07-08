"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  TrendingUp,
  Settings,
  Calendar,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/common/Button"

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Navbar */}
      <header className="fixed top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-primary">
            EduAI
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="outlined"
              onClick={() => router.push("/login")}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar + Main */}
      <div className="pt-20 flex">
        <aside className="w-64 hidden md:block bg-primary-700 text-white min-h-screen px-6 py-8">
          {/* Profile */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">JS</span>
            </div>
            <div>
              <h3 className="font-semibold">John Smith</h3>
              <p className="text-sm text-primary-100">Parent Account</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link
              href="/parent/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-white/80 hover:text-white"
            >
              <Users className="w-5 h-5" />
              My Children
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-white/80 hover:text-white"
            >
              <TrendingUp className="w-5 h-5" />
              Progress Reports
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-white/80 hover:text-white"
            >
              <Calendar className="w-5 h-5" />
              Study Schedule
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-white/80 hover:text-white"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-10 py-6 bg-background">{children}</main>
      </div>
    </div>
  )
}
