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

// --- API types (adjust if your real types differ) ---
type Subject = {
  id: number;
  name: string;
  display_name: string;
};

type Grade = {
  id: number;
  name: string;
  display_name: string;
};

type ApiQuestion = {
  id: number;
  question_text: string;
  question_type: string; // e.g., "mcq"
  options: Record<string, string>;
  difficulty: "easy" | "medium" | "hard";
  subject: Subject;
  grade: Grade;
};

type GradeQuestionsResponse = {
  grade_info: Grade;
  questions: ApiQuestion[];
};

// --- Local shapes used for rendering ---
type IndividualQuestion = {
  id: string;
  type: "question";
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  year: string;
  questionType: string;
  attempts: number;
  bestScore: number | null;
  lastAttempt: string | null;
  tags: string[];
  timeEstimate: string;
  points: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hints: string[];
  relatedTopics: string[];
};

type ExamPaper = {
  id: number;
  type: "exam";
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  year: string;
  examType: string;
  questions: number;
  duration: string;
  attempts: number;
  maxScore: number;
  lastScore?: number;
  tags: string[];
  description: string;
  instructions: string[];
  syllabus?: string[];
  sampleQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
};

export default function QuestionPool() {
  const { getValidAccessToken } = useAuth();

  // Modes
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [contentMode, setContentMode] = useState<"questions" | "exams">("questions");

  // Filters / state
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>(["Mathematics"]);
  const [previewItem, setPreviewItem] = useState<IndividualQuestion | ExamPaper | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // API question state
  const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
  const [gradeInfo, setGradeInfo] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [subjectsList, setSubjectsList] = useState<{ id: number; name: string }[]>([]);

  // Static options
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];
  const difficulties = ["Easy", "Medium", "Hard"];
  const years = ["2024", "2023", "2022", "2021", "2020"];
  const examTypes = ["Mock Exam", "Main Exam", "Practice Test", "Topic Quiz"];
  const questionTypes = ["Multiple Choice", "True/False", "Short Answer", "Essay", "Numerical"];

  // Fetch questions from API when in questions mode and filters change
  const fetchQuestions = async () => {
    if (contentMode !== "questions") return;
    setLoading(true);
    try {
      const subjectId = selectedSubject !== "all" ? parseInt(selectedSubject) : undefined;
      const difficulty =
        selectedDifficulty !== "all" ? (selectedDifficulty.toLowerCase() as "easy" | "medium" | "hard") : undefined;

      if (!getValidAccessToken) {
        throw new Error("No token getter available");
      }

      const result = await userService.getGradeQuestions(getValidAccessToken, {
        subject_id: subjectId,
        difficulty,
        page: currentPage,
      });

      const data = result as GradeQuestionsResponse;

      setApiQuestions(data.questions || []);
      setGradeInfo(data.grade_info ?? null);
      setTotalCount(data.questions?.length ?? 0);
      // Assuming pagination urls are not returned; keep null
      setNextPage(null);
      setPrevPage(null);

      if (data.questions && data.questions.length > 0) {
        const uniqueSubjects = Array.from(
          new Set(
            data.questions.map((q) =>
              JSON.stringify({ id: q.subject.id, name: q.subject.display_name })
            )
          )
        ).map((s) => JSON.parse(s));
        setSubjectsList(uniqueSubjects);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setApiQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentMode, selectedSubject, selectedDifficulty, currentPage]);

  // Map API questions to internal display shape
  const individualQuestions: IndividualQuestion[] = apiQuestions.map((q) => ({
    id: q.id.toString(),
    type: "question",
    title: q.question_text,
    subject: q.subject.display_name,
    topic: q.subject.name,
    difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
    year: new Date().getFullYear().toString(),
    questionType: q.question_type === "mcq" ? "Multiple Choice" : q.question_type,
    attempts: 0,
    bestScore: null,
    lastAttempt: null,
    tags: [q.subject.name],
    timeEstimate: "3 mins",
    points: 5,
    question: q.question_text,
    options: Object.values(q.options || {}),
    correctAnswer: 0,
    explanation: "",
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
      description: "Comprehensive test covering matrix operations, vector spaces, and linear transformations.",
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
          question: "Find the determinant of the 3×3 matrix A = [[2, 1, 3], [0, 4, 1], [1, 2, 0]]",
          options: ["A) -14", "B) 14", "C) -10", "D) 10"],
          correctAnswer: 0,
        },
        {
          question: "If vectors u = (2, 3, 1) and v = (1, -1, 2), find u · v (dot product)",
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

  // Filtering logic
  const getFilteredData = () => {
    if (contentMode === "questions") {
      return individualQuestions.filter((item) => {
        const matchesSubject = selectedSubject === "all" || item.subject === selectedSubject;
        const matchesDifficulty = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
        const matchesYear = selectedYear === "all" || item.year === selectedYear;
        const matchesTopic = selectedTopic === "all" || item.topic === selectedTopic;
        const matchesType = selectedType === "all" || item.questionType === selectedType;
        const matchesSearch =
          searchQuery === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSubject && matchesDifficulty && matchesYear && matchesTopic && matchesType && matchesSearch;
      });
    } else {
      return examPapers.filter((item) => {
        const matchesSubject = selectedSubject === "all" || item.subject === selectedSubject;
        const matchesDifficulty = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
        const matchesYear = selectedYear === "all" || item.year === selectedYear;
        const matchesTopic = selectedTopic === "all" || item.topic === selectedTopic;
        const matchesType = selectedType === "all" || item.examType === selectedType;
        const matchesSearch =
          searchQuery === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSubject && matchesDifficulty && matchesYear && matchesTopic && matchesType && matchesSearch;
      });
    }
  };

  const filteredData = getFilteredData();

  // Grouped for hierarchical list
  const groupedData = filteredData.reduce((acc: Record<string, Record<string, any[]>>, item: any) => {
    if (!acc[item.subject]) acc[item.subject] = {};
    if (!acc[item.subject][item.topic]) acc[item.subject][item.topic] = [];
    acc[item.subject][item.topic].push(item);
    return acc;
  }, {});

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
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const openPreview = (item: any) => setPreviewItem(item);
  const closePreview = () => setPreviewItem(null);

  const getRandomQuestion = () => {
    if (contentMode === "questions" && individualQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * individualQuestions.length);
      const randomQuestion = individualQuestions[randomIndex];
      window.location.href = `/student/question/${randomQuestion.id}/practice`;
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

  // Pagination handlers (if supported)
  const handleNextPage = () => {
    if (nextPage) setCurrentPage((p) => p + 1);
  };
  const handlePrevPage = () => {
    if (prevPage && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Question Pool {gradeInfo ? `- ${gradeInfo.display_name}` : ""}
            </h1>
            <p className="text-gray-600">
              {contentMode === "questions"
                ? `Browse and practice ${filteredData.length} individual questions`
                : `Browse and take ${filteredData.length} exams`}
              {selectedSubject !== "all" && ` in ${selectedSubject}`}
              {selectedType !== "all" && ` • ${selectedType}`}
            </p>
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
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded ${viewMode === "cards" ? "bg-white shadow-sm" : ""}`}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${contentMode === "questions" ? "questions" : "exams"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {contentMode === "questions" && (
                  <button
                    onClick={getRandomQuestion}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Shuffle className="w-4 h-4" />
                    Random Question
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedSubject("Mathematics");
                    setSelectedType("all");
                    setSelectedDifficulty("all");
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  📊 All Math {contentMode === "questions" ? "Questions" : "Exams"}
                </button>
                <button
                  onClick={() => {
                    setSelectedDifficulty("Easy");
                    setSelectedSubject("all");
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  🟢 Easy Level Only
                </button>
                <button
                  onClick={() => {
                    setSelectedYear("2024");
                    setSelectedSubject("all");
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  📅 Latest (2024)
                </button>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Subjects</option>
                {subjectsList.length > 0
                  ? subjectsList.map((subject) => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))
                  : subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Topics</option>
                {["Algebra", "Calculus", "Geometry", "Statistics", "Linear Algebra", "Mechanics", "Thermodynamics"].map(
                  (topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  )
                )}
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
                {(contentMode === "questions" ? questionTypes : examTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
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
                Showing {filteredData.length} {contentMode === "questions" ? "questions" : "exams"}
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
                <div key={subject} className="bg-white rounded-lg border border-gray-200">
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
                      <h3 className="text-lg font-semibold text-gray-900">{subject}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                        {Object.values(topics).flat().length} {contentMode === "questions" ? "Questions" : "Exams"}
                      </span>
                    </div>
                  </button>

                  {expandedSubjects.includes(subject) && (
                    <div className="border-t border-gray-100">
                      {Object.entries(topics).map(([topic, items]) => (
                        <div key={topic} className="p-4 border-b border-gray-50 last:border-b-0">
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {topic}
                            <span className="text-xs text-gray-500">
                              ({items.length} {contentMode === "questions" ? "Questions" : "Exams"})
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
                                    <span className="font-medium text-gray-900">{item.title}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}
                                    >
                                      {item.difficulty}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                      {item.year}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                      {contentMode === "questions" ? item.questionType : item.examType}
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
                                        Best: {item.bestScore ?? item.lastScore}%
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
                                        ? `/student/question/${item.id}/practice`
                                        : `/student/exam/${item.id}/take`
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
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.subject} • {item.topic}
                      </p>

                      <div className="flex items-center gap-1 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item.year}</span>
                      </div>
                    </div>
                    {item.attempts > 0 && (
                      <div className="text-right text-xs">
                        <span className="text-green-600 font-medium">{item.bestScore ?? item.lastScore}%</span>
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
                          ? `/student/question/${item.id}/practice`
                          : `/student/exam/${item.id}/take`
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
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}

          {/* Pagination for questions if applicable */}
          {contentMode === "questions" && (nextPage || prevPage) && (
            <div className="flex justify-between mt-8 border-t pt-4 border-gray-200">
              <button
                onClick={handlePrevPage}
                disabled={!prevPage}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  !prevPage ? "text-gray-400" : "text-primary hover:bg-primary/5"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-gray-600 self-center">
                Page {currentPage} of {Math.ceil(totalCount / (apiQuestions.length || 1))}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!nextPage}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  !nextPage ? "text-gray-400" : "text-primary hover:bg-primary/5"
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
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
                <h2 className="text-2xl font-bold text-gray-900">{previewItem.title}</h2>
                <p className="text-gray-600">
                  {previewItem.subject} • {previewItem.topic}
                </p>
              </div>
              <button onClick={closePreview} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {contentMode === "questions" ? (
                // Question Preview
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Preview</h3>
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
                          {(previewItem as IndividualQuestion).options.map((option, idx) => (
                            <div key={idx} className="p-2 bg-white rounded border text-sm">
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Explanation</h4>
                          <p className="text-gray-700 text-sm">
                            {(previewItem as IndividualQuestion).explanation || "No explanation provided."}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Hints</h4>
                          <ul className="space-y-1">
                            {(previewItem as IndividualQuestion).hints.length ? (
                              (previewItem as IndividualQuestion).hints.map((hint, i) => (
                                <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  {hint}
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-600 text-sm">No hints available.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice This Question</h3>

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
                        href={`/student/question/${(previewItem as IndividualQuestion).id}/practice`}
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Overview</h3>

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

                      <p className="text-gray-700 mb-6">{(previewItem as ExamPaper).description}</p>

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
                          <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                        <ul className="space-y-3">
                          {(previewItem as ExamPaper).instructions.map((instruction, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Start?</h3>

                      {(previewItem as ExamPaper).attempts > 0 && (
                        <div className="mb-4 p-3 bg-green-100 rounded-lg">
                          <p className="text-sm text-green-700 font-medium">
                            Previous Attempts: {(previewItem as ExamPaper).attempts}
                          </p>
                          {("lastScore" in previewItem) && (
                            <p className="text-sm text-green-600">
                              Best Score: {(previewItem as ExamPaper).lastScore}%
                            </p>
                          )}
                        </div>
                      )}

                      <Link
                        href={`/student/exam/${(previewItem as ExamPaper).id}/take`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Play className="w-5 h-5" />
                        {(previewItem as ExamPaper).attempts > 0 ? "Retake Exam" : "Start Exam"}
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