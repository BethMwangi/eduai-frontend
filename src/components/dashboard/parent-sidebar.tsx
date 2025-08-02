"use client";

import Link from "next/link";
import { Users, TrendingUp, Settings, Calendar, BarChart3 } from "lucide-react";
import { UserComponentProps } from "@/types/auth";

interface ParentSidebarProps {
  user: UserComponentProps['user'];
  activePage?: 'dashboard' | 'children' | 'reports' | 'schedule' | 'settings';
}

export default function ParentSidebar({ user, activePage = 'dashboard' }: ParentSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.first_name?.[0] || user?.avatar || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-text">
              {user?.first_name || user?.last_name || 'User'}
            </h3>
            <p className="text-sm text-gray-500">Parent Account</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard/parent"
            className={`flex items-center gap-3 px-4 py-3 ${
              activePage === 'dashboard' 
                ? 'bg-primary/10 text-primary rounded-lg font-medium'
                : 'text-gray-600 hover:bg-gray-50 rounded-lg'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/parent/children"
            className={`flex items-center gap-3 px-4 py-3 ${
              activePage === 'children' 
                ? 'bg-primary/10 text-primary rounded-lg font-medium'
                : 'text-gray-600 hover:bg-gray-50 rounded-lg'
            }`}
          >
            <Users className="w-5 h-5" />
            My Children
          </Link>
          <Link
            href="/dashboard/parent/reports"
            className={`flex items-center gap-3 px-4 py-3 ${
              activePage === 'reports' 
                ? 'bg-primary/10 text-primary rounded-lg font-medium'
                : 'text-gray-600 hover:bg-gray-50 rounded-lg'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Progress Reports
          </Link>
          <Link
            href="/dashboard/parent/schedule"
            className={`flex items-center gap-3 px-4 py-3 ${
              activePage === 'schedule' 
                ? 'bg-primary/10 text-primary rounded-lg font-medium'
                : 'text-gray-600 hover:bg-gray-50 rounded-lg'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Study Schedule
          </Link>
          <Link
            href="/dashboard/parent/settings"
            className={`flex items-center gap-3 px-4 py-3 ${
              activePage === 'settings' 
                ? 'bg-primary/10 text-primary rounded-lg font-medium'
                : 'text-gray-600 hover:bg-gray-50 rounded-lg'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
}