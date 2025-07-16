"use client";

import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Grid3X3,
  List,
  Award,
  Target,
  FileText,
  Brain,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Loader,
} from "lucide-react";
import { PaperCard } from "../cards/PaperCard";
import { QuestionCard } from "../cards/QuestionCard";
import { userService } from "@/services/userService";

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
  question_type: string;
  options: Record<string, string>;
  difficulty: "easy" | "medium" | "hard";
  subject: Subject;
  grade: Grade;
};

type ApiResponse = {
  grade_info: Grade;
  questions: ApiQuestion[]; // Changed from 'results' to 'questions' to match actual response
};

type ViewMode = "questions" | "papers";
type LayoutMode = "list" | "grid";

export default function QuestionPool() {
  const [viewMode, setViewMode] = useState<ViewMode>("questions");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("list");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([
    "Mathematics",
  ]);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
  const [gradeInfo, setGradeInfo] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [subjectsList, setSubjectsList] = useState<
    { id: number; name: string }[]
  >([]);

  const difficulties = ["Easy", "Medium", "Hard"];
  const years = ["2024", "2023", "2022", "2021", "2020"];
  const paperTypes = ["Mock Exam", "Main Exam", "Practice Test", "Topic Quiz"];



  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const subjectId =
        selectedSubject !== "all" ? parseInt(selectedSubject) : undefined;
      const difficulty =
        selectedDifficulty !== "all"
          ? (selectedDifficulty.toLowerCase() as "easy" | "medium" | "hard")
          : undefined;

      const response = await userService.getGradeQuestions({
        subject_id: subjectId,
        difficulty: difficulty,
        page: currentPage,
      });

    const data = response.data as ApiResponse;
      setApiQuestions(data.questions || []); // Access the questions array
      setGradeInfo(data.grade_info);
      setTotalCount(data.questions?.length || 0);
      setNextPage(null); // Update these based on your pagination implementation
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
    // Initialize with empty array to avoid the mapping error
    setApiQuestions([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchQuestions();
  }, [selectedSubject, selectedDifficulty, currentPage]);


   const questions = (apiQuestions || []).map((q) => ({
  id: q.id,
  question: q.question_text,
  subject: q.subject.display_name,
  topic: q.subject.name,
  difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
  type: "Multiple Choice",
  options: Object.values(q.options),
  correctAnswer: 0, // We don't get this from API for security reasons
  attempts: 0,
  tags: [q.subject.name],
  estimatedTime: "3 mins",
  points: 5,
}));

  const questionPapers = [
    {
      id: 1,
      title: "Linear Algebra Fundamentals",
      subject: "Mathematics",
      topic: "Linear Algebra",
      difficulty: "Medium",
      year: "2024",
      type: "Practice Test",
      questions: 25,
      duration: "90 mins",
      attempts: 0,
      maxScore: 100,
      tags: ["Matrices", "Vectors", "Eigenvalues"],
      description:
        "Comprehensive test covering matrix operations, vector spaces, and linear transformations.",
    },
    {
      id: 2,
      title: "Calculus Mock Exam 2024",
      subject: "Mathematics",
      topic: "Calculus",
      difficulty: "Hard",
      year: "2024",
      type: "Mock Exam",
      questions: 30,
      duration: "120 mins",
      attempts: 1,
      maxScore: 120,
      lastScore: 85,
      tags: ["Derivatives", "Integrals", "Limits"],
      description: "Mock exam paper for calculus covering all major topics.",
    },
    {
      id: 3,
      title: "Algebra Basics Quiz",
      subject: "Mathematics",
      topic: "Algebra",
      difficulty: "Easy",
      year: "2024",
      type: "Topic Quiz",
      questions: 15,
      duration: "45 mins",
      attempts: 2,
      maxScore: 60,
      lastScore: 92,
      tags: ["Equations", "Polynomials", "Factoring"],
      description: "Basic algebra concepts and problem solving.",
    },
    {
      id: 4,
      title: "Mathematics Main Exam 2023",
      subject: "Mathematics",
      topic: "Mixed Topics",
      difficulty: "Hard",
      year: "2023",
      type: "Main Exam",
      questions: 40,
      duration: "180 mins",
      attempts: 0,
      maxScore: 200,
      tags: ["Algebra", "Calculus", "Geometry", "Statistics"],
      description:
        "Official main examination paper covering all mathematics topics.",
    },
    {
      id: 5,
      title: "Mechanics and Motion",
      subject: "Physics",
      topic: "Mechanics",
      difficulty: "Hard",
      year: "2024",
      type: "Practice Test",
      questions: 30,
      duration: "120 mins",
      attempts: 1,
      maxScore: 120,
      lastScore: 85,
      tags: ["Newton's Laws", "Kinematics", "Dynamics"],
      description:
        "Advanced mechanics problems including projectile motion and rotational dynamics.",
    },
    {
      id: 6,
      title: "Physics Mock Exam 2023",
      subject: "Physics",
      topic: "Mixed Topics",
      difficulty: "Medium",
      year: "2023",
      type: "Mock Exam",
      questions: 35,
      duration: "150 mins",
      attempts: 0,
      maxScore: 140,
      tags: ["Mechanics", "Electricity", "Waves", "Thermodynamics"],
      description: "Comprehensive physics mock exam covering multiple topics.",
    },
  ];

  const topics = {
    Mathematics: [
      "Algebra",
      "Calculus",
      "Geometry",
      "Statistics",
      "Linear Algebra",
    ],
    Physics: [
      "Mechanics",
      "Thermodynamics",
      "Electricity",
      "Waves",
      "Modern Physics",
    ],
    Chemistry: ["Organic", "Inorganic", "Physical", "Analytical"],
    Biology: ["Cell Biology", "Genetics", "Ecology", "Evolution", "Anatomy"],
    English: ["Grammar", "Literature", "Writing", "Reading Comprehension"],
  };

  const filteredPapers = questionPapers.filter((paper) => {
    return (
      (selectedSubject === "all" || paper.subject === selectedSubject) &&
      (selectedDifficulty === "all" ||
        paper.difficulty === selectedDifficulty) &&
      (selectedYear === "all" || paper.year === selectedYear) &&
      (selectedType === "all" || paper.type === selectedType) &&
      (searchQuery === "" ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  });

  const filteredQuestions = questions.filter((question) => {
    return (
      (selectedSubject === "all" || question.subject === selectedSubject) &&
      (selectedDifficulty === "all" ||
        question.difficulty === selectedDifficulty) &&
      (selectedTopic === "all" || question.topic === selectedTopic) &&
      (selectedType === "all" || question.type === selectedType) &&
      (searchQuery === "" ||
        question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  });

  // Group papers by subject for hierarchical view
  const groupedPapers = filteredPapers.reduce((acc, paper) => {
    if (!acc[paper.subject]) {
      acc[paper.subject] = {};
    }
    if (!acc[paper.subject][paper.topic]) {
      acc[paper.subject][paper.topic] = [];
    }
    acc[paper.subject][paper.topic].push(paper);
    return acc;
  }, {} as Record<string, Record<string, typeof questionPapers>>);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-accent/10 text-accent";
      case "Medium":
        return "bg-secondary/10 text-secondary";
      case "Hard":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
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
  };

  const toggleSubjectExpansion = (subject: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // const getTopicsForSubject = () => {
  //   if (selectedSubject === "all") return [];
  //   return topics[selectedSubject as keyof typeof topics] || [];
  // };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">
              Question Pool - {gradeInfo?.display_name}
            </h1>
            <p className="text-gray-600">
              Browse and practice with{" "}
              {viewMode === "questions" ? totalCount : filteredPapers.length}{" "}
              available
              {viewMode === "questions" ? " questions" : " papers"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Content Type Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("questions")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === "questions"
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-600"
                }`}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                Questions
              </button>
              <button
                onClick={() => setViewMode("papers")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === "papers"
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-600"
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Papers
              </button>
            </div>

            {/* View Layout Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLayoutMode("list")}
                className={`p-2 rounded text-sm font-medium transition-colors ${
                  layoutMode === "list"
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-2 rounded text-sm font-medium transition-colors ${
                  layoutMode === "grid"
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-600"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Enhanced Sidebar Filters */}
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
                  placeholder="Search papers, topics, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Quick Filters
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedSubject(subjectsList[0]?.id.toString() || "all");
                    setSelectedDifficulty("all");
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  📊 All {subjectsList[0]?.name} Questions
                </button>
                <button
                  onClick={() => {
                    setSelectedDifficulty("Easy");
                    setSelectedSubject("all");
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-secondary/5 text-secondary rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  🔰 Easy Questions Only
                </button>
                <button
                  onClick={() => {
                    setSelectedDifficulty("Hard");
                    setSelectedSubject("all");
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-accent/5 text-accent rounded-lg hover:bg-accent/10 transition-colors"
                >
                  🔥 Hard Questions
                </button>
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Subjects</option>
                {subjectsList.map((subject) => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Paper Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Types</option>
                {paperTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedSubject("all");
                setSelectedDifficulty("all");
                setSelectedYear("all");
                setSelectedType("all");
                setSearchQuery("");
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">
                Showing{" "}
                {viewMode === "questions"
                  ? filteredQuestions.length
                  : filteredPapers.length}
                {viewMode === "questions" ? " questions" : " papers"}
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
                <option>Duration</option>
                <option>Most Attempted</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading questions...</p>
              </div>
            </div>
          ) : viewMode === "questions" ? (
            // Questions View
            <>
              {layoutMode === "list" ? (
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      layoutMode="list"
                      getDifficultyColor={getDifficultyColor}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      layoutMode="grid"
                      getDifficultyColor={getDifficultyColor}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {(nextPage || prevPage) && (
                <div className="flex justify-between mt-8 border-t pt-4 border-gray-200">
                  <button
                    onClick={handlePrevPage}
                    disabled={!prevPage}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      !prevPage
                        ? "text-gray-400"
                        : "text-primary hover:bg-primary/5"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-sm text-gray-600 self-center">
                    Page {currentPage} of{" "}
                    {Math.ceil(totalCount / (apiQuestions.length || 1))}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!nextPage}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      !nextPage
                        ? "text-gray-400"
                        : "text-primary hover:bg-primary/5"
                    }`}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : // Papers View
          layoutMode === "list" ? (
            <div className="space-y-4">
              {Object.entries(groupedPapers).map(([subject, topics]) => (
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
                      <h3 className="text-lg font-semibold text-text">
                        {subject}
                      </h3>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {Object.values(topics).flat().length} papers
                      </span>
                    </div>
                  </button>

                  {expandedSubjects.includes(subject) && (
                    <div className="border-t border-gray-100">
                      {Object.entries(topics).map(([topic, papers]) => (
                        <div
                          key={topic}
                          className="p-4 border-b border-gray-50 last:border-b-0"
                        >
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {topic}
                            <span className="text-xs text-gray-500">
                              ({papers.length} papers)
                            </span>
                          </h4>
                          <div className="space-y-2">
                            {papers.map((paper) => (
                              <PaperCard
                                key={paper.id}
                                paper={paper}
                                layoutMode="list"
                                getDifficultyColor={getDifficultyColor}
                                getTypeIcon={getTypeIcon}
                              />
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
              {filteredPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  layoutMode="grid"
                  getDifficultyColor={getDifficultyColor}
                  getTypeIcon={getTypeIcon}
                />
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!loading &&
            ((viewMode === "questions" && filteredQuestions.length === 0) ||
              (viewMode === "papers" && filteredPapers.length === 0)) && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No {viewMode === "questions" ? "questions" : "papers"} found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
