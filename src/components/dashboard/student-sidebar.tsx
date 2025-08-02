// src/components/dashboard/student-sidebar.tsx
"use client";

import Link from "next/link";
import {
  BarChart3,
  User,
  Award,
  BookOpen,
  Play,
} from "lucide-react";
import { UserComponentProps } from "@/types/auth";

export type StudentSidebarPage =
  | "dashboard"
  | "question-pool"
  | "profile"
  | "achievements"
  | "practice";

interface StudentSidebarProps {
  user: UserComponentProps["user"];
  activePage?: StudentSidebarPage;
  onViewChange?: (view: "dashboard" | "question-pool") => void;
}

export default function StudentSidebar({
  user,
  activePage = "dashboard",
  onViewChange,
}: StudentSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.first_name?.[0] || user?.avatar || "U"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-text">
              {user?.first_name || user?.full_name || "Student"}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {user?.role || "Student"}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => onViewChange?.("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${
              activePage === "dashboard"
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => onViewChange?.("question-pool")}
            className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${
              activePage === "question-pool"
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Question Pool
          </button>

          <Link
            href="/student/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activePage === "profile"
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </Link>

          <Link
            href="/student/achievements"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activePage === "achievements"
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Award className="w-5 h-5" />
            Achievements
          </Link>

          <Link
            href="/student/practice/continue"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Play className="w-5 h-5" />
            Continue Practice
          </Link>
        </nav>
      </div>
    </div>
  );
}
