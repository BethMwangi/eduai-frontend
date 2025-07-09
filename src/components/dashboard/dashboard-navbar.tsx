"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"

interface DashboardNavbarProps {
  user: {
    name: string
    email: string
    role: string
    avatar: string
  }
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSignOut = () => {
    // Add your sign out logic here
    console.log("Signing out...")
    // For now, redirect to home page
    window.location.href = "/"
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <span className="text-xl font-bold text-text">AI Assessment</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{user.avatar}</span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-text">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-text">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown */}
      {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
    </nav>
  )
}
