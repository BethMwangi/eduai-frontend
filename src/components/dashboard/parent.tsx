"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Plus, TrendingUp, BookOpen, Settings, Eye, Calendar, BarChart3 } from "lucide-react"
import DashboardLayout from "./dashboard.layout"

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("all")

  // Mock user data - in real app, this would come from authentication
  const user = {
    name: "John Smith",
    email: "john.smith@email.com",
    role: "parent",
    avatar: "JS",
  }

  const children = [
    {
      id: 1,
      name: "Alex Smith",
      age: 15,
      grade: "Grade 10",
      avatar: "AS",
      totalQuestions: 1105,
      correctAnswers: 887,
      averageScore: 80,
      streakDays: 12,
      subjects: 5,
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Emma Smith",
      age: 12,
      grade: "Grade 7",
      avatar: "ES",
      totalQuestions: 645,
      correctAnswers: 523,
      averageScore: 81,
      streakDays: 8,
      subjects: 4,
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Jake Smith",
      age: 9,
      grade: "Grade 4",
      avatar: "JS",
      totalQuestions: 234,
      correctAnswers: 198,
      averageScore: 85,
      streakDays: 5,
      subjects: 3,
      lastActive: "3 hours ago",
    },
  ]

  const recentActivity = [
    { child: "Alex", subject: "Mathematics", quiz: "Algebra Basics", score: 92, date: "2 hours ago" },
    { child: "Emma", subject: "English", quiz: "Grammar Rules", score: 88, date: "4 hours ago" },
    { child: "Jake", subject: "Mathematics", quiz: "Addition & Subtraction", score: 95, date: "1 day ago" },
  ]

  return (
    <DashboardLayout user={user}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Parent Dashboard</h1>
            <p className="text-gray-600">Monitor your children's learning progress</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-5 h-5" />
            Add Child
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{user.avatar}</span>
              </div>
              <div>
                <h3 className="font-semibold text-text">{user.name}</h3>
                <p className="text-sm text-gray-500">Parent Account</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users className="w-5 h-5" />
                My Children
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <TrendingUp className="w-5 h-5" />
                Progress Reports
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5" />
                Study Schedule
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Rest of the existing content remains the same */}
          {/* Children Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{child.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text">{child.name}</h3>
                    <p className="text-sm text-gray-500">
                      {child.grade} • Age {child.age}
                    </p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-text">{child.averageScore}%</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{child.streakDays}</p>
                    <p className="text-xs text-gray-500">Day Streak</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{child.subjects} subjects</span>
                  <span>{child.totalQuestions} questions</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Last active: {child.lastActive}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      child.lastActive.includes("hour") ? "bg-accent" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Family Progress Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-6">Family Progress Overview</h2>

              <div className="space-y-6">
                {children.map((child) => (
                  <div key={child.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{child.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-text">{child.name}</h3>
                          <p className="text-sm text-gray-500">{child.grade}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text">{child.averageScore}%</p>
                        <p className="text-xs text-gray-500">Average</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="font-medium text-text">{child.totalQuestions}</p>
                        <p className="text-gray-500">Questions</p>
                      </div>
                      <div>
                        <p className="font-medium text-accent">{child.correctAnswers}</p>
                        <p className="text-gray-500">Correct</p>
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{child.streakDays}</p>
                        <p className="text-gray-500">Streak</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Family Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-6">Recent Family Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text">
                        {activity.child} - {activity.quiz}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activity.subject} • {activity.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          activity.score >= 90
                            ? "bg-accent/10 text-accent"
                            : activity.score >= 70
                              ? "bg-secondary/10 text-secondary"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {activity.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
