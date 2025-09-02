"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  Award,
  Target,
  Filter,
  CheckCircle,
  Play,
  ArrowLeft,
  Loader
} from "lucide-react";
import DashboardLayout from "./dashboard.layout";
import QuestionPool from "../student/question-pool";
import { IconComponentCard } from "../cards/IconComponentCard";
import StudentSidebar from "./student-sidebar";
import { SubjectProgressData } from "@/types/auth";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/auth";

export default function StudentDashboard() {
  const { getValidAccessToken } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [view, setView] = useState<"dashboard" | "question-pool">("dashboard");
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgressData[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    averageScore: 0,
    streakDays: 0,
  });


  const loadStudentData = useCallback(async () => {
    if (!getValidAccessToken) return;
    
    setLoading(true);
    try {
      // Load student stats by subject
      const statsData = await userService.getStudentStatsBySubject(getValidAccessToken);
      
      // Calculate overall stats
      const totalAttempts = statsData.reduce((sum, subject) => sum + subject.total_attempts, 0);
      const totalCorrect = statsData.reduce((sum, subject) => sum + subject.correct_attempts, 0);
      const averageAccuracy = statsData.length > 0 
        ? Math.round(statsData.reduce((sum, subject) => sum + subject.accuracy, 0) / statsData.length)
        : 0;

      setStats({
        totalQuestions: totalAttempts,
        correctAnswers: totalCorrect,
        averageScore: averageAccuracy,
        streakDays: 12, // This would come from student profile
      });

      // Transform and set subject progress
      const transformedProgress = statsData.map(subject => ({
        ...subject,
        progress_percentage: Math.round(subject.accuracy),
      }));

      setSubjectProgress(transformedProgress);
    } catch (error) {
      console.error("Failed to load student data:", error);
    } finally {
      setLoading(false);
    }
  }, [getValidAccessToken]);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);



  const getSubjectColor = (index: number): string => {
    const colors = ["bg-primary", "bg-accent", "bg-secondary", "bg-purple-500", "bg-indigo-500"];
    return colors[index % colors.length];
  };

  const formatLastActivity = (dateString: string | null): string => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };


  const quickActions = [
    {
      title: "Browse Question Pool",
      description: "Access all available question papers for Grade 10",
      icon: BookOpen,
      onClick: () => setView("question-pool"),
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
  ];


  // const subjects = [
  //   {
  //     name: "Mathematics",
  //     progress: 85,
  //     questionsAnswered: 245,
  //     color: "bg-primary",
  //     totalQuestions: 300,
  //   },
  //   {
  //     name: "Physics",
  //     progress: 72,
  //     questionsAnswered: 189,
  //     color: "bg-accent",
  //     totalQuestions: 250,
  //   },
  //   {
  //     name: "Chemistry",
  //     progress: 91,
  //     questionsAnswered: 312,
  //     color: "bg-secondary",
  //     totalQuestions: 350,
  //   },
  //   {
  //     name: "Biology",
  //     progress: 68,
  //     questionsAnswered: 156,
  //     color: "bg-primary",
  //     totalQuestions: 200,
  //   },
  //   {
  //     name: "English",
  //     progress: 79,
  //     questionsAnswered: 203,
  //     color: "bg-accent",
  //     totalQuestions: 280,
  //   },
  // ];

  const upcomingTests = [
    {
      subject: "Mathematics",
      title: "Calculus Final",
      date: "Tomorrow",
      difficulty: "Hard",
    },
    {
      subject: "Physics",
      title: "Mechanics Quiz",
      date: "Dec 15",
      difficulty: "Medium",
    },
    {
      subject: "Chemistry",
      title: "Organic Chemistry",
      date: "Dec 18",
      difficulty: "Hard",
    },
  ];

  const achievements = [
    {
      title: "Math Wizard",
      description: "Completed 50 math questions",
      icon: "🧮",
      earned: true,
    },
    {
      title: "Speed Demon",
      description: "Finished test in under 30 mins",
      icon: "⚡",
      earned: true,
    },
    {
      title: "Perfect Score",
      description: "Got 100% on a test",
      icon: "🎯",
      earned: false,
    },
    {
      title: "Study Streak",
      description: "7 days in a row",
      icon: "🔥",
      earned: true,
    },
  ];

  return (
    <DashboardLayout>
      {(layoutUser) => (
        <div>
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">
                {view === "question-pool"
                  ? "Question Pool"
                  : "Student Dashboard"}
              </h1>
              <p className="text-gray-600">
                {view === "question-pool"
                  ? "Browse and attempt question papers by subject"
                  : `Welcome back, ${layoutUser.first_name}!`}
              </p>
            </div>
            {view === "question-pool" && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                onClick={() => setView("dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            )}
          </div>

          <div className="flex">
            <StudentSidebar
              user={layoutUser}
              activePage={
                view === "question-pool" ? "question-pool" : "dashboard"
              }
              onViewChange={(v) => setView(v)}
            />

            <div className="flex-1 p-6 bg-gray-50">
              {view === "question-pool" ? (
                <QuestionPool />
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-text">
                        Quick Actions
                      </h2>
                      <button
                        onClick={() => setView("question-pool")}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {quickActions.map((action) => {
                        const IconComponent = action.icon;
                        return action.href ? (
                          <Link
                            key={action.title}
                            href={action.href}
                            className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <IconComponentCard
                              action={action}
                              IconComponent={IconComponent}
                            />
                          </Link>
                        ) : (
                          <button
                            key={action.title}
                            onClick={action.onClick}
                            className="group w-full text-left bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <IconComponentCard
                              action={action}
                              IconComponent={IconComponent}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats Cards - Enhanced */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">
                            Total Questions
                          </p>
                          <p className="text-2xl font-bold text-text">
                            {stats.totalQuestions.toLocaleString()}
                          </p>
                          <p className="text-xs text-accent mt-1">
                            Attempted so far
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>

                   
                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-accent/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">
                            Correct Answers
                          </p>
                          <p className="text-2xl font-bold text-text">
                            {loading ? (
                              <Loader className="w-6 h-6 animate-spin" />
                            ) : (
                              stats.correctAnswers
                            )}
                          </p>
                          <p className="text-xs text-accent mt-1">
                            {stats.totalQuestions > 0
                              ? `${Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}% accuracy`
                              : "Start practicing!"}
                          </p>
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
                          <p className="text-2xl font-bold text-text">
                            {loading ? (
                              <Loader className="w-6 h-6 animate-spin" />
                            ) : (
                              `${stats.averageScore}%`
                            )}
                          </p>
                          <p className="text-xs text-secondary mt-1">
                            Across all subjects
                          </p>
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
                          <p className="text-2xl font-bold text-text">
                            {stats.streakDays} days
                          </p>
                          <p className="text-xs text-accent mt-1">
                            Keep it up! 🔥
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Subject Progress - Real Data */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-text">
                          Subject Progress
                        </h2>
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-gray-400" />
                          <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          >
                            <option value="all">All Subjects</option>
                            {subjectProgress.map((subject) => (
                              <option key={subject.subject_id} value={subject.subject_name}>
                                {subject.subject_display_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader className="w-8 h-8 animate-spin text-primary" />
                          <span className="ml-2 text-gray-600">Loading your progress...</span>
                        </div>
                      ) : subjectProgress.length === 0 ? (
                        <div className="text-center py-8">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Progress Yet
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Start practicing questions to see your subject progress
                          </p>
                          <button
                            onClick={() => setView("question-pool")}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                          >
                            Browse Questions
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {subjectProgress
                            .filter((subject) => 
                              selectedSubject === "all" || subject.subject_name === selectedSubject
                            )
                            .map((subject, index) => (
                            <div
                              key={subject.subject_id}
                              className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                                  {subject.subject_display_name}
                                </h3>
                                <span className="text-sm text-gray-500">
                                  {subject.correct_attempts}/{subject.total_attempts} correct
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                  <div
                                    className={`h-3 rounded-full ${getSubjectColor(index)} transition-all duration-500`}
                                    style={{ width: `${subject.progress_percentage || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold text-text">
                                  {subject.progress_percentage || 0}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                  Last activity: {formatLastActivity(subject.last_activity)}
                                </span>
                                <Link
                                  href={`/student/subject/${subject.subject_id}`}
                                  className="text-primary hover:text-primary/80 font-medium"
                                >
                                  View Details →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Sidebar Content */}
                    <div className="space-y-6">
                      {/* Recent Activity */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-text mb-4">
                          Recent Activity
                        </h3>
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
                                <h4 className="font-medium text-text text-sm truncate">
                                  {activity.quiz}
                                </h4>
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
                        <h3 className="text-lg font-semibold text-text mb-4">
                          Upcoming Tests
                        </h3>
                        <div className="space-y-3">
                          {upcomingTests.map((test, index) => (
                            <div
                              key={index}
                              className="p-3 border border-gray-100 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-text text-sm">
                                  {test.title}
                                </h4>
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
                        <h3 className="text-lg font-semibold text-text mb-4">
                          Achievements
                        </h3>
                        <div className="space-y-3">
                          {achievements.slice(0, 3).map((achievement, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                achievement.earned
                                  ? "bg-accent/5 border border-accent/20"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <span className="text-lg">{achievement.icon}</span>
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-medium text-sm ${
                                    achievement.earned ? "text-text" : "text-gray-500"
                                  }`}
                                >
                                  {achievement.title}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">
                                  {achievement.description}
                                </p>
                              </div>
                              {achievement.earned && (
                                <CheckCircle className="w-4 h-4 text-accent" />
                              )}
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}