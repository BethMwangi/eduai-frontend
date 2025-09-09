
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { userService } from "@/services/userService";
import type { PracticeSession, CompletedPracticeSession } from "@/types/auth";
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  ArrowLeft,
  Target,
  Award,
  Calendar,
  Brain,
  Trophy,
  Loader,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/dashboard/dashboard.layout";
import StudentSidebar from "@/components/dashboard/student-sidebar";
import {
  formatTimeSpent,
  formatLastAccessed,
  calculatePercentage,
} from "@/lib/utils";
import { getDifficultyColor, getScoreColor } from "@/utils/colorUtils";


export default function ContinuePractice() {
  const { getValidAccessToken } = useAuth();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<PracticeSession[]>([]);
  const [completedSessions, setCompletedSessions] = useState<
    CompletedPracticeSession[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPracticeData();
  }, []);

  const loadPracticeData = async () => { try {
      setLoading(true);
      setError(null);

      if (!getValidAccessToken) {
        throw new Error("Authentication required");
      }

      // Load both active and completed sessions in parallel
      const [activeData, completedData] = await Promise.all([
        userService.getActivePracticeSessions(getValidAccessToken),
        userService.getCompletedPracticeSessions(getValidAccessToken, 1), // First page
      ]);

      setActiveSessions(activeData || []);
      setCompletedSessions(completedData?.results || []);
    } catch (err) {
      console.error("Failed to load practice data:", err);
      setError("Failed to load practice sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadPracticeData();
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Helper functions for safe property access
  const getSubjectName = (session: PracticeSession): string => {
    if (typeof session.subject === 'string') {
      return session.subject;
    }
    return session.subject?.name || session.subject?.display_name || 'Unknown Subject';
  };

  const getCompletedQuestions = (session: PracticeSession): number => {
    return session.questions_completed || session.questions_completed || 0;
  };

  const getCurrentScore = (session: PracticeSession | CompletedPracticeSession): number => {
    return session.current_score || session.score || 0;
  };

  const getFinalScore = (session: CompletedPracticeSession): number => {
    return session.final_score || session.current_score || session.score || 0;
  };

  const getTimeSpent = (session: PracticeSession | CompletedPracticeSession): number => {
    return session.time_spent || session.time_spent_seconds || 0;
  };

  const getDifficulty = (session: PracticeSession | CompletedPracticeSession): string => {
    return session.difficulty || 'medium';
  };

  // Calculate stats from real data
  const stats = {
    totalActiveSessions: activeSessions.length,
    totalCompletedSessions: completedSessions.length,
    averageScore:
      completedSessions.length > 0
        ? Math.round(
            completedSessions.reduce(
              (sum, session) => sum + getCurrentScore(session),
              0
            ) / completedSessions.length
          )
        : 0,
    totalTimeSpent: formatTimeSpent(
      [...activeSessions, ...completedSessions].reduce(
        (sum, session) => sum + getTimeSpent(session),
        0
      )
    ),
    streakDays: 7,
  };

  const handleContinueSession = async (sessionId: number) => {
    try {
      // Navigate to the practice session
      window.location.href = `/student/practice/session/${sessionId}`;
    } catch (err) {
      console.error("Failed to continue session:", err);
    }
  };

  const handleStartNewSession = () => {
    window.location.href = "/student/question-pool";
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        {() => (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your practice sessions...</p>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        {() => (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refreshData} disabled={refreshing}>
                {refreshing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {(user) => (
        <div>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">
                Continue Practice
              </h1>
              <p className="text-gray-600">
                Pick up where you left off, {user.first_name}! Resume your
                incomplete practice sessions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refreshData}
                variant="outlined"
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              <Link
                href="/student/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="flex">
            {/* Student Sidebar */}
            <StudentSidebar
              user={user}
              activePage="practice"
              onViewChange={() => {}}
            />

            <div className="flex-1 p-6 bg-gray-50">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalActiveSessions}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          In progress
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalCompletedSessions}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Sessions done
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.averageScore}%
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          Overall performance
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Time Spent</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalTimeSpent}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Total practice time
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* In Progress Sessions */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-blue-600" />
                        Continue Practice Sessions ({activeSessions.length})
                      </CardTitle>
                      <CardDescription>
                        Resume your incomplete practice sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activeSessions.map((session) => {
                        const completedQuestions = getCompletedQuestions(session);
                        const progressPercentage = calculatePercentage(
                          completedQuestions,
                          session.total_questions
                        );

                        return (
                          <div
                            key={session.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() =>
                              setSelectedSession(session.id.toString())
                            }
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {session.topic}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {getSubjectName(session)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getDifficultyColor(
                                    getDifficulty(session)
                                  )}
                                >
                                  {getDifficulty(session)}
                                </Badge>
                                <Badge variant="outline">
                                  {completedQuestions}/{session.total_questions}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">
                                  {progressPercentage}%
                                </span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatTimeSpent(getTimeSpent(session))}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  <span
                                    className={getScoreColor(
                                      getCurrentScore(session)
                                    )}
                                  >
                                    {getCurrentScore(session)}%
                                  </span>
                                </span>
                              </div>
                              <span>
                                Last: {formatLastAccessed(session.last_accessed || session.lastAccessed || '')}
                              </span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <Button
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContinueSession(session.id);
                                }}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Continue Session
                              </Button>
                            </div>
                          </div>
                        );
                      })}

                      {activeSessions.length === 0 && (
                        <div className="text-center py-8">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No active sessions
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Start a new practice session to begin learning
                          </p>
                          <Button onClick={handleStartNewSession}>
                            <Play className="w-4 h-4 mr-2" />
                            Start New Session
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recently Completed */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Recently Completed ({stats.totalCompletedSessions})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {completedSessions.slice(0, 5).map((session) => {
                        const subjectName = typeof session.subject === 'string' 
                          ? session.subject 
                          : session.subject?.display_name || session.subject?.name || 'Unknown Subject';

                        return (
                          <div
                            key={session.id}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {session.topic}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {subjectName}
                                </p>
                              </div>
                              <Badge
                                className={getDifficultyColor(getDifficulty(session))}
                                variant="secondary"
                              >
                                {getDifficulty(session)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                {session.total_questions} questions
                              </span>
                              <span
                                className={`font-medium ${getScoreColor(
                                  getFinalScore(session)
                                )}`}
                              >
                                {getFinalScore(session)}%
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Completed {formatLastAccessed(session.completed_at || session.lastAccessed || '')}
                            </div>
                          </div>
                        );
                      })}

                      {completedSessions.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">
                            No completed sessions yet
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link href="/student/question-pool">
                        <Button
                          variant="outlined"
                          className="w-full justify-start"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Browse Question Pool
                        </Button>
                      </Link>
                      <Link href="/student/achievements">
                        <Button
                          variant="outlined"
                          className="w-full justify-start"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          View Achievements
                        </Button>
                      </Link>
                      <Link href="/student/history">
                        <Button
                          variant="outlined"
                          className="w-full justify-start"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Study History
                        </Button>
                      </Link>
                      <Link href="/student/schedule">
                        <Button
                          variant="outlined"
                          className="w-full justify-start"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Study Schedule
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Performance Tip */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-900 flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Performance Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-800">
                        {activeSessions.length > 0 ? (
                          <>
                            You have {activeSessions.length} active session
                            {activeSessions.length > 1 ? "s" : ""} waiting!
                            Complete them to maintain your learning momentum and
                            build consistency.
                          </>
                        ) : (
                          <>
                            Great job completing your sessions,{" "}
                            {user.first_name}! Start a new practice session to
                            continue building your knowledge and maintain your
                            learning streak.
                          </>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
