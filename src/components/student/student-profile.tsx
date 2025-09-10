"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Edit,
  User,
  Mail,
  Calendar,
  School,
  Target,
  Trophy,
  BookOpen,
  Clock,
  Settings,
} from "lucide-react";
import { userService } from "@/services/userService";

import { useAuth } from "@/context/auth";
import type { Student } from "@/types/auth";
import DashboardLayout from "../dashboard/dashboard-layout";
import StudentSidebar from "../dashboard/student-sidebar";

export default function StudentProfile() {
  const { getValidAccessToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const data = await userService.getProfile(getValidAccessToken);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [getValidAccessToken]);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save updated profileData to backend
  };

  const stats = {
    totalQuestions: 1105,
    correctAnswers: 887,
    averageScore: 80,
    streakDays: 12,
    studyHours: 45.5,
    rank: 8,
    totalStudents: 156,
  };

  const achievements = [
    {
      title: "Math Wizard",
      description: "Completed 50 math questions",
      icon: "🧮",
      earned: true,
      date: "Dec 1, 2024",
    },
    {
      title: "Speed Demon",
      description: "Finished test in under 30 mins",
      icon: "⚡",
      earned: true,
      date: "Nov 28, 2024",
    },
    {
      title: "Perfect Score",
      description: "Got 100% on a test",
      icon: "🎯",
      earned: false,
      date: null,
    },
    {
      title: "Study Streak",
      description: "7 days in a row",
      icon: "🔥",
      earned: true,
      date: "Nov 25, 2024",
    },
    {
      title: "Subject Master",
      description: "90% average in Chemistry",
      icon: "🧪",
      earned: true,
      date: "Nov 20, 2024",
    },
    {
      title: "Consistent Learner",
      description: "Study 5 days a week",
      icon: "📚",
      earned: true,
      date: "Nov 15, 2024",
    },
  ];

  const recentActivity = [
    {
      subject: "Mathematics",
      quiz: "Linear Algebra Basics",
      score: 92,
      date: "2 hours ago",
      questions: 25,
    },
    {
      subject: "Physics",
      quiz: "Motion & Forces",
      score: 78,
      date: "1 day ago",
      questions: 30,
    },
    {
      subject: "Chemistry",
      quiz: "Periodic Table",
      score: 95,
      date: "2 days ago",
      questions: 20,
    },
    {
      subject: "Biology",
      quiz: "Cell Structure",
      score: 88,
      date: "3 days ago",
      questions: 15,
    },
    {
      subject: "English",
      quiz: "Grammar Essentials",
      score: 85,
      date: "4 days ago",
      questions: 40,
    },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!profileData) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load profile.
      </div>
    );
  }

  return (
    <DashboardLayout>
      {(layoutUser) => (
        <div>
    

          {/* Shell with sidebar + content (same structure as dashboard) */}
          <div className="flex">
            <StudentSidebar user={layoutUser} activePage="profile" />

            <div className="flex-1 p-6 bg-gray-50">
              {/* Profile Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-text">
                        Basic Information
                      </h2>
                      <button
                        onClick={() =>
                          isEditing ? handleSave() : setIsEditing(true)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        {isEditing ? "Save Changes" : "Edit Profile"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.first_name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                first_name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-text">
                              {profileData.first_name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.last_name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                last_name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-text">
                              {profileData.last_name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-text">{profileData.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={profileData.date_of_birth}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                date_of_birth: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-text">
                              {new Date(
                                profileData.date_of_birth
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <School className="w-4 h-4 text-gray-500" />
                          <span className="text-text">{profileData.grade}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.school_name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                school_name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <School className="w-4 h-4 text-gray-500" />
                            <span className="text-text">
                              {profileData.school_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Academic Performance */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-text mb-6">
                      Academic Performance
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text">
                          {stats.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600">
                          Questions Solved
                        </div>
                      </div>
                      <div className="text-center p-4 bg-accent/5 rounded-lg">
                        <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text">
                          {stats.averageScore}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Average Score
                        </div>
                      </div>
                      <div className="text-center p-4 bg-secondary/5 rounded-lg">
                        <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text">
                          {stats.studyHours}h
                        </div>
                        <div className="text-sm text-gray-600">Study Hours</div>
                      </div>
                      <div className="text-center p-4 bg-accent/5 rounded-lg">
                        <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text">
                          #{stats.rank}
                        </div>
                        <div className="text-sm text-gray-600">Class Rank</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-text mb-6">
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-text">
                              {activity.quiz}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {activity.subject} • {activity.questions}{" "}
                              questions • {activity.date}
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
                  {/* Achievements */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">
                      Recent Achievements
                    </h3>
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
                              <h4 className="font-medium text-text text-sm">
                                {achievement.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {achievement.date}
                              </p>
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
                    <h3 className="text-lg font-semibold text-text mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Link
                        href="/student/question-pool"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-text">
                          Browse Questions
                        </span>
                      </Link>
                      <Link
                        href="/student/achievements"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Trophy className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-medium text-text">
                          View Achievements
                        </span>
                      </Link>
                      <Link
                        href="/student/settings"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium text-text">
                          Account Settings
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
