"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Calendar,
  School,
  Target,
  Trophy,
  BookOpen,
  Clock,
  Star,
  Settings,
} from "lucide-react"
import DashboardLayout from "../dashboard/dashboard.layout"

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Alex",
    lastName: "Smith",
    email: "alex.smith@email.com",
    dateOfBirth: "2008-03-15",
    grade: "Grade 10",
    school: "Riverside High School",
    parentEmail: "parent@email.com",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    learningGoals: "Improve in Mathematics and Physics, prepare for university entrance exams",
  })

  const user = {
    name: "Alex Smith",
    email: "alex.smith@email.com",
    role: "student",
    avatar: "AS",
  }

  const stats = {
    totalQuestions: 1105,
    correctAnswers: 887,
    averageScore: 80,
    streakDays: 12,
    studyHours: 45.5,
    rank: 8,
    totalStudents: 156,
  }

  const achievements = [
    { title: "Math Wizard", description: "Completed 50 math questions", icon: "🧮", earned: true, date: "Dec 1, 2024" },
    {
      title: "Speed Demon",
      description: "Finished test in under 30 mins",
      icon: "⚡",
      earned: true,
      date: "Nov 28, 2024",
    },
    { title: "Perfect Score", description: "Got 100% on a test", icon: "🎯", earned: false, date: null },
    { title: "Study Streak", description: "7 days in a row", icon: "🔥", earned: true, date: "Nov 25, 2024" },
    {
      title: "Subject Master",
      description: "90% average in Chemistry",
      icon: "🧪",
      earned: true,
      date: "Nov 20, 2024",
    },
    { title: "Consistent Learner", description: "Study 5 days a week", icon: "📚", earned: true, date: "Nov 15, 2024" },
  ]

  const recentActivity = [
    { subject: "Mathematics", quiz: "Linear Algebra Basics", score: 92, date: "2 hours ago", questions: 25 },
    { subject: "Physics", quiz: "Motion & Forces", score: 78, date: "1 day ago", questions: 30 },
    { subject: "Chemistry", quiz: "Periodic Table", score: 95, date: "2 days ago", questions: 20 },
    { subject: "Biology", quiz: "Cell Structure", score: 88, date: "3 days ago", questions: 15 },
    { subject: "English", quiz: "Grammar Essentials", score: 85, date: "4 days ago", questions: 40 },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
    console.log("Saving profile data:", profileData)
  }

  return (
    <DashboardLayout user={user}>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/student"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-text">Student Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text">Basic Information</h2>
                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-text">{profileData.firstName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-text">{profileData.lastName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-text">{profileData.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-text">{new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <School className="w-4 h-4 text-gray-500" />
                    <span className="text-text">{profileData.grade}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.school}
                      onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <School className="w-4 h-4 text-gray-500" />
                      <span className="text-text">{profileData.school}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
                {isEditing ? (
                  <textarea
                    value={profileData.learningGoals}
                    onChange={(e) => setProfileData({ ...profileData, learningGoals: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <Target className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-text">{profileData.learningGoals}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Performance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-6">Academic Performance</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text">{stats.totalQuestions}</div>
                  <div className="text-sm text-gray-600">Questions Solved</div>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text">{stats.averageScore}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text">{stats.studyHours}h</div>
                  <div className="text-sm text-gray-600">Study Hours</div>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text">#{stats.rank}</div>
                  <div className="text-sm text-gray-600">Class Rank</div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-text">Class Performance</span>
                </div>
                <p className="text-sm text-gray-600">
                  You're ranked #{stats.rank} out of {stats.totalStudents} students in your grade. Keep up the excellent
                  work!
                </p>
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
                        {activity.subject} • {activity.questions} questions • {activity.date}
                      </p>
                    </div>
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
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">{user.avatar}</span>
              </div>
              <h3 className="font-semibold text-text mb-1">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {profileData.grade} • {profileData.school}
              </p>
              <button className="w-full px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                Change Photo
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements
                  .filter((a) => a.earned)
                  .slice(0, 4)
                  .map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg"
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      </div>
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

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/student/question-pool"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-text">Browse Questions</span>
                </Link>
                <Link
                  href="/student/achievements"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Trophy className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium text-text">View Achievements</span>
                </Link>
                <Link
                  href="/student/settings"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-text">Account Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
