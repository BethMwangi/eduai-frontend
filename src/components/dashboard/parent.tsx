"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  TrendingUp,
  BookOpen,
  Settings,
  Calendar,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import DashboardLayout from "./dashboard.layout";
import AddChildForm from "@/components/forms/AddChildForm";
import { userService } from "@/services/userService";
import { Student } from "@/types/auth";
import ChildDetailView from "./child-detail-view";
import ChildCard from "@/components/cards/ChildCard";
import FamilyProgressCard from "../cards/FamilyProgressCard";

export default function ParentDashboard() {
  const [showAddChild, setShowAddChild] = useState(false);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student[]>([]);
  const [childDetail, setChildDetail] = useState<Student | null>(null);
  const [loadingChildDetail, setLoadingChildDetail] = useState(false);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await userService.getChildren();
      setStudent(res.data || []);
    } catch (error) {
      console.error("Failed to fetch children:", error);
      setStudent([]);
      // Don't redirect here - let the auth interceptor handle it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleViewChild = async (childId: number) => {
    setLoadingChildDetail(true);
    try {
      const res = await userService.getChildDetail(childId);
      setChildDetail(res.data);
      setSelectedChild(childId);
    } catch (error) {
      console.error("Failed to fetch child detail:", error);
      setChildDetail(null);
    } finally {
      setLoadingChildDetail(false);
    }
  };
  const recentActivity = [
    {
      child: "Alex",
      subject: "Mathematics",
      quiz: "Algebra Basics",
      score: 92,
      date: "2 hours ago",
    },
    {
      child: "Emma",
      subject: "English",
      quiz: "Grammar Rules",
      score: 88,
      date: "4 hours ago",
    },
    {
      child: "Jake",
      subject: "Mathematics",
      quiz: "Addition & Subtraction",
      score: 95,
      date: "1 day ago",
    },
  ];

  return (
    <DashboardLayout>
      {(layoutUser) => (
        <div>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text">
                  {showAddChild
                    ? "Add New Child"
                    : selectedChild
                    ? childDetail?.full_name
                      ? `${childDetail.full_name} - Details`
                      : "Child Details"
                    : "Parent Dashboard"}
                </h1>
                <p className="text-gray-600">
                  {showAddChild
                    ? "Add a new child to monitor their learning progress"
                    : selectedChild
                    ? "Comprehensive view of your child's academic progress"
                    : "Monitor your children's learning progress"}
                </p>
              </div>

              {!showAddChild && !selectedChild && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  onClick={() => setShowAddChild(true)}
                >
                  <Plus className="w-5 h-5" />
                  Add Child
                </button>
              )}

              {(showAddChild || selectedChild) && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setSelectedChild(null);
                    setChildDetail(null);
                    setShowAddChild(false);
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {/* {layoutUser.avatar} */}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">
                      {layoutUser.first_name}
                    </h3>
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
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <Users className="w-5 h-5" />
                    My Children
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Progress Reports
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Study Schedule
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {selectedChild && childDetail ? (
                <ChildDetailView
                  child={{
                    id: childDetail.id,
                    name: childDetail.full_name,
                    firstName: childDetail.first_name,
                    lastName: childDetail.last_name,
                    age: childDetail.age,
                    grade: `${childDetail.grade} (${childDetail.grade_name})`,
                    school: childDetail.school_name,
                    avatar: `${childDetail.first_name[0]}${childDetail.last_name[0]}`,
                    totalQuestions: childDetail.total_questions_attempted,
                    correctAnswers: childDetail.total_correct_answers,
                    averageScore: childDetail.overall_average_score,
                    streakDays: childDetail.current_streak_days,
                    subjects: childDetail.total_subjects,
                    lastActive: childDetail.last_activity_date
                      ? new Date(
                          childDetail.last_activity_date
                        ).toLocaleDateString()
                      : "N/A",
                    dateOfBirth: childDetail.date_of_birth,
                    parentEmail: "",
                    email: childDetail.email,
                    weakSubjects: [],
                    strongSubjects: [],
                    recentTests: [],
                    monthlyProgress: [],
                    studyTime: { daily: 0, weekly: 0, monthly: 0 },
                    achievements: [],
                  }}
                  onBack={() => {
                    setSelectedChild(null);
                    setChildDetail(null);
                  }}
                />
              ) : showAddChild ? (
                <AddChildForm 
                  onBack={() => setShowAddChild(false)} 
                  onChildAdded={() => {
                    fetchChildren(); // Refresh the children list
                    setShowAddChild(false); // Close the form
                  }} 
                />
              ) : (
                <>
                  {/* Children Cards */}
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : student.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No children found</p>
                      <p className="text-gray-400 text-sm">
                        Click &quot;Add Child&quot; to get started
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {student.map((child) => (
                        <ChildCard
                          key={child.id}
                          child={child}
                          onViewDetail={handleViewChild}
                        />
                      ))}
                    </div>
                  )}

                  {/* Overview + Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Family Progress Overview */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-text mb-6">
                        Family Progress Overview
                      </h2>
                      <div className="space-y-6">
                        {student.map((child) => (
                          <FamilyProgressCard key={child.id} child={child} />
                        ))}
                      </div>
                    </div>

                    {/* Recent Family Activity */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-text mb-6">
                        Recent Family Activity
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
