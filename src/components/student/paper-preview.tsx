"use client"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen, Star, Play, CheckCircle } from "lucide-react"
import DashboardLayout from "../dashboard/dashboard.layout"

interface PaperPreviewProps {
  paperId: string
}

export default function PaperPreview({ paperId }: PaperPreviewProps) {
  const user = {
    name: "Alex Smith",
    email: "alex.smith@email.com",
    role: "student",
    avatar: "AS",
  }

  // Mock data - in real app, fetch based on paperId
  const paper = {
    id: 1,
    title: "Linear Algebra Fundamentals",
    subject: "Mathematics",
    topic: "Linear Algebra",
    difficulty: "Medium",
    year: "2024",
    questions: 25,
    duration: "90 mins",
    maxScore: 100,
    attempts: 0,
    tags: ["Matrices", "Vectors", "Eigenvalues"],
    description: "Comprehensive test covering matrix operations, vector spaces, and linear transformations.",
    instructions: [
      "Read all questions carefully before starting",
      "You have 90 minutes to complete all 25 questions",
      "Each question carries equal marks",
      "There is no negative marking",
      "You can review and change answers before submitting",
      "Make sure you have a stable internet connection",
    ],
    syllabus: [
      "Matrix Operations and Properties",
      "Vector Spaces and Subspaces",
      "Linear Transformations",
      "Eigenvalues and Eigenvectors",
      "Determinants and Inverse Matrices",
      "Systems of Linear Equations",
    ],
    sampleQuestions: [
      {
        id: 1,
        question: "Find the determinant of the 3×3 matrix A = [[2, 1, 3], [0, 4, 1], [1, 2, 0]]",
        type: "Multiple Choice",
        options: ["A) -14", "B) 14", "C) -10", "D) 10"],
        difficulty: "Medium",
      },
      {
        id: 2,
        question: "If vectors u = (2, 3, 1) and v = (1, -1, 2), find u · v (dot product)",
        type: "Multiple Choice",
        options: ["A) 1", "B) 3", "C) -1", "D) 5"],
        difficulty: "Easy",
      },
      {
        id: 3,
        question: "Determine if the vectors (1, 2, 3), (2, 4, 6), and (1, 1, 1) are linearly independent",
        type: "Multiple Choice",
        options: [
          "A) Yes, they are linearly independent",
          "B) No, they are linearly dependent",
          "C) Cannot be determined",
          "D) Need more information",
        ],
        difficulty: "Hard",
      },
    ],
  }

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

  return (
    <DashboardLayout user={user}>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/student/question-pool"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Question Pool
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-text">{paper.title}</h1>
            <p className="text-gray-600">
              {paper.subject} • {paper.topic}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paper Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Paper Overview</h2>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{paper.subject}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{paper.topic}</span>
                <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(paper.difficulty)}`}>
                  {paper.difficulty}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{paper.year}</span>
              </div>

              <p className="text-gray-600 mb-6">{paper.description}</p>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Questions</span>
                  </div>
                  <div className="text-2xl font-bold text-text">{paper.questions}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                    <Clock className="w-5 h-5" />
                    <span>Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-text">{paper.duration}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                    <Star className="w-5 h-5" />
                    <span>Max Score</span>
                  </div>
                  <div className="text-2xl font-bold text-text">{paper.maxScore}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Instructions</h2>
              <ul className="space-y-3">
                {paper.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Syllabus Coverage */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Syllabus Coverage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paper.syllabus.map((topic, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Sample Questions</h2>
              <div className="space-y-6">
                {paper.sampleQuestions.map((question, index) => (
                  <div key={question.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3 font-medium">{question.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="p-2 bg-gray-50 rounded text-sm text-gray-600">
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Paper Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-text mb-4">Ready to Start?</h3>

              {paper.attempts > 0 && (
                <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm text-accent font-medium">Previous Attempts: {paper.attempts}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time Limit:</span>
                  <span className="font-medium text-text">{paper.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Questions:</span>
                  <span className="font-medium text-text">{paper.questions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Max Score:</span>
                  <span className="font-medium text-text">{paper.maxScore} points</span>
                </div>
              </div>

              <Link
                href={`/student/paper/${paper.id}/start`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                {paper.attempts > 0 ? "Retake Paper" : "Start Paper"}
              </Link>

              <p className="text-xs text-gray-500 text-center mt-3">
                Make sure you have a stable internet connection before starting
              </p>
            </div>

            {/* Performance History */}
            {paper.attempts > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text mb-4">Your Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Best Score:</span>
                    <span className="font-semibold text-accent">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Average Score:</span>
                    <span className="font-medium text-text">82%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Attempt:</span>
                    <span className="font-medium text-text">3 days ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
