"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Target,
  Brain,
  Grid3X3,
  List,
} from "lucide-react";

import { userService } from "@/services/userService";
import { useAuth } from "@/context/auth";
import type {
  GradeInfo,
  GradeQuestionsResponse,
  ApiQuestion,
  Subject,
} from "@/types/auth";

export default function QuestionPool() {
  const { getValidAccessToken } = useAuth();

  // existing state you already had
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards"); // default to cards now

  const [selectedSubject] = useState("all");
  const [selectedDifficulty] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
  const [gradeInfo, setGradeInfo] = useState<GradeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setTotalCount] = useState(0);
  const [, setHasNextPage] = useState(false);
  const [, setHasPrevPage] = useState(false);

  const [, setAllSubjectsRaw] = useState<Subject[]>([]);
  const [subjectsMaster, setSubjectsMaster] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // NEW: UI state for subject-grid paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /* -------------------- load subjects (FIX: also set subjectsMaster) -------------------- */
  useEffect(() => {
    let cancelled = false;

    const loadSubjects = async () => {
      if (!getValidAccessToken) return;

      setSubjectsLoading(true);
      try {
        const gradeId = gradeInfo?.id;
        const data = (await userService.getSubjectsList(
          getValidAccessToken,
          gradeId
        )) as Subject[];

        if (!cancelled) {
          const sorted = [...(data ?? [])].sort((a, b) => {
            if (a.is_compulsory !== b.is_compulsory)
              return a.is_compulsory ? -1 : 1;
            const cat = a.category_display.localeCompare(b.category_display);
            if (cat !== 0) return cat;
            const name = a.display_name.localeCompare(b.display_name);
            if (name !== 0) return name;
            return a.grade_display.localeCompare(b.grade_display);
          });
          setAllSubjectsRaw(sorted);
          setSubjectsMaster(sorted); // <-- important so the UI actually has subjects
        }
      } catch (e) {
        if (!cancelled) console.error("Failed to load subjects list", e);
      } finally {
        if (!cancelled) setSubjectsLoading(false);
      }
    };

    loadSubjects();
    return () => {
      cancelled = true;
    };
  }, [getValidAccessToken, gradeInfo?.id]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let subjectId: number | undefined;
      if (selectedSubject !== "all") {
        const parsed = parseInt(selectedSubject);
        if (!isNaN(parsed) && parsed > 0) subjectId = parsed;
      }

      const difficulty =
        selectedDifficulty !== "all"
          ? (selectedDifficulty.toLowerCase() as "easy" | "medium" | "hard")
          : undefined;

      if (!getValidAccessToken) {
        throw new Error("No token getter available");
      }

      const result = await userService.getGradeQuestions(getValidAccessToken, {
        subject_id: subjectId,
        difficulty,
        page: currentPage,
        page_size: 50,
      });

      const data = result as GradeQuestionsResponse;

      setApiQuestions(data.questions || []);
      setGradeInfo(data.grade_info ?? null);
      setTotalCount(data.total_questions || 0);

      // TODO: wire these if the backend returns paging hints
      setHasNextPage(false);
      setHasPrevPage(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setApiQuestions([]);
      setTotalCount(0);
      setHasNextPage(false);
      setHasPrevPage(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, selectedDifficulty, currentPage]);

  /* -------------------- aggregate per-subject view from API data -------------------- */
  type SubjectCard = {
    id: number;
    name: string;
    icon: string;
    totalQuestions: number;
    topics: {
      name: string;
      questions: number;
      difficulty: "Easy" | "Medium" | "Hard";
    }[];
    completedQuestions: number; // from attempts_count
    averageScore?: number; // from last_score if present
    lastAttempted?: string; // optional (not available → omit)
  };

  const toUiDifficulty = (d?: string) =>
    (d ?? "").toLowerCase() === "easy"
      ? "Easy"
      : (d ?? "").toLowerCase() === "medium"
      ? "Medium"
      : (d ?? "").toLowerCase() === "hard"
      ? "Hard"
      : ("Medium" as const);

  // Build a map from subject id -> aggregated info from questions
  const subjectAgg = useMemo(() => {
    type Agg = {
      name: string;
      icon: string;
      total: number;
      completed: number;
      scores: number[];
      topics: Record<
        string,
        {
          count: number;
          difficultyVotes: Record<"Easy" | "Medium" | "Hard", number>;
        }
      >;
    };
    const map = new Map<number, Agg>();

    // seed with subjects list so subjects with 0 fetched questions still appear
    subjectsMaster.forEach((s) => {
      map.set(s.id, {
        name: s.display_name,
        icon: "📘",
        total: 0,
        completed: 0,
        scores: [],
        topics: {},
      });
    });

    apiQuestions.forEach((q) => {
      const sid = q.subject?.id;
      if (!sid) return;

      if (!map.has(sid)) {
        map.set(sid, {
          name: q.subject.display_name || q.subject.name || `Subject ${sid}`,
          icon: "📘",
          total: 0,
          completed: 0,
          scores: [],
          topics: {},
        });
      }
      const entry = map.get(sid)!;
      entry.total += 1;

      const attempts = q.attempts_count ?? 0;
      if (attempts > 0) {
        entry.completed += 1;
        const ls = q.last_score;
        if (typeof ls === "number") entry.scores.push(ls);
      }

      const topicName =
        q.topic || q.subject?.category_display || q.subject?.name || "General";
      const dUi = toUiDifficulty(q.difficulty);
      if (!entry.topics[topicName]) {
        entry.topics[topicName] = {
          count: 0,
          difficultyVotes: { Easy: 0, Medium: 0, Hard: 0 },
        };
      }
      entry.topics[topicName].count += 1;
      entry.topics[topicName].difficultyVotes[dUi] += 1;
    });

    return map;
  }, [apiQuestions, subjectsMaster]);

  // Convert to cards array (merge with subjects list to ensure names/ids)
  const subjectCards: SubjectCard[] = useMemo(() => {
    const cards: SubjectCard[] = subjectsMaster.map((s) => {
      const agg = subjectAgg.get(s.id);
      const totalFromAgg = agg?.total ?? 0;

      // derive topics list (top 4 by count)
      const topicsArray = agg
        ? Object.entries(agg.topics)
            .map(([name, t]) => {
              const diff = (["Hard", "Medium", "Easy"] as const).reduce(
                (best, cur) =>
                  t.difficultyVotes[cur] > t.difficultyVotes[best] ? cur : best,
                "Easy" as "Easy" | "Medium" | "Hard"
              );
              return { name, questions: t.count, difficulty: diff };
            })
            .sort((a, b) => b.questions - a.questions)
            .slice(0, 4)
        : [];

      const avg =
        agg && agg.scores.length > 0
          ? Math.round(
              agg.scores.reduce((a, b) => a + b, 0) / agg.scores.length
            )
          : undefined;

      return {
        id: s.id,
        name: s.display_name,
        icon: "📘",
        totalQuestions: totalFromAgg || 0,
        topics: topicsArray,
        completedQuestions: agg?.completed ?? 0,
        averageScore: avg,
        lastAttempted: undefined,
      };
    });

    // If some subjects exist only in questions (not in subjectsMaster), include them too
    subjectAgg.forEach((agg, sid) => {
      if (!subjectsMaster.find((s) => s.id === sid)) {
        const topicsArray = Object.entries(agg.topics)
          .map(([name, t]) => {
            const diff = (["Hard", "Medium", "Easy"] as const).reduce(
              (best, cur) =>
                t.difficultyVotes[cur] > t.difficultyVotes[best] ? cur : best,
              "Easy" as "Easy" | "Medium" | "Hard"
            );
            return { name, questions: t.count, difficulty: diff };
          })
          .sort((a, b) => b.questions - a.questions)
          .slice(0, 4);

        const avg =
          agg.scores.length > 0
            ? Math.round(
                agg.scores.reduce((a, b) => a + b, 0) / agg.scores.length
              )
            : undefined;

        cards.push({
          id: sid,
          name: agg.name,
          icon: agg.icon,
          totalQuestions: agg.total,
          topics: topicsArray,
          completedQuestions: agg.completed,
          averageScore: avg,
          lastAttempted: undefined,
        });
      }
    });

    // Search filter by subject name
    const filtered = cards.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    return filtered;
  }, [subjectsMaster, subjectAgg, searchQuery]);

  // paging
  const totalPages = Math.max(1, Math.ceil(subjectCards.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubjects = subjectCards.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Hard":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar (kept simple, no DashboardLayout) */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Question Pool
              </h1>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded ${
                    viewMode === "cards" ? "bg-white shadow-sm" : ""
                  }`}
                  title="Cards"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-white shadow-sm" : ""
                  }`}
                  title="List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Link
              href="/student/fundamentals"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
            >
              <Brain className="w-4 h-4" />
              Learn Fundamentals
            </Link>
          </div>

          {/* Search + count */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {subjectsLoading
                  ? "Loading…"
                  : `${subjectCards.length} Subjects`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* SUBJECT CARDS */}
          {viewMode === "cards" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading && currentSubjects.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-16">
                    Loading…
                  </div>
                )}

                {!loading &&
                  currentSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                    >
                      {/* Card Header */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{subject.icon}</div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {subject.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {subject.totalQuestions} questions
                                {gradeInfo?.display_name
                                  ? ` • ${gradeInfo.display_name}`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Your Progress</span>
                            <span className="font-semibold text-blue-600">
                              {getProgressPercentage(
                                subject.completedQuestions,
                                subject.totalQuestions
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                              style={{
                                width: `${getProgressPercentage(
                                  subject.completedQuestions,
                                  subject.totalQuestions
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {subject.completedQuestions} /{" "}
                              {subject.totalQuestions} completed
                            </span>
                            {subject.averageScore != null && (
                              <span>Avg: {subject.averageScore}%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Topics
                        </h4>
                        <div className="space-y-2 mb-4">
                          {subject.topics.length === 0 && (
                            <div className="text-sm text-gray-500">
                              No topic breakdown yet.
                            </div>
                          )}
                          {subject.topics.map((topic, index) => (
                            <div
                              key={`${topic.name}-${index}`}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm text-gray-700">
                                {topic.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(
                                    topic.difficulty
                                  )}`}
                                >
                                  {topic.difficulty}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {topic.questions}Q
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/student/subject/${subject.id}/questions`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium"
                          >
                            <BookOpen className="w-4 h-4" />
                            Browse Questions
                          </Link>
                          <Link
                            href={`/student/subject/${subject.id}/stats`}
                            className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        </div>

                        {/* Last attempted (optional) */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {subject.lastAttempted
                            ? `Last attempted ${subject.lastAttempted}`
                            : `Keep practicing!`}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pagination */}
              {subjectCards.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && subjectCards.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No subjects found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search query.
                  </p>
                </div>
              )}
            </>
          ) : (
            // If you still want the old list view of questions, you can keep it here,
            // but since you asked to switch to the new design, the default is "cards".
            <div className="text-center py-12 text-gray-500">
              List view coming from your previous template.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
