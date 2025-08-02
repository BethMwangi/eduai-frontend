"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, BookOpen, ArrowLeft } from "lucide-react";
import DashboardLayout from "./dashboard.layout";
import AddChildForm from "@/components/forms/AddChildForm";
import { userService } from "@/services/userService";
import { Student } from "@/types/auth";
import ChildDetailView from "./child-detail-view";
import ChildCard from "@/components/cards/ChildCard";
import ParentSidebar from "./parent-sidebar";
import { useAuth } from "@/context/auth";

export default function ParentDashboard() {
 const { getValidAccessToken, user: layoutUser, loading: authLoading } =
    useAuth();
  const [showAddChild, setShowAddChild] = useState(false);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student[]>([]);
  const [childDetail, setChildDetail] = useState<Student | null>(null);
  const [loadingChildDetail, setLoadingChildDetail] = useState(false);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  const fetchChildren = useCallback(async () => {
    if (!layoutUser) return; 
    setLoading(true);
    try {
      const list = await userService.getChildren(getValidAccessToken);
      setStudent(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to fetch children:", error);
      setStudent([]);
    } finally {
      setLoading(false);
    }
  }, [getValidAccessToken]);

  useEffect(() => {
    if (authLoading) return;
    if (!layoutUser) return;
    void fetchChildren();
  }, [fetchChildren, authLoading, layoutUser]);

  const handleViewChild = useCallback(
    async (childId: number) => {
      setSelectedChild(childId);
      setLoadingChildDetail(true);
      try {
        const detail = await userService.getChildDetail(
          getValidAccessToken,
          childId
        );
        setChildDetail(detail);
      } catch (error) {
        console.error("Failed to fetch child detail:", error);
        setChildDetail(null);
        setSelectedChild(null); // rollback selection on error
      } finally {
        setLoadingChildDetail(false);
      }
    },
    [getValidAccessToken]
  );

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
            <ParentSidebar user={layoutUser} activePage="dashboard" />

            {/* Main Content */}
            <div className="flex-1 p-6">
              {selectedChild ? (
                loadingChildDetail ? (
                  // show loader while fetching child detail
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : childDetail ? (
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
                      totalQuestions:
                        childDetail.total_questions_attempted,
                      correctAnswers:
                        childDetail.total_correct_answers,
                      averageScore:
                        childDetail.overall_average_score,
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
                ) : (
                  // selectedChild but failed to load detail
                  <div className="text-center py-12">
                    <p className="text-red-500">Failed to load child details.</p>
                    <button
                      className="mt-4 px-4 py-2 bg-primary text-white rounded"
                      onClick={() => {
                        if (selectedChild) handleViewChild(selectedChild);
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )
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
                      <p className="text-gray-500 text-lg">
                        No children found
                      </p>
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

                  {/* Recent Family Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
