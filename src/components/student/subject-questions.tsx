"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Play,
  Target,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  BarChart3,
  Brain,
} from "lucide-react";

import { useAuth } from "@/context/auth";
import { userService } from "@/services/userService";
import type { ApiQuestion, GradeInfo, GradeQuestionsResponse } from "@/types/auth";
import { getDifficultyColor } from "@/utils/colorUtils";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();


const DiffIcon = ({ d }: { d: "Easy" | "Medium" | "Hard" | "Unknown" }) => {
  switch (d) {
    case "Easy":
      return <CheckCircle className="w-4 h-4" />;
    case "Medium":
      return <AlertCircle className="w-4 h-4" />;
    case "Hard":
      return <Target className="w-4 h-4" />;
    default:
      return <HelpCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: "correct" | "incorrect" | "not-attempted") => {
  switch (status) {
    case "correct":
      return "bg-green-500";
    case "incorrect":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
};
const StatusIcon = ({ s }: { s: "correct" | "incorrect" | "not-attempted" }) => {
  switch (s) {
    case "correct":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "incorrect":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:
      return <HelpCircle className="w-4 h-4 text-gray-400" />;
  }
};

export default function SubjectQuestionsPage() {
  const params = useParams<{ id: string }>();
  const subjectIdFromRoute = params?.id; 
  const { getValidAccessToken } = useAuth();

  // UI filters
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // API state
  const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
  const [gradeInfo, setGradeInfo] = useState<GradeInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Derived subject label
  const subjectDisplay = useMemo(() => {
    const first = apiQuestions[0];
    return first?.subject?.display_name || first?.subject?.name || `Subject ${subjectIdFromRoute ?? ""}`;
  }, [apiQuestions, subjectIdFromRoute]);

  // Fetch questions for this subject
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!getValidAccessToken || !subjectIdFromRoute) return;
      setLoading(true);
      try {
        const result = await userService.getGradeQuestions(getValidAccessToken, {
          subject_id: Number(subjectIdFromRoute),
          // optional difficulty filter if you want server-side filtering:
          difficulty: selectedDifficulty !== "all"
            ? (selectedDifficulty.toLowerCase() as "easy" | "medium" | "hard")
            : undefined,
          page: 1,
          page_size: 200, 
        });
        const data = result as GradeQuestionsResponse;
        if (cancelled) return;

        setApiQuestions(data?.questions ?? []);
        setGradeInfo(data?.grade_info ?? null);
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to fetch subject questions", e);
          setApiQuestions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [getValidAccessToken, subjectIdFromRoute, selectedDifficulty]);

  // Build topic list from API data
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    apiQuestions.forEach((q) => {
      const t = q.topic || q.subject?.category_display || q.subject?.name || "General";
      set.add(t);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [apiQuestions]);

  // Map API -> UI items
  type UIQ = {
    id: number;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard" | "Unknown";
    attempts: number;
    lastScore: number | null;
    status: "correct" | "incorrect" | "not-attempted";
    question: string;
    tags: string[];
    estimatedTime: string;
    points: number;
  };

  const uiQuestions: UIQ[] = useMemo(() => {
    return apiQuestions.map((q) => {
      const topic = q.topic || q.subject?.category_display || q.subject?.name || "General";
      const diff = q.difficulty ? (cap(q.difficulty) as "Easy" | "Medium" | "Hard") : "Unknown";
      const attempts = (q as any).attempts_count ?? 0;
      const lastScore = typeof (q as any).last_score === "number" ? (q as any).last_score : null;
      let status: "correct" | "incorrect" | "not-attempted" = "not-attempted";
      if (attempts > 0) status = lastScore === 100 ? "correct" : "incorrect";

      return {
        id: q.id,
        topic,
        difficulty: diff,
        attempts,
        lastScore,
        status,
        question: q.question_text,
        tags: [q.subject?.name, q.subject?.category].filter(Boolean) as string[],
        estimatedTime: "3 mins",
        points: 5,
      };
    });
  }, [apiQuestions]);

  // Client-side filters
  const filteredQuestions = useMemo(() => {
    return uiQuestions.filter((q) => {
      const topicOk = selectedTopic === "all" || q.topic === selectedTopic;
      const diffOk = selectedDifficulty === "all" || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const statusOk = selectedStatus === "all" || q.status === selectedStatus;
      const searchOk =
        !searchQuery ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return topicOk && diffOk && statusOk && searchOk;
    });
  }, [uiQuestions, selectedTopic, selectedDifficulty, selectedStatus, searchQuery]);

  // Stats
  const totalQuestions = uiQuestions.length;
  const attemptedQuestions = uiQuestions.filter((q) => q.attempts > 0).length;
  const correctQuestions = uiQuestions.filter((q) => q.status === "correct").length;
  const incorrectQuestions = uiQuestions.filter((q) => q.status === "incorrect").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/student/question-pool"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Subjects
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📘</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {subjectDisplay} {gradeInfo?.display_name ? `• ${gradeInfo.display_name}` : ""} Questions
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredQuestions.length} of {totalQuestions} questions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/student/fundamentals`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Brain className="w-4 h-4" />
                Learn Fundamentals
              </Link>
              <Link
                href={`/student/subject/${subjectIdFromRoute}/stats`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                View Stats
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attempted</p>
                  <p className="text-2xl font-bold text-gray-900">{attemptedQuestions}</p>
                </div>
                <Play className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Correct</p>
                  <p className="text-2xl font-bold text-green-600">{correctQuestions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Incorrect</p>
                  <p className="text-2xl font-bold text-red-600">{incorrectQuestions}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-white border-r border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Topic Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Topics</option>
                  {allTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="not-attempted">Not Attempted</option>
                  <option value="correct">Correct</option>
                  <option value="incorrect">Incorrect</option>
                </select>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedDifficulty("Easy");
                      setSelectedStatus("all");
                      setSelectedTopic("all");
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    🟢 Easy Questions
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus("incorrect");
                      setSelectedDifficulty("all");
                      setSelectedTopic("all");
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    🔴 Review Mistakes
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus("not-attempted");
                      setSelectedDifficulty("all");
                      setSelectedTopic("all");
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    📝 New Questions
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedTopic("all");
                  setSelectedDifficulty("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="text-center text-gray-500 py-24">Loading…</div>
            ) : (
              <>
                {/* Questions List */}
                <div className="space-y-4">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Indicator */}
                        <div className="flex-shrink-0 pt-1">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(q.status)}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-semibold text-gray-500">Q{q.id}</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">
                                  {q.topic}
                                </span>
                                <span
                                  className={`px-3 py-1 text-sm rounded-full border flex items-center gap-1 ${getDifficultyColor(q.difficulty)}`}
                                >
                                  <DiffIcon d={q.difficulty} />
                                  {q.difficulty}
                                </span>
                                {q.attempts > 0 && (
                                  <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <StatusIcon s={q.status} />
                                    {q.status === "correct" ? "Solved" : "Attempted"}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">{q.question}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {q.estimatedTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  {q.points} points
                                </span>
                                {q.attempts > 0 && q.lastScore != null && (
                                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                                    Best: {q.lastScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {q.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {q.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/student/question/${q.id}/practice?subject_id=${subjectIdFromRoute}${
                                selectedDifficulty !== "all"
                                  ? `&difficulty=${selectedDifficulty.toLowerCase()}`
                                  : ""
                              }&index=1`}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium"
                            >
                              <Play className="w-4 h-4" />
                              {q.attempts > 0 ? "Try Again" : "Solve Now"}
                            </Link>

                            {/* Optional solution link if you have that page */}
                            {/* <Link
                              href={`/student/question/${q.id}/solution`}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                              <BookOpen className="w-4 h-4" />
                              View Solution
                            </Link> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredQuestions.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No questions found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
                    <button
                      onClick={() => {
                        setSelectedTopic("all");
                        setSelectedDifficulty("all");
                        setSelectedStatus("all");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
