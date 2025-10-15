"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Play,
  Eye,
  Grid3X3,
  List,
  ChevronDown,
  ChevronRight,
  Award,
  Target,
  FileText,
  X,
  CheckCircle,
  HelpCircle,
  Calculator,
  Shuffle,
  Brain,
  PenTool,
  Loader,
  ChevronLeft,
} from "lucide-react";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/auth";
import type {
  GradeInfo,
  ExamPaper,
  GradeQuestionsResponse,
  IndividualQuestion,
  ApiQuestion,
  Subject,
} from "@/types/auth";
import { useRouter } from "next/navigation";
import { getDifficultyColor } from "@/utils/colorUtils";

export default function QuestionPool() {
  const { getValidAccessToken } = useAuth();

  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [contentMode, setContentMode] = useState<"questions" | "exams">(
    "questions"
  );
  const router = useRouter();

  // Filters / state
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([
    "Mathematics",
  ]);
  const [previewItem, setPreviewItem] = useState<
    IndividualQuestion | ExamPaper | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
  const [gradeInfo, setGradeInfo] = useState<GradeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [subjectsList, setSubjectsList] = useState<
    { id: number; name: string; display_name: string }[]
  >([]);

  const [allSubjectsRaw, setAllSubjectsRaw] = useState<Subject[]>([]);
  const [subjectsMaster, setSubjectsMaster] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const difficulties = ["easy", "medium", "hard"];
  const years = ["2024", "2023", "2022", "2021", "2020"];
  const examTypes = ["Mock Exam", "Main Exam", "Practice Test", "Topic Quiz"];

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
          // stable ordering so options never jump
          const sorted = [...data].sort((a, b) => {
            if (a.is_compulsory !== b.is_compulsory)
              return a.is_compulsory ? -1 : 1;
            const cat = a.category_display.localeCompare(b.category_display);
            if (cat !== 0) return cat;
            const name = a.display_name.localeCompare(b.display_name);
            if (name !== 0) return name;
            // same subject name across multiple grades remains stable
            return a.grade_display.localeCompare(b.grade_display);
          });
          setAllSubjectsRaw(sorted);
        }
      } catch (e: any) {
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
    if (contentMode !== "questions") return;
    setLoading(true);
    try {
      // Parse subject ID with better validation
      let subjectId: number | undefined;
      if (selectedSubject !== "all") {
        const parsed = parseInt(selectedSubject);
        if (!isNaN(parsed) && parsed > 0) {
          subjectId = parsed;
        }
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
        page_size: 20,
      });

      const data = result as GradeQuestionsResponse;

      setApiQuestions(data.questions || []);
      setGradeInfo(data.grade_info ?? null);
      setTotalCount(data.total_questions || 0);

      setHasNextPage(false);
      setHasPrevPage(false);

      // Extract unique subjects from API response
      if (data.questions && data.questions.length > 0) {
        const uniqueSubjects = Array.from(
          new Set(
            data.questions.map((q: ApiQuestion) =>
              JSON.stringify({
                id: q.subject.id,
                name: q.subject.name,
                display_name: q.subject.display_name,
              })
            )
          )
        ).map((s) => JSON.parse(s));

        console.log("Extracted subjects:", uniqueSubjects);
        setSubjectsList(uniqueSubjects);
      }
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
  }, [contentMode, selectedSubject, selectedDifficulty, currentPage]);

  const individualQuestions: IndividualQuestion[] = apiQuestions.map((q) => ({
    id: q.id.toString(),
    type: "question",
    title: q.question_text,
    subject: q.subject.display_name,
    topic: q.subject.category_display || q.subject.name, // Use category_display or fallback to name
    difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
    year: new Date(q.created_at).getFullYear().toString(), // Use actual creation year
    questionType:
      q.question_type === "mcq" ? "Multiple Choice" : q.question_type,
    attempts: q.attempts_count || 0,
    bestScore: null,
    lastAttempt: null,
    tags: [q.subject.name, q.subject.category],
    timeEstimate: "3 mins", 
    points: 5, 
    question: q.question_text,
    options: Object.values(q.options || {}),
    correctAnswer: Object.keys(q.options || {}).indexOf(q.correct_option), 
    explanation: q.explanation || "",
    hints: [], 
    relatedTopics: [], 
  }));

  // Mock exams (formerly papers)
  const examPapers: ExamPaper[] = [
    {
      id: 1,
      type: "exam",
      title: "Linear Algebra Fundamentals",
      subject: "Mathematics",
      topic: "Linear Algebra",
      difficulty: "Medium",
      year: "2024",
      examType: "Practice Test",
      questions: 25,
      duration: "90 mins",
      attempts: 0,
      maxScore: 100,
      tags: ["Matrices", "Vectors", "Eigenvalues"],
      description:
        "Comprehensive test covering matrix operations, vector spaces, and linear transformations.",
      instructions: [
        "Read all questions carefully before starting",
        "You have 90 minutes to complete all 25 questions",
        "Each question carries equal marks",
        "There is no negative marking",
        "You can review and change answers before submitting",
      ],
      syllabus: [
        "Matrix Operations and Properties",
        "Vector Spaces and Subspaces",
        "Linear Transformations",
        "Eigenvalues and Eigenvectors",
      ],
      sampleQuestions: [
        {
          question:
            "Find the determinant of the 3×3 matrix A = [[2, 1, 3], [0, 4, 1], [1, 2, 0]]",
          options: ["A) -14", "B) 14", "C) -10", "D) 10"],
          correctAnswer: 0,
        },
        {
          question:
            "If vectors u = (2, 3, 1) and v = (1, -1, 2), find u · v (dot product)",
          options: ["A) 1", "B) 3", "C) -1", "D) 5"],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: 2,
      type: "exam",
      title: "Calculus Mock Exam 2024",
      subject: "Mathematics",
      topic: "Calculus",
      difficulty: "Hard",
      year: "2024",
      examType: "Mock Exam",
      questions: 30,
      duration: "120 mins",
      attempts: 1,
      maxScore: 120,
      lastScore: 85,
      tags: ["Derivatives", "Integrals", "Limits"],
      description: "Mock exam paper for calculus covering all major topics.",
      instructions: [
        "This is a timed mock exam",
        "Calculator is allowed for numerical computations",
        "Show all working steps clearly",
        "Partial marks will be awarded",
      ],
      syllabus: [
        "Limits and Continuity",
        "Differentiation Rules",
        "Integration Techniques",
        "Applications of Calculus",
      ],
      sampleQuestions: [
        {
          question: "Find the derivative of f(x) = 3x² + 2x - 1",
          options: ["A) 6x + 2", "B) 6x - 2", "C) 3x + 2", "D) 6x + 1"],
          correctAnswer: 0,
        },
      ],
    },
  ];

  // Update getFilteredData around line 240:
  const getFilteredData = () => {
    if (contentMode === "questions") {
      return individualQuestions.filter((item) => {
        // Fix subject matching to use ID comparison
        const matchesSubject =
          selectedSubject === "all" ||
          apiQuestions
            .find((q) => q.id.toString() === item.id)
            ?.subject.id.toString() === selectedSubject;

        const matchesDifficulty =
          selectedDifficulty === "all" ||
          item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

        const matchesYear =
          selectedYear === "all" || item.year === selectedYear;

        const matchesTopic =
          selectedTopic === "all" ||
          item.topic === selectedTopic ||
          apiQuestions.find((q) => q.id.toString() === item.id)?.subject
            .category_display === selectedTopic;

        const matchesType =
          selectedType === "all" || item.questionType === selectedType;

        const matchesSearch =
          searchQuery === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        return (
          matchesSubject &&
          matchesDifficulty &&
          matchesYear &&
          matchesTopic &&
          matchesType &&
          matchesSearch
        );
      });
    } else {
      // Keep existing exam filtering logic
      return examPapers.filter((item) => {
        const matchesSubject =
          selectedSubject === "all" || item.subject === selectedSubject;
        const matchesDifficulty =
          selectedDifficulty === "all" ||
          item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        const matchesYear =
          selectedYear === "all" || item.year === selectedYear;
        const matchesTopic =
          selectedTopic === "all" || item.topic === selectedTopic;
        const matchesType =
          selectedType === "all" || item.examType === selectedType;
        const matchesSearch =
          searchQuery === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return (
          matchesSubject &&
          matchesDifficulty &&
          matchesYear &&
          matchesTopic &&
          matchesType &&
          matchesSearch
        );
      });
    }
  };

  const filteredData = getFilteredData();

  // Grouped for hierarchical list
  const groupedData = filteredData.reduce(
    (acc: Record<string, Record<string, any[]>>, item: any) => {
      if (!acc[item.subject]) acc[item.subject] = {};
      if (!acc[item.subject][item.topic]) acc[item.subject][item.topic] = [];
      acc[item.subject][item.topic].push(item);
      return acc;
    },
    {}
  );


  const getTypeIcon = (item: any) => {
    if (contentMode === "questions") {
      switch (item.questionType) {
        case "Multiple Choice":
          return <HelpCircle className="w-4 h-4" />;
        case "True/False":
          return <CheckCircle className="w-4 h-4" />;
        case "Numerical":
          return <Calculator className="w-4 h-4" />;
        case "Essay":
          return <PenTool className="w-4 h-4" />;
        default:
          return <BookOpen className="w-4 h-4" />;
      }
    } else {
      switch (item.examType) {
        case "Mock Exam":
          return <FileText className="w-4 h-4" />;
        case "Main Exam":
          return <Award className="w-4 h-4" />;
        case "Practice Test":
          return <Target className="w-4 h-4" />;
        case "Topic Quiz":
          return <BookOpen className="w-4 h-4" />;
        default:
          return <BookOpen className="w-4 h-4" />;
      }
    }
  };

  const toggleSubjectExpansion = (subject: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const openPreview = (item: any) => setPreviewItem(item);
  const closePreview = () => setPreviewItem(null);

  const getRandomQuestion = () => {
    if (contentMode === "questions" && apiQuestions.length > 0) {
      const randomQuestion =
        apiQuestions[Math.floor(Math.random() * apiQuestions.length)];
      router.push(
        `/student/question/${randomQuestion.id}/practice?subject_id=${randomQuestion.subject.id}&difficulty=${randomQuestion.difficulty}&index=1`
      );
    }
  };
  const clearAllFilters = () => {
    setSelectedSubject("all");
    setSelectedDifficulty("all");
    setSelectedYear("all");
    setSelectedType("all");
    setSelectedTopic("all");
    setSearchQuery("");
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
        
          </div>
          <div className="flex items-center gap-3">
            {/* Content Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setContentMode("questions")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                  contentMode === "questions"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Brain className="w-4 h-4" />
                Questions
              </button>
              <button
                onClick={() => setContentMode("exams")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                  contentMode === "exams"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                Exams
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list" ? "bg-white shadow-sm" : ""
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded ${
                  viewMode === "cards" ? "bg-white shadow-sm" : ""
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Filters */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${
                    contentMode === "questions" ? "questions" : "exams"
                  }...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {contentMode === "questions" && totalCount > 0 && (
                  <>
                    <button
                      onClick={getRandomQuestion}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Shuffle className="w-4 h-4" />
                      Random Question
                    </button>
                    <Link
                      href={
                        apiQuestions.length > 0
                          ? `/student/question/${
                              apiQuestions[0].id
                            }/practice?index=1${
                              selectedSubject !== "all" ||
                              selectedDifficulty !== "all"
                                ? `&${new URLSearchParams({
                                    ...(selectedSubject !== "all" && {
                                      subject_id: selectedSubject,
                                    }),
                                    ...(selectedDifficulty !== "all" && {
                                      difficulty: selectedDifficulty,
                                    }),
                                  }).toString()}`
                                : ""
                            }`
                          : "#"
                      }
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        apiQuestions.length > 0
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        if (apiQuestions.length === 0) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Play className="w-4 h-4" />
                      {apiQuestions.length > 0
                        ? "Start Practice Session"
                        : "No Questions Available"}
                    </Link>
                  </>
                )}

                {/* Updated subject quick actions with real data */}
                {subjectsMaster.slice(0, 8).map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject.id.toString());
                      setSelectedType("all");
                      setSelectedDifficulty("all");
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    📊 {subject.display_name} (
                    {selectedSubject === "all"
                      ? apiQuestions.filter((q) => q.subject.id === subject.id)
                          .length
                      : subject.id.toString() === selectedSubject
                      ? apiQuestions.length
                      : apiQuestions.filter((q) => q.subject.id === subject.id)
                          .length}
                    )
                  </button>
                ))}
                {subjectsMaster.length > 8 && (
                  <div className="text-xs text-gray-500 text-center mt-2">
                    +{subjectsMaster.length - 8} more subjects in dropdown
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedDifficulty("easy");
                    setSelectedSubject("all");
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  🟢 Easy Level (
                  {apiQuestions.filter((q) => q.difficulty === "easy").length})
                </button>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Subjects</option>
                {subjectsMaster.map((subject) => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.display_name}
                  </option>
                ))}
              </select>
              {subjectsLoading && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading subjects...
                </p>
              )}
              {!subjectsLoading && subjectsMaster.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {subjectsMaster.length} subjects available
                </p>
              )}
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Topics</option>
                {[
                  "Algebra",
                  "Calculus",
                  "Geometry",
                  "Statistics",
                  "Linear Algebra",
                  "Mechanics",
                  "Thermodynamics",
                ].map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {contentMode === "questions" ? "Question Type" : "Exam Type"}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {contentMode === "questions"
                  ? Array.from(
                      new Set(
                        apiQuestions.map((q) =>
                          q.question_type === "mcq"
                            ? "Multiple Choice"
                            : q.question_type
                        )
                      )
                    ).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))
                  : examTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear */}
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Sort / summary row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">
                Showing {filteredData.length}{" "}
                {contentMode === "questions" ? "questions" : "exams"}
                {selectedSubject !== "all" && ` in ${selectedSubject}`}
                {selectedType !== "all" && ` • ${selectedType}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border border-gray-200 rounded px-3 py-1">
                <option>Newest First</option>
                <option>Subject</option>
                <option>Difficulty</option>
                <option>Most Attempted</option>
                {contentMode === "questions" && <option>Time Estimate</option>}
                {contentMode === "exams" && <option>Duration</option>}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading...</p>
              </div>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {Object.entries(groupedData).map(([subject, topics]) => (
                <div
                  key={subject}
                  className="bg-white rounded-lg border border-gray-200"
                >
                  <button
                    onClick={() => toggleSubjectExpansion(subject)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedSubjects.includes(subject) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {subject}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                        {Object.values(topics).flat().length}{" "}
                        {contentMode === "questions" ? "Questions" : "Exams"}
                      </span>
                    </div>
                  </button>

                  {expandedSubjects.includes(subject) && (
                    <div className="border-t border-gray-100">
                      {Object.entries(topics).map(([topic, items]) => (
                        <div
                          key={topic}
                          className="p-4 border-b border-gray-50 last:border-b-0"
                        >
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {topic}
                            <span className="text-xs text-gray-500">
                              ({items.length}{" "}
                              {contentMode === "questions"
                                ? "Questions"
                                : "Exams"}
                              )
                            </span>
                          </h4>
                          <div className="space-y-2">
                            {items.map((item: any) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="flex items-center gap-2">
                                    {getTypeIcon(item)}
                                    <span className="font-medium text-gray-900">
                                      {item.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                                        item.difficulty
                                      )}`}
                                    >
                                      {item.difficulty}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                      {item.year}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                      {contentMode === "questions"
                                        ? item.questionType
                                        : item.examType}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    {contentMode === "questions" ? (
                                      <>
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {item.timeEstimate}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Star className="w-3 h-3" />
                                          {item.points} pts
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="flex items-center gap-1">
                                          <BookOpen className="w-3 h-3" />
                                          {item.questions}Q
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {item.duration}
                                        </span>
                                      </>
                                    )}
                                    {item.attempts > 0 && (
                                      <span className="flex items-center gap-1 text-green-600">
                                        <Star className="w-3 h-3" />
                                        Best: {item.bestScore ?? item.lastScore}
                                        %
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openPreview(item)}
                                    className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                                  >
                                    <Eye className="w-3 h-3" />
                                    Preview
                                  </button>
                                  <Link
                                    href={
                                      contentMode === "questions"
                                        ? (() => {
                                            const questionData =
                                              apiQuestions.find(
                                                (q) =>
                                                  q.id.toString() === item.id
                                              );
                                            const params = new URLSearchParams({
                                              subject_id:
                                                questionData?.subject.id.toString() ||
                                                "",
                                              difficulty:
                                                questionData?.difficulty || "",
                                              index: "1",
                                            });
                                            return `/student/question/${
                                              item.id
                                            }/practice?${params.toString()}`;
                                          })()
                                        : `/student/exam-paper/${item.id}`
                                    }
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    <Play className="w-3 h-3" />
                                    {item.attempts > 0 ? "Retry" : "Start"}
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredData.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.subject} • {item.topic}
                      </p>

                      <div className="flex items-center gap-1 mb-2">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(
                            item.difficulty
                          )}`}
                        >
                          {item.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {item.year}
                        </span>
                      </div>
                    </div>
                    {item.attempts > 0 && (
                      <div className="text-right text-xs">
                        <span className="text-green-600 font-medium">
                          {item.bestScore ?? item.lastScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    {contentMode === "questions" ? (
                      <>
                        <span>{item.timeEstimate}</span>
                        <span>{item.points} points</span>
                      </>
                    ) : (
                      <>
                        <span>{item.questions} questions</span>
                        <span>{item.duration}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openPreview(item)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                    <Link
                      href={
                        contentMode === "questions"
                          ? `/student/question/${
                              (previewItem as IndividualQuestion).id
                            }/practice}`
                          : `/student/exam-paper/${item.id}/take`
                      }
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      {item.attempts > 0 ? "Retry" : "Start"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredData.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No {contentMode === "questions" ? "questions" : "exams"} found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}

          {/* Pagination for questions if applicable */}
          {contentMode === "questions" && (hasNextPage || hasPrevPage) && (
            <div className="flex items-center justify-between mt-8 border-t pt-4 border-gray-200">
              <button
                onClick={handlePrevPage}
                disabled={!hasPrevPage}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  hasPrevPage
                    ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "border-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 20 + 1} to{" "}
                  {Math.min(currentPage * 20, totalCount)} of {totalCount}{" "}
                  questions
                </span>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {Math.ceil(totalCount / 20)}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  hasNextPage
                    ? "border-blue-500 text-blue-500 hover:bg-blue-50"
                    : "border-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {previewItem.title}
                </h2>
                <p className="text-gray-600">
                  {previewItem.subject} • {previewItem.topic}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {contentMode === "questions" ? (
                // Question Preview
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Question Preview
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                          {previewItem.subject}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {(previewItem as IndividualQuestion).questionType}
                        </span>
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(
                            previewItem.difficulty
                          )}`}
                        >
                          {previewItem.difficulty}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-gray-800 font-medium mb-4">
                          {(previewItem as IndividualQuestion).question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(previewItem as IndividualQuestion).options.map(
                            (option, idx) => (
                              <div
                                key={idx}
                                className="p-2 bg-white rounded border text-sm"
                              >
                                {option}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">
                            Explanation
                          </h4>
                          <p className="text-gray-700 text-sm">
                            {(previewItem as IndividualQuestion).explanation ||
                              "No explanation provided."}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">
                            Hints
                          </h4>
                          <ul className="space-y-1">
                            {(previewItem as IndividualQuestion).hints
                              .length ? (
                              (previewItem as IndividualQuestion).hints.map(
                                (hint, i) => (
                                  <li
                                    key={i}
                                    className="text-gray-600 text-sm flex items-start gap-2"
                                  >
                                    <span className="text-blue-500">•</span>
                                    {hint}
                                  </li>
                                )
                              )
                            ) : (
                              <li className="text-gray-600 text-sm">
                                No hints available.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Practice This Question
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Time Estimate:</span>
                          <span className="font-medium text-gray-900">
                            {(previewItem as IndividualQuestion).timeEstimate}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Points:</span>
                          <span className="font-medium text-gray-900">
                            {(previewItem as IndividualQuestion).points}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Attempts:</span>
                          <span className="font-medium text-gray-900">
                            {(previewItem as IndividualQuestion).attempts}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/student/question/${
                          (previewItem as IndividualQuestion).id
                        }/practice`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Play className="w-5 h-5" />
                        Practice Question
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // Exam Preview
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Exam Overview
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                          {previewItem.subject}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {previewItem.topic}
                        </span>
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(
                            previewItem.difficulty
                          )}`}
                        >
                          {previewItem.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {previewItem.year}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-6">
                        {(previewItem as ExamPaper).description}
                      </p>

                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                            <BookOpen className="w-5 h-5" />
                            <span>Questions</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {(previewItem as ExamPaper).questions}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                            <Clock className="w-5 h-5" />
                            <span>Duration</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {(previewItem as ExamPaper).duration}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                            <Star className="w-5 h-5" />
                            <span>Max Score</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {(previewItem as ExamPaper).maxScore}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(previewItem as ExamPaper).tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Instructions
                        </h3>
                        <ul className="space-y-3">
                          {(previewItem as ExamPaper).instructions.map(
                            (instruction, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">
                                  {instruction}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Ready to Start?
                      </h3>

                      {(previewItem as ExamPaper).attempts > 0 && (
                        <div className="mb-4 p-3 bg-green-100 rounded-lg">
                          <p className="text-sm text-green-700 font-medium">
                            Previous Attempts:{" "}
                            {(previewItem as ExamPaper).attempts}
                          </p>
                          {"lastScore" in previewItem && (
                            <p className="text-sm text-green-600">
                              Best Score: {(previewItem as ExamPaper).lastScore}
                              %
                            </p>
                          )}
                        </div>
                      )}

                      <Link
                        href={`/student/exam/${
                          (previewItem as ExamPaper).id
                        }/take`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Play className="w-5 h-5" />
                        {(previewItem as ExamPaper).attempts > 0
                          ? "Retake Exam"
                          : "Start Exam"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
