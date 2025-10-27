"use client"

import { useState } from "react"
import {
  TrendingUp,
  BookOpen,
  Clock,
  Award,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  User,
  School,
  Mail,
} from "lucide-react"

interface Child {
  id: number
  name: string
  firstName: string
  lastName: string
  age: number
  grade: string
  school: string
  avatar: string
  totalQuestions: number
  correctAnswers: number
  averageScore: number
  streakDays: number
  subjects: number
  lastActive: string
  dateOfBirth: string
  parentEmail: string
  email: string
  weakSubjects: string[]
  strongSubjects: string[]
  recentTests: Array<{
    subject: string
    title: string
    score: number
    date: string
    questions: number
  }>
  monthlyProgress: Array<{
    month: string
    score: number
  }>
  studyTime: {
    daily: number
    weekly: number
    monthly: number
  }
  achievements: Array<{
    title: string
    description: string
    date: string
    icon: string
  }>
}

interface ChildDetailViewProps {
  child: Child
  onBack?: () => void
}

export default function ChildDetailView({ child }: ChildDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "tests", label: "Recent Tests", icon: BookOpen },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "profile", label: "Profile", icon: User },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-accent"
    if (score >= 70) return "text-secondary"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-accent/10"
    if (score >= 70) return "bg-secondary/10"
    return "bg-red-100"
  }

  return (
    <div className="space-y-6">
      {/* Child Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">{child.avatar}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text mb-2">{child.name}</h2>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <School className="w-4 h-4" />
                {child.grade} • {child.school}
              </span>
              <span>Age {child.age}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last active: {child.lastActive}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-text">{child.averageScore}%</div>
            <div className="text-sm text-gray-500">Overall Average</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Questions Solved</p>
              <p className="text-2xl font-bold text-text">{child.totalQuestions}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Study Streak</p>
              <p className="text-2xl font-bold text-text">{child.streakDays} days</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Daily Study Time</p>
              <p className="text-2xl font-bold text-text">{child.studyTime.daily}h</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Achievements</p>
              <p className="text-2xl font-bold text-text">{child.achievements.length}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Subject Performance */}
              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Subject Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-text mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Strong Subjects
                    </h4>
                    <div className="space-y-2">
                      {child.strongSubjects.map((subject) => (
                        <div key={subject} className="flex items-center gap-2 p-2 bg-accent/5 rounded-lg">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span className="text-sm text-gray-700">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-text mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-secondary" />
                      Needs Improvement
                    </h4>
                    <div className="space-y-2">
                      {child.weakSubjects.map((subject) => (
                        <div key={subject} className="flex items-center gap-2 p-2 bg-secondary/5 rounded-lg">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm text-gray-700">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Progress Chart */}
              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Monthly Progress</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-end justify-between h-32 gap-4">
                    {child.monthlyProgress.map((month) => (
                      <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className="bg-primary rounded-t w-full transition-all duration-500"
                          style={{ height: `${(month.score / 100) * 100}%`, minHeight: "20px" }}
                        ></div>
                        <span className="text-xs text-gray-600">{month.month}</span>
                        <span className="text-xs font-medium text-text">{month.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-text">{child.studyTime.daily}h</div>
                  <div className="text-sm text-gray-600">Daily Average</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-text">{child.studyTime.weekly}h</div>
                  <div className="text-sm text-gray-600">Weekly Total</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-text">{child.studyTime.monthly}h</div>
                  <div className="text-sm text-gray-600">Monthly Total</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-text">Accuracy Rate</span>
                    <span className="text-lg font-bold text-accent">
                      {Math.round((child.correctAnswers / child.totalQuestions) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-text">Questions per Day</span>
                    <span className="text-lg font-bold text-primary">{Math.round(child.totalQuestions / 30)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-text">Current Streak</span>
                    <span className="text-lg font-bold text-secondary">{child.streakDays} days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tests" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text">Recent Test Results</h3>
              {child.recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">{test.title}</h4>
                      <p className="text-sm text-gray-500">
                        {test.subject} • {test.questions} questions • {test.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(test.score)}`}>{test.score}%</div>
                    <div className={`px-2 py-1 rounded text-xs ${getScoreBg(test.score)} ${getScoreColor(test.score)}`}>
                      {test.score >= 90 ? "Excellent" : test.score >= 70 ? "Good" : "Needs Work"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {child.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-lg"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-text">{child.name}</div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4" />
                      Child Email
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-text">{child.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-text">{child.age} years old</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-text">{child.grade}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-text">{child.school}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-text">
                      {new Date(child.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-text">{child.parentEmail}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
