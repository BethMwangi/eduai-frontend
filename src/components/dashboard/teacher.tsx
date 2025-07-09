"use client"

// import { useState } from "react"
import Link from "next/link"
import { Upload, BookOpen, Users, FileText, Plus, Settings, BarChart3, CheckCircle, Edit } from "lucide-react"
import DashboardLayout from "./dashboard.layout"

export default function TeacherDashboard() {
//   const [activeTab, setActiveTab] = useState("overview")

  // Mock user data - in real app, this would come from authentication
  const user = {
    name: "Ms. Johnson",
    email: "m.johnson@school.edu",
    role: "teacher",
    avatar: "MJ",
  }

  const stats = {
    totalExams: 24,
    totalQuestions: 486,
    studentsEnrolled: 156,
    averageScore: 78,
  }

  const recentExams = [
    {
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      questions: 25,
      students: 32,
      avgScore: 82,
      created: "2 days ago",
      status: "active",
    },
    {
      title: "Chemical Bonding",
      subject: "Chemistry",
      questions: 30,
      students: 28,
      avgScore: 75,
      created: "1 week ago",
      status: "active",
    },
    {
      title: "World War II",
      subject: "History",
      questions: 20,
      students: 45,
      avgScore: 88,
      created: "2 weeks ago",
      status: "completed",
    },
  ]

  const subjects = [
    { name: "Mathematics", exams: 8, students: 45, color: "bg-primary" },
    { name: "Chemistry", exams: 6, students: 38, color: "bg-accent" },
    { name: "Physics", exams: 5, students: 42, color: "bg-secondary" },
    { name: "History", exams: 5, students: 31, color: "bg-primary" },
  ]

  return (
    <DashboardLayout user={user}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your exams and track student progress</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
              <Upload className="w-5 h-5" />
              Upload Exam
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-5 h-5" />
              Create Quiz
            </button>
          </div>
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
                <p className="text-sm text-gray-500">Mathematics Teacher</p>
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
                <FileText className="w-5 h-5" />
                My Exams
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Upload className="w-5 h-5" />
                Upload Content
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users className="w-5 h-5" />
                Students
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5" />
                Subjects
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Exams</p>
                  <p className="text-2xl font-bold text-text">{stats.totalExams}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Questions</p>
                  <p className="text-2xl font-bold text-text">{stats.totalQuestions}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Students</p>
                  <p className="text-2xl font-bold text-text">{stats.studentsEnrolled}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Avg Score</p>
                  <p className="text-2xl font-bold text-text">{stats.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Exams */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text">Recent Exams</h2>
                <Link href="#" className="text-primary hover:text-primary/80 text-sm font-medium">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentExams.map((exam, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-text">{exam.title}</h3>
                          <p className="text-sm text-gray-500">{exam.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exam.status === "active" ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {exam.status}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-text">{exam.questions}</p>
                        <p className="text-gray-500">Questions</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-text">{exam.students}</p>
                        <p className="text-gray-500">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-accent">{exam.avgScore}%</p>
                        <p className="text-gray-500">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-600">{exam.created}</p>
                        <p className="text-gray-500">Created</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-6">Subject Overview</h2>

              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-text">{subject.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-text">{subject.exams}</p>
                        <p className="text-gray-500">Exams</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-text">{subject.students}</p>
                        <p className="text-gray-500">Students</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-5 h-5 mx-auto mb-1" />
                Add New Subject
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
