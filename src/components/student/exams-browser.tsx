"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  FileText,
  Search,
  Award,
  School,
  GraduationCap,
  Target,
  ChevronRight,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/context/auth";
import { userService } from "@/services/userService";
import type { ExamLite } from "@/types/exams";

export default function ExamsBrowser() {
  const { getValidAccessToken } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<
    "all" | "JUNIOR" | "SENIOR"
  >("all");
  const [selectedType, setSelectedType] = useState<
    "all" | "MAIN" | "MOCK" | "CAT" | "REVISION"
  >("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState<ExamLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const examTypes = [
    {
      key: "MAIN",
      label: "National Exams",
      description: "Official KCSE & KCPE papers",
      color: "bg-red-500",
      icon: "🏆",
    },
    {
      key: "MOCK",
      label: "Mock Exams",
      description: "Practice exams from schools",
      color: "bg-blue-500",
      icon: "📝",
    },
    {
      key: "CAT",
      label: "CAT Papers",
      description: "Continuous Assessment Tests",
      color: "bg-green-500",
      icon: "📊",
    },
    {
      key: "REVISION",
      label: "Revision Papers",
      description: "Topic-based revision tests",
      color: "bg-purple-500",
      icon: "📚",
    },
  ] as const;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!getValidAccessToken) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await userService.getExams(getValidAccessToken, {
          level: selectedLevel === "all" ? undefined : selectedLevel,
          type: selectedType === "all" ? undefined : selectedType,
          year: selectedYear === "all" ? undefined : selectedYear,
          search: searchQuery || undefined,
        });
        console.log("🔍 ExamsBrowser received exams:", data); // <-- Add this line

        if (!cancelled) setExams(data);
      } catch (e: unknown) {
        const message =
          typeof e === "object" && e !== null && "message" in e
            ? (e as { message?: string }).message
            : undefined;
        if (!cancelled) setErrorMsg(message || "Failed to load exams.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [
    getValidAccessToken,
    selectedLevel,
    selectedType,
    selectedYear,
    searchQuery,
  ]);

  const years = useMemo(
    () => [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a),
    [exams]
  );

  const getExamTypeInfo = (type: string) =>
    examTypes.find((t) => t.key === type) || examTypes[0];

  //   const filteredExams = exams.filter((exam) => {
  //     const matchesLevel =
  //       selectedLevel === "all" || exam.level === selectedLevel;
  //     const matchesType =
  //       selectedType === "all" || exam.exam_type === selectedType;
  //     const matchesYear =
  //       selectedYear === "all" || exam.year.toString() === selectedYear;
  //     const matchesSearch =
  //       searchQuery === "" ||
  //       exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       exam.source?.toLowerCase().includes(searchQuery.toLowerCase());

  //     return matchesLevel && matchesType && matchesYear && matchesSearch;
  //   });

  return (
    <DashboardLayout>
      {(user) => (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Past Papers & Exams
                  </h1>
                  <p className="text-gray-600">
                    Practice with official KCSE, KCPE papers and mock exams from
                    top schools
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {exams.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Exams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {exams.reduce(
                        (sum, exam) =>
                          sum + (exam.total_papers || exam.papers?.length || 0),
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Papers Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {examTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() =>
                    setSelectedType(
                      selectedType === type.key ? "all" : type.key
                    )
                  }
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedType === type.key
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{type.icon}</span>
                    <h3 className="font-semibold text-gray-900">
                      {type.label}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {type.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {exams.filter((e) => e.exam_type === type.key).length}{" "}
                    available
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search exams, schools, or sources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as "all" | "JUNIOR" | "SENIOR")}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="all">All Levels</option>
                    <option value="JUNIOR">Junior Secondary</option>
                    <option value="SENIOR">Senior Secondary</option>
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="all">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error / Loading */}
            {errorMsg && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                {errorMsg}
              </div>
            )}
            {loading && (
              <div className="text-center text-gray-500 py-12">
                Loading exams…
              </div>
            )}

            {/* Exams Grid */}
            {!loading && (
              <div className="space-y-6">
                {exams.map((exam) => {
                  const typeInfo = getExamTypeInfo(exam.exam_type);
                  return (
                    <div
                      key={exam.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      {/* Exam Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 ${typeInfo.color} rounded-xl flex items-center justify-center`}
                            >
                              <span className="text-white text-xl">
                                {typeInfo.icon}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-bold text-gray-900">
                                  {exam.title} {exam.year}
                                </h2>
                                {exam.is_official && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    <Star className="w-3 h-3" />
                                    Official
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <School className="w-4 h-4" />
                                  {exam.source || "—"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-4 h-4" />
                                  {exam.level === "SENIOR"
                                    ? "Senior Secondary"
                                    : "Junior Secondary"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {exam.papers.length} Papers
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">
                              Total Questions
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {exam.papers.reduce(
                                (sum, p) => sum + (p.questions_count || 0),
                                0
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Papers Grid */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {exam.papers.map((paper) => (
                            <Link
                              key={paper.id}
                              href={`/student/exam-paper/${paper.id}`}
                              className="group p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                  {paper.subject.display_name}
                                  {paper.paper_code && ` - ${paper.paper_code}`}
                                </h3>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    Questions
                                  </span>
                                  <span className="font-medium">
                                    {paper.questions_count}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Duration
                                  </span>
                                  <span className="font-medium">
                                    {paper.duration_minutes
                                      ? `${paper.duration_minutes} min`
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    Total Marks
                                  </span>
                                  <span className="font-medium">
                                    {paper.total_marks}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && exams.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No exams found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
