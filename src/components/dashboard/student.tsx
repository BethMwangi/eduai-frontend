"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, TrendingUp, Award, Clock, Target, BarChart3, Filter, Calendar, CheckCircle } from "lucide-react"

export default function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] = useState("all")

  const subjects = [
    { name: "Mathematics", progress: 85, questionsAnswered: 245, color: "bg-primary" },
    { name: "Physics", progress: 72, questionsAnswered: 189, color: "bg-accent" },
    { name: "Chemistry", progress: 91, questionsAnswered: 312, color: "bg-secondary" },
    { name: "Biology", progress: 68, questionsAnswered: 156, color: "bg-primary" },
    { name: "English", progress: 79, questionsAnswered: 203, color: "bg-accent" },
  ]

  const recentActivity = [
    { subject: "Mathematics", quiz: "Algebra Basics", score: 92, date: "2 hours ago" },
    { subject: "Physics", quiz: "Motion & Forces", score: 78, date: "1 day ago" },
    { subject: "Chemistry", quiz: "Periodic Table", score: 95, date: "2 days ago" },
  ]

  const stats = {
    totalQuestions: 1105,
    correctAnswers: 887,
    averageScore: 80,
    streakDays: 12,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, Alex! Ready to learn today?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
              <Target className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold">{stats.streakDays} day streak!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AS</span>
              </div>
              <div>
                <h3 className="font-semibold text-text">Alex Smith</h3>
                <p className="text-sm text-gray-500">Grade 10 Student</p>
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
                <BookOpen className="w-5 h-5" />
                My Subjects
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Award className="w-5 h-5" />
                Achievements
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5" />
                Study History
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5" />
                Schedule
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Questions</p>
                  <p className="text-2xl font-bold text-text">{stats.totalQuestions.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Correct Answers</p>
                  <p className="text-2xl font-bold text-text">{stats.correctAnswers}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-text">{stats.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Study Streak</p>
                  <p className="text-2xl font-bold text-text">{stats.streakDays} days</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subject Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text">Subject Progress</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.name} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-text">{subject.name}</h3>
                      <span className="text-sm text-gray-500">{subject.questionsAnswered} questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${subject.color}`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-text">{subject.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text">{activity.quiz}</h3>
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
    </div>
  )
}
