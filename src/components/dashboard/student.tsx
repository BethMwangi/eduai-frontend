"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Target,
  BarChart3,
  Filter,
  Calendar,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Trophy,
  User,
} from "lucide-react"
import DashboardLayout from "./dashboard.layout"

export default function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] = useState("all")

  const user = {
    name: "Alex Smith",
    email: "alex.smith@email.com",
    role: "student",
    avatar: "AS",
  }

  const subjects = [
    { name: "Mathematics", progress: 85, questionsAnswered: 245, color: "bg-primary", totalQuestions: 300 },
    { name: "Physics", progress: 72, questionsAnswered: 189, color: "bg-accent", totalQuestions: 250 },
    { name: "Chemistry", progress: 91, questionsAnswered: 312, color: "bg-secondary", totalQuestions: 350 },
    { name: "Biology", progress: 68, questionsAnswered: 156, color: "bg-primary", totalQuestions: 200 },
    { name: "English", progress: 79, questionsAnswered: 203, color: "bg-accent", totalQuestions: 280 },
  ]

  const recentActivity = [
    { subject: "Mathematics", quiz: "Linear Algebra Basics", score: 92, date: "2 hours ago", questions: 25 },
    { subject: "Physics", quiz: "Motion & Forces", score: 78, date: "1 day ago", questions: 30 },
    { subject: "Chemistry", quiz: "Periodic Table", score: 95, date: "2 days ago", questions: 20 },
  ]

  const stats = {
    totalQuestions: 1105,
    correctAnswers: 887,
    averageScore: 80,
    streakDays: 12,
  }

  const quickActions = [
    {
      title: "Browse Question Pool",
      description: "Access all available question papers for Grade 10",
      icon: BookOpen,
      href: "/student/question-pool",
      color: "bg-primary",
      count: "150+ Papers",
      badge: "New papers added!",
    },
    {
      title: "Continue Practice",
      description: "Resume your last practice session",
      icon: Play,
      href: "/student/practice/continue",
      color: "bg-accent",
      count: "3 In Progress",
      badge: null,
    },
    {
      title: "View Achievements",
      description: "Check your badges and milestones",
      icon: Award,
      href: "/student/achievements",
      color: "bg-secondary",
      count: "12 Earned",
      badge: "2 new badges!",
    },
  ]

  const upcomingTests = [
    { subject: "Mathematics", title: "Calculus Final", date: "Tomorrow", difficulty: "Hard" },
    { subject: "Physics", title: "Mechanics Quiz", date: "Dec 15", difficulty: "Medium" },
    { subject: "Chemistry", title: "Organic Chemistry", date: "Dec 18", difficulty: "Hard" },
  ]

  const achievements = [
    { title: "Math Wizard", description: "Completed 50 math questions", icon: "🧮", earned: true },
    { title: "Speed Demon", description: "Finished test in under 30 mins", icon: "⚡", earned: true },
    { title: "Perfect Score", description: "Got 100% on a test", icon: "🎯", earned: false },
    { title: "Study Streak", description: "7 days in a row", icon: "🔥", earned: true },
  ]

  return (
    <DashboardLayout user={user}>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Welcome back, {user.name}! ✨</h1>
              <p className="text-gray-600 text-lg">Keep up the great work. You're doing amazing!</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-accent font-semibold text-sm">{stats.streakDays} day streak!</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span className="text-secondary font-semibold text-sm">Top 10% in class</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder.svg?height=120&width=120"
                alt="Student illustration"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <div className="p-6">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{user.avatar}</span>
              </div>
              <div>
                <h3 className="font-semibold text-text">{user.name}</h3>
                <p className="text-sm text-gray-500">Grade 10 Student</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-secondary fill-current" />
                  <span className="text-xs text-secondary font-medium">Level 5</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <Link
                href="/dashboard/student"
                className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="/student/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <User className="w-5 h-5 group-hover:text-primary transition-colors" />
                Profile
              </Link>
              <Link
                href="/student/question-pool"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <BookOpen className="w-5 h-5 group-hover:text-primary transition-colors" />
                Question Pool
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
              </Link>
              <Link
                href="/student/achievements"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <Award className="w-5 h-5 group-hover:text-secondary transition-colors" />
                Achievements
                <span className="ml-auto bg-secondary text-white text-xs px-2 py-0.5 rounded-full">2</span>
              </Link>
              <Link
                href="/student/history"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <Clock className="w-5 h-5 group-hover:text-accent transition-colors" />
                Study History
              </Link>
              <Link
                href="/student/schedule"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <Calendar className="w-5 h-5 group-hover:text-primary transition-colors" />
                Schedule
              </Link>
            </nav>

            {/* Quick Stats in Sidebar */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-text mb-3 text-sm">This Week</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Solved</span>
                  <span className="font-semibold text-text">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Studied</span>
                  <span className="font-semibold text-text">8.5h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Score</span>
                  <span className="font-semibold text-accent">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {/* Quick Actions - Enhanced */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Quick Actions</h2>
              <Link href="/student/question-pool" className="text-primary hover:text-primary/80 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-gray-500">{action.count}</div>
                      {action.badge && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{action.badge}</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Stats Cards - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Questions</p>
                  <p className="text-2xl font-bold text-text">{stats.totalQuestions.toLocaleString()}</p>
                  <p className="text-xs text-accent mt-1">+23 this week</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-accent/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Correct Answers</p>
                  <p className="text-2xl font-bold text-text">{stats.correctAnswers}</p>
                  <p className="text-xs text-accent mt-1">80% accuracy</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-secondary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-text">{stats.averageScore}%</p>
                  <p className="text-xs text-secondary mt-1">+5% this month</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-accent/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Study Streak</p>
                  <p className="text-2xl font-bold text-text">{stats.streakDays} days</p>
                  <p className="text-xs text-accent mt-1">Keep it up! 🔥</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subject Progress - Enhanced */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text">Subject Progress</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                    className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                        {subject.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {subject.questionsAnswered}/{subject.totalQuestions} questions
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${subject.color} transition-all duration-500`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-text">{subject.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Progress this week: +{Math.floor(Math.random() * 10) + 1}%</span>
                      <Link
                        href={`/student/subject/${subject.name.toLowerCase()}`}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar Content */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-text mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text text-sm truncate">{activity.quiz}</h4>
                        <p className="text-xs text-gray-500">
                          {activity.subject} • {activity.questions} • {activity.date}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  ))}
                </div>
                <Link
                  href="/student/history"
                  className="block text-center text-primary hover:text-primary/80 text-sm font-medium mt-4 pt-4 border-t border-gray-100"
                >
                  View All Activity →
                </Link>
              </div>

              {/* Upcoming Tests */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-text mb-4">Upcoming Tests</h3>
                <div className="space-y-3">
                  {upcomingTests.map((test, index) => (
                    <div key={index} className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-text text-sm">{test.title}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            test.difficulty === "Hard"
                              ? "bg-red-100 text-red-600"
                              : test.difficulty === "Medium"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-accent/10 text-accent"
                          }`}
                        >
                          {test.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {test.subject} • {test.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-text mb-4">Achievements</h3>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        achievement.earned ? "bg-accent/5 border border-accent/20" : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${achievement.earned ? "text-text" : "text-gray-500"}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                      </div>
                      {achievement.earned && <CheckCircle className="w-4 h-4 text-accent" />}
                    </div>
                  ))}
                </div>
                <Link
                  href="/student/achievements"
                  className="block text-center text-primary hover:text-primary/80 text-sm font-medium mt-4 pt-4 border-t border-gray-100"
                >
                  View All Achievements →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
