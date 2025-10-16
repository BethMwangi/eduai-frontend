"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Play,
  Eye,
  Filter,
  Target,
  Award,
  Brain,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { getDifficultyColor } from "@/utils/colorUtils";

export default function QuestionsBrowser() {
  const [viewMode, setViewMode] = useState<"questions" | "papers">("questions");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
  ];
  const difficulties = ["Easy", "Medium", "Hard"];
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
  const questionTypes = [
    "Multiple Choice",
    "True/False",
    "Short Answer",
    "Essay",
  ];

  // Mock questions data
  const questions = [
    {
      id: 1,
      question: "Find the derivative of f(x) = 3x² + 2x - 1",
      subject: "Mathematics",
      topic: "Calculus",
      difficulty: "Medium",
      type: "Multiple Choice",
      options: ["6x + 2", "6x - 2", "3x + 2", "6x + 1"],
      correctAnswer: 0,
      explanation:
        "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-1) = 0",
      attempts: 0,
      tags: ["derivatives", "power rule", "polynomials"],
      estimatedTime: "2 mins",
      points: 5,
    },
    {
      id: 2,
      question: "What is Newton's Second Law of Motion?",
      subject: "Physics",
      topic: "Mechanics",
      difficulty: "Easy",
      type: "Multiple Choice",
      options: ["F = ma", "F = mv", "F = ma²", "F = m/a"],
      correctAnswer: 0,
      explanation:
        "Newton's Second Law states that Force equals mass times acceleration (F = ma)",
      attempts: 1,
      lastScore: 100,
      tags: ["newton's laws", "force", "acceleration"],
      estimatedTime: "1 min",
      points: 3,
    },
    {
      id: 3,
      question: "Solve the quadratic equation: x² - 5x + 6 = 0",
      subject: "Mathematics",
      topic: "Algebra",
      difficulty: "Medium",
      type: "Multiple Choice",
      options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 2, -3"],
      correctAnswer: 0,
      explanation: "Factor: (x-2)(x-3) = 0, so x = 2 or x = 3",
      attempts: 2,
      lastScore: 80,
      tags: ["quadratic", "factoring", "algebra"],
      estimatedTime: "3 mins",
      points: 4,
    },
    {
      id: 4,
      question: "What is the molecular formula for glucose?",
      subject: "Chemistry",
      topic: "Organic",
      difficulty: "Easy",
      type: "Multiple Choice",
      options: ["C₆H₁₂O₆", "C₆H₆", "CH₄", "H₂O"],
      correctAnswer: 0,
      explanation:
        "Glucose is a simple sugar with the molecular formula C₆H₁₂O₆",
      attempts: 0,
      tags: ["glucose", "molecular formula", "carbohydrates"],
      estimatedTime: "1 min",
      points: 2,
    },
    {
      id: 5,
      question: "Calculate the limit: lim(x→0) (sin x)/x",
      subject: "Mathematics",
      topic: "Calculus",
      difficulty: "Hard",
      type: "Multiple Choice",
      options: ["1", "0", "∞", "undefined"],
      correctAnswer: 0,
      explanation:
        "This is a standard limit that equals 1, often proven using L'Hôpital's rule or geometric arguments",
      attempts: 0,
      tags: ["limits", "trigonometry", "calculus"],
      estimatedTime: "4 mins",
      points: 8,
    },
  ];

  // Mock exam papers data
  const examPapers = [
    {
      id: 1,
      title: "Calculus Fundamentals Test",
      subject: "Mathematics",
      topic: "Calculus",
      difficulty: "Medium",
      questions: 25,
      duration: "90 mins",
      totalPoints: 100,
      questionIds: [1, 5, 3], // Sample question IDs
      description:
        "Comprehensive test covering derivatives, integrals, and limits",
      attempts: 0,
      tags: ["derivatives", "integrals", "limits"],
    },
    {
      id: 2,
      title: "Physics Mechanics Quiz",
      subject: "Physics",
      topic: "Mechanics",
      difficulty: "Easy",
      questions: 15,
      duration: "45 mins",
      totalPoints: 60,
      questionIds: [2], // Sample question IDs
      description: "Basic mechanics concepts and problem solving",
      attempts: 1,
      lastScore: 85,
      tags: ["newton's laws", "kinematics", "dynamics"],
    },
  ];

  const filteredQuestions = questions.filter((question) => {
    const topicList =
      selectedSubject !== "all"
        ? topics[selectedSubject as keyof typeof topics] || []
        : [];
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

  const filteredPapers = examPapers.filter((paper) => {
    return (
      (selectedSubject === "all" || paper.subject === selectedSubject) &&
      (selectedDifficulty === "all" ||
        paper.difficulty === selectedDifficulty) &&
      (searchQuery === "" ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  });

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
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

  const getTopicsForSubject = () => {
    if (selectedSubject === "all") return [];
    return topics[selectedSubject as keyof typeof topics] || [];
  };

  return (
    <DashboardLayout>
      <>
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">
                {viewMode === "questions" ? "Question Bank" : "Exam Papers"}
              </h1>
              <p className="text-gray-600">
                {viewMode === "questions"
                  ? `Browse and practice ${filteredQuestions.length} individual questions`
                  : `Take ${filteredPapers.length} complete exam papers`}
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                  Exam Papers
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Filters Sidebar */}
          {showFilters && (
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
                      placeholder="Search questions, topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedTopic("all"); // Reset topic when subject changes
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topic Filter */}
                {selectedSubject !== "all" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="all">All Topics</option>
                      {getTopicsForSubject().map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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

                {/* Question Type Filter (only for questions view) */}
                {viewMode === "questions" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="all">All Types</option>
                      {questionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {viewMode === "questions" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedDifficulty("Easy");
                            setSelectedSubject("all");
                          }}
                          className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          🟢 Easy Questions Only
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDifficulty("Hard");
                            setSelectedSubject("all");
                          }}
                          className="w-full text-left px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          🔴 Challenge Mode (Hard)
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubject("Mathematics");
                            setSelectedDifficulty("all");
                          }}
                          className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          📊 Math Questions
                        </button>
                      </>
                    )}
                    {viewMode === "papers" && (
                      <Link
                        href="/student/exam/create-custom"
                        className="w-full text-left px-3 py-2 text-sm bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors block"
                      >
                        ✨ Create Custom Exam
                      </Link>
                    )}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedSubject("all");
                    setSelectedDifficulty("all");
                    setSelectedTopic("all");
                    setSelectedType("all");
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
            {viewMode === "questions" ? (
              /* Questions View */
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                            {question.subject}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            {question.topic}
                          </span>
                          <span
                            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {getDifficultyIcon(question.difficulty)}
                            {question.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                            {question.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2">
                          {question.question}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {question.estimatedTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {question.points} points
                          </span>
                          {question.attempts > 0 && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Award className="w-4 h-4" />
                              Best: {question.lastScore}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/student/question/${question.id}/preview`}
                          className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-primary transition-colors text-sm border border-gray-200 rounded-lg hover:border-primary"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Link>
                        <Link
                          href={`/student/question/${question.id}/practice`}
                          className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          <Play className="w-4 h-4" />
                          Practice
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Exam Papers View */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text mb-2">
                          {paper.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {paper.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {paper.subject}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                              paper.difficulty
                            )}`}
                          >
                            {paper.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Questions:</span>
                        <span className="font-medium">{paper.questions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{paper.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Points:</span>
                        <span className="font-medium">{paper.totalPoints}</span>
                      </div>
                      {paper.attempts > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Best Score:</span>
                          <span className="font-medium text-green-600">
                            {paper.lastScore}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/student/exam/${paper.id}/preview`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-gray-600 hover:text-primary transition-colors text-sm border border-gray-200 rounded-lg hover:border-primary"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Link>
                      <Link
                        href={`/student/exam/${paper.id}/take`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        {paper.attempts > 0 ? "Retake" : "Start"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {((viewMode === "questions" && filteredQuestions.length === 0) ||
              (viewMode === "papers" && filteredPapers.length === 0)) && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No {viewMode === "questions" ? "questions" : "exam papers"}{" "}
                  found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
