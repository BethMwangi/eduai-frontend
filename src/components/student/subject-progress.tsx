"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  ArrowLeft,
  Play,
  BarChart3,
  Search,
  Loader,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDifficultyColor, getScoreColor } from "@/utils/colorUtils";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import StudentSidebar from "@/components/dashboard/dashboard-navbar";
import { useAuth } from "@/context/auth";
import { userService } from "@/services/userService";
import type { Subject, SubjectProgress, TopicProgress } from "@/types/auth";

interface SubjectProgressProps {
  subject: string;
}

function SubjectProgressContent({ subject }: SubjectProgressProps) {
  const { getValidAccessToken } = useAuth();
  const {
    studentProfile,
    loading: profileLoading,
    error: profileError,
  } = useStudentProfile(); // Add this line

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectData, setSubjectData] = useState<Subject | null>(null);
  const [subjectProgress, setSubjectProgress] =
    useState<SubjectProgress | null>(null);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName.toLowerCase();
    if (name.includes("math")) return "🧮";
    if (name.includes("physics")) return "⚛️";
    if (name.includes("chemistry")) return "🧪";
    if (name.includes("biology")) return "🧬";
    if (name.includes("english")) return "📚";
    if (name.includes("history")) return "📜";
    if (name.includes("geography")) return "🌍";
    if (name.includes("science")) return "🔬";
    if (name.includes("social")) return "🏛️";
    return "📖";
  };

  useEffect(() => {
    const fetchData = async () => {
      // Wait for profile to load first
      if (profileLoading) return;

      if (profileError || !studentProfile || !getValidAccessToken) {
        setError(profileError || "Authentication required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const gradeId = studentProfile.grade;
        console.log("🎓 Student grade ID:", gradeId);
        console.log("👤 Student profile:", studentProfile);

        // Get subjects list filtered by student's grade
        const subjects = gradeId
          ? await userService.getSubjectsList(getValidAccessToken, gradeId)
          : await userService.getSubjectsList(getValidAccessToken);

        console.log("📚 Available subjects:", subjects);

        // Find the subject by name
        const foundSubject = subjects.find(
          (s: Subject) =>
            s.name.toLowerCase() === subject.toLowerCase() ||
            s.display_name?.toLowerCase() === subject.toLowerCase()
        );

        if (!foundSubject) {
          console.error(`❌ Subject "${subject}" not found`);
          const gradeName =
            studentProfile.grade?.display_name ||
            studentProfile.grade?.name ||
            gradeId;
          setError(`Subject "${subject}" not found for Grade ${gradeName}`);
          return;
        }

        console.log("✅ Found subject:", foundSubject);
        setSubjectData(foundSubject);

        // Now get the subject progress and topic progress
        console.log(`🔍 Fetching progress for subject ID: ${foundSubject.id}`);

        try {
          const progressData = await userService.getSubjectProgress(
            getValidAccessToken,
            foundSubject.id
          );

          console.log("✅ Progress data:", progressData);

          setSubjectProgress(progressData.subject_progress);
          setTopicProgress(progressData.topic_progress || []);
        } catch (progressError: any) {
          console.warn(
            "⚠️ Progress API failed, creating fallback data:",
            progressError
          );

          // Create fallback progress data
          const fallbackSubjectProgress: SubjectProgress = {
            id: foundSubject.id,
            subject: {
              id: foundSubject.id,
              name: foundSubject.name,
              display_name: foundSubject.display_name || foundSubject.name,
            },
            total_questions_available: 50,
            total_questions_attempted: 0,
            total_questions_correct: 0,
            accuracy_percentage: 0,
            last_attempt_date: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setSubjectProgress(fallbackSubjectProgress);
          setTopicProgress([]);
        }
      } catch (err: any) {
        console.error("❌ Failed to fetch subject data:", err);
        setError(`Failed to load subject data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    studentProfile,
    profileLoading,
    profileError,
    getValidAccessToken,
    subject,
  ]); // Updated dependencies

  const formatLastActivity = (dateString: string | null): string => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredTopics = topicProgress.filter((topic) => {
    const topicName = topic.topic_name || topic.topic || "";
    const matchesSearch = topicName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTopic =
      selectedTopic === "all" ||
      topicName.toLowerCase() === selectedTopic.toLowerCase();
    return matchesSearch && matchesTopic;
  });
  if (profileLoading || loading) {
    return (
      <DashboardLayout>
        {(user) => (
          <div className="flex">
            <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">
                  {profileLoading
                    ? "Loading student profile..."
                    : "Loading subject progress..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

if (error || profileError) {
  return (
    <DashboardLayout>
      {(user) => (
        <div className="flex">
          <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to Load Subject
              </h3>
              <p className="text-gray-600 mb-4">{error || profileError}</p>
              <Link href="/student/dashboard">
                <Button variant="outlined">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

  return (
    <DashboardLayout>
      {(user) => (
        <div className="flex">
          <StudentSidebar user={user} activePage="dashboard" />
          <div className="flex-1 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Link
                      href="/student/dashboard"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Dashboard
                    </Link>
                    <div className="h-6 w-px bg-gray-300" />
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {getSubjectIcon(
                          subjectData?.display_name || subjectName
                        )}
                      </span>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {subjectData?.display_name || subjectName}
                        </h1>
                        <p className="text-gray-600">
                          Track your progress and master topics
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm">
                      {/* {subjectProgress?.completion_percentage || 0}% Complete */}
                    </Badge>
                    <Link
                      href={`/student/question-pool?subject_id=${subjectData?.id}`}
                    >
                      <Button>
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Subject Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Questions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {subjectProgress?.total_questions_available || 0}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {subjectProgress?.total_questions_attempted || 0}{" "}
                          attempted
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(
                            subjectProgress?.accuracy_percentage || 0
                          )}
                          %
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {subjectProgress?.total_questions_correct || 0}{" "}
                          correct answers
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600" />
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
                          {/* Since time_spent_minutes doesn't exist in your interface, we'll show a placeholder */}
                          --
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Coming soon
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {/* Calculate progress percentage */}
                          {subjectProgress?.total_questions_available
                            ? Math.round(
                                (subjectProgress.total_questions_attempted /
                                  subjectProgress.total_questions_available) *
                                  100
                              )
                            : 0}
                          %
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          {formatLastActivity(
                            subjectProgress?.last_attempt_date || null
                          )}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Progress */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Overall Progress
                  </CardTitle>
                  <CardDescription>
                    {(subjectProgress?.total_questions_available || 0) -
                      (subjectProgress?.total_questions_attempted || 0)}{" "}
                    questions remaining
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Attempted</span>
                      <span>
                        {subjectProgress?.total_questions_attempted || 0} /{" "}
                        {subjectProgress?.total_questions_available || 0}
                      </span>
                    </div>
                    <Progress
                      value={
                        subjectProgress?.total_questions_available
                          ? (subjectProgress.total_questions_attempted /
                              subjectProgress.total_questions_available) *
                            100
                          : 0
                      }
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Topics Section */}
              {topicProgress.length > 0 && (
                <>
                  {/* Filters and Search */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search topics..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select
                      value={selectedTopic}
                      onValueChange={setSelectedTopic}
                    >
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        {topicProgress.map((topic, index) => (
                          <SelectItem key={index} value={topic.topic_name}>
                            {topic.topic_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTopics.map((topic, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {topic.topic_name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {topic.questions_attempted}/
                                {topic.total_questions} questions attempted
                              </CardDescription>
                            </div>
                            <Badge
                              className={getDifficultyColor(
                                topic.difficulty || "Medium"
                              )}
                            >
                              {topic.difficulty || "Medium"}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">
                                {Math.round(topic.completion_percentage || 0)}%
                              </span>
                            </div>
                            <Progress
                              value={topic.completion_percentage || 0}
                              className="h-2"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Accuracy</p>
                              <p
                                className={`font-semibold ${getScoreColor(
                                  topic.accuracy_percentage || 0
                                )}`}
                              >
                                {Math.round(topic.accuracy_percentage || 0)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Correct</p>
                              <p className="font-semibold text-gray-900">
                                {topic.questions_correct || 0}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 border-t pt-3">
                            Last studied:{" "}
                            {formatLastActivity(topic.last_activity)}
                          </div>

                          <Link
                            href={`/student/question-pool?subject_id=${
                              subjectData?.id
                            }&topic=${encodeURIComponent(topic.topic_name)}`}
                            className="w-full"
                          >
                            <Button className="w-full" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              {topic.completion_percentage === 100
                                ? "Review"
                                : topic.questions_attempted > 0
                                ? "Continue"
                                : "Start"}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* No Topics State */}
              {topicProgress.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Topic Progress Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start practicing questions to see topic-specific progress
                  </p>
                  <Link
                    href={`/student/question-pool?subject_id=${subjectData?.id}`}
                  >
                    <Button>
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </Link>
                </div>
              )}

              {filteredTopics.length === 0 && topicProgress.length > 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No topics found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function SubjectProgress({ subject }: SubjectProgressProps) {
  return <SubjectProgressContent subject={subject} />;
}
