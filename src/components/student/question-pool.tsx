"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"

export default function QuestionPool() {
  const [viewMode, setViewMode] = useState<"list" | "cards">("list")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>(["Mathematics"])


  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"]
  const difficulties = ["Easy", "Medium", "Hard"]
  const years = ["2024", "2023", "2022", "2021", "2020"]
  const paperTypes = ["Mock Exam", "Main Exam", "Practice Test", "Topic Quiz"]

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
      description: "Comprehensive test covering matrix operations, vector spaces, and linear transformations.",
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
      description: "Official main examination paper covering all mathematics topics.",
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
      description: "Advanced mechanics problems including projectile motion and rotational dynamics.",
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
  ]

  const filteredPapers = questionPapers.filter((paper) => {
    return (
      (selectedSubject === "all" || paper.subject === selectedSubject) &&
      (selectedDifficulty === "all" || paper.difficulty === selectedDifficulty) &&
      (selectedYear === "all" || paper.year === selectedYear) &&
      (selectedType === "all" || paper.type === selectedType) &&
      (searchQuery === "" ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  })

  // Group papers by subject for hierarchical view
  const groupedPapers = filteredPapers.reduce(
    (acc, paper) => {
      if (!acc[paper.subject]) {
        acc[paper.subject] = {}
      }
      if (!acc[paper.subject][paper.topic]) {
        acc[paper.subject][paper.topic] = []
      }
      acc[paper.subject][paper.topic].push(paper)
      return acc
    },
    {} as Record<string, Record<string, typeof questionPapers>>,
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-accent/10 text-accent"
      case "Medium":
        return "bg-secondary/10 text-secondary"
      case "Hard":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Mock Exam":
        return <FileText className="w-4 h-4" />
      case "Main Exam":
        return <Award className="w-4 h-4" />
      case "Practice Test":
        return <Target className="w-4 h-4" />
      case "Topic Quiz":
        return <BookOpen className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const toggleSubjectExpansion = (subject: string) => {
    setExpandedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Question Pool - Grade 10</h1>
            <p className="text-gray-600">Browse and practice with {filteredPapers.length} available question papers</p>
          </div>
          <div className="flex items-center gap-3">
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
        {/* Enhanced Sidebar Filters */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
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
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedSubject("Mathematics")
                    setSelectedType("all")
                    setSelectedDifficulty("all")
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  📊 All Math Papers
                </button>
                <button
                  onClick={() => {
                    setSelectedType("Mock Exam")
                    setSelectedSubject("all")
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-secondary/5 text-secondary rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  📝 Mock Exams Only
                </button>
                <button
                  onClick={() => {
                    setSelectedYear("2024")
                    setSelectedSubject("all")
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-accent/5 text-accent rounded-lg hover:bg-accent/10 transition-colors"
                >
                  📅 Latest Papers (2024)
                </button>
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
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

            {/* Paper Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paper Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
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
                setSelectedSubject("all")
                setSelectedDifficulty("all")
                setSelectedYear("all")
                setSelectedType("all")
                setSearchQuery("")
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
                Showing {filteredPapers.length} papers
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

          {/* Content based on view mode */}
          {viewMode === "list" ? (
            /* Hierarchical List View */
            <div className="space-y-4">
              {Object.entries(groupedPapers).map(([subject, topics]) => (
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
                      <h3 className="text-lg font-semibold text-text">{subject}</h3>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {Object.values(topics).flat().length} papers
                      </span>
                    </div>
                  </button>

                  {expandedSubjects.includes(subject) && (
                    <div className="border-t border-gray-100">
                      {Object.entries(topics).map(([topic, papers]) => (
                        <div key={topic} className="p-4 border-b border-gray-50 last:border-b-0">
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {topic}
                            <span className="text-xs text-gray-500">({papers.length} papers)</span>
                          </h4>
                          <div className="space-y-2">
                            {papers.map((paper) => (
                              <div
                                key={paper.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="flex items-center gap-2">
                                    {getTypeIcon(paper.type)}
                                    <span className="font-medium text-text">{paper.title}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(paper.difficulty)}`}
                                    >
                                      {paper.difficulty}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                      {paper.year}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                      {paper.type}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      {paper.questions}Q
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {paper.duration}
                                    </span>
                                    {paper.attempts > 0 && (
                                      <span className="flex items-center gap-1 text-accent">
                                        <Star className="w-3 h-3" />
                                        Best: {paper.lastScore}%
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/student/paper/${paper.id}/preview`}
                                    className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-primary transition-colors text-sm"
                                  >
                                    <Eye className="w-3 h-3" />
                                    Preview
                                  </Link>
                                  <Link
                                    href={`/student/paper/${paper.id}/start`}
                                    className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                                  >
                                    <Play className="w-3 h-3" />
                                    {paper.attempts > 0 ? "Retake" : "Start"}
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
            /* Compact Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-1 text-sm">{paper.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {paper.subject} • {paper.topic}
                      </p>

                      <div className="flex items-center gap-1 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(paper.difficulty)}`}>
                          {paper.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{paper.year}</span>
                      </div>
                    </div>
                    {paper.attempts > 0 && (
                      <div className="text-right text-xs">
                        <span className="text-accent font-medium">{paper.lastScore}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{paper.questions} questions</span>
                    <span>{paper.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/student/paper/${paper.id}/preview`}
                      className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </Link>
                    <Link
                      href={`/student/paper/${paper.id}/start`}
                      className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/90 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      {paper.attempts > 0 ? "Retake" : "Start"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No papers found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
