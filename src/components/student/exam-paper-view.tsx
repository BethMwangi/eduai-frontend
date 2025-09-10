"use client"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  FileText,
  Play,
  Eye,
  Award,
  Target,
  Calendar,
  School,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/common/Button";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

interface ExamPaperViewProps {
  paperId: string
}

export default function ExamPaperView({ paperId }: ExamPaperViewProps) {

  // Mock data - replace with actual API call based on paperId
  const examPaper = {
    id: paperId,
    exam: {
      title: "KCSE",
      year: 2023,
      level: "SENIOR",
      exam_type: "MAIN",
      source: "KNEC",
      is_official: true,
    },
    subject: { name: "mathematics", display_name: "Mathematics" },
    paper_code: "Paper 1",
    duration_minutes: 150,
    total_marks: 100,
    questions_count: 25,
    paper_questions: [
      {
        id: "1",
        order: 1,
        marks: 4,
        question: {
          id: "q1",
          question_text: "Solve for x: 2x + 5 = 13",
          question_type: "multiple_choice",
          difficulty: "EASY",
          options: ["x = 3", "x = 4", "x = 5", "x = 6"],
          correct_answer: 1,
        },
      },
      {
        id: "2",
        order: 2,
        marks: 6,
        question: {
          id: "q2",
          question_text: "Find the derivative of f(x) = 3x² + 2x - 1",
          question_type: "multiple_choice",
          difficulty: "MEDIUM",
          options: ["6x + 2", "6x - 2", "3x + 2", "6x + 1"],
          correct_answer: 0,
        },
      },
      // Add more questions as needed
    ],
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-700"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700"
      case "HARD":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "MAIN":
        return "bg-red-500"
      case "MOCK":
        return "bg-blue-500"
      case "CAT":
        return "bg-green-500"
      case "REVISION":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout>
        {(user) => (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/student/exams"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Exams
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 ${getExamTypeColor(examPaper.exam.exam_type)} rounded-xl flex items-center justify-center`}
                >
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {examPaper.exam.title} {examPaper.exam.year} - {examPaper.subject.display_name}
                    {examPaper.paper_code && ` ${examPaper.paper_code}`}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <School className="w-4 h-4" />
                      {examPaper.exam.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {examPaper.exam.year}
                    </span>
                    {examPaper.exam.is_official && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Official
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/student/exam-paper/${paperId}/preview`}>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </Link>
                <Link href={`/student/exam-paper/${paperId}/take`}>
                  <Button className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Exam
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Exam Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{examPaper.questions_count}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{examPaper.duration_minutes || "N/A"}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Award className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{examPaper.total_marks}</div>
                    <div className="text-sm text-gray-600">Total Marks</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {examPaper.exam.level === "SENIOR" ? "Form 4" : "Class 8"}
                    </div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions Overview</h2>
                <div className="space-y-4">
                  {examPaper.paper_questions.slice(0, 5).map((pq) => (
                    <div key={pq.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{pq.order}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium line-clamp-2">{pq.question.question_text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pq.question.difficulty)}`}
                          >
                            {pq.question.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{pq.question.question_type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{pq.marks} marks</div>
                      </div>
                    </div>
                  ))}
                  {examPaper.paper_questions.length > 5 && (
                    <div className="text-center py-4 text-gray-500">
                      ... and {examPaper.paper_questions.length - 5} more questions
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href={`/student/exam-paper/${paperId}/take`} className="block">
                    <Button className="w-full flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Start Full Exam
                    </Button>
                  </Link>
                  <Link href={`/student/exam-paper/${paperId}/preview`} className="block">
                    <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      Preview Questions
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Exam Tips */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Exam Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Read all questions carefully before starting</li>
                  <li>• Manage your time effectively</li>
                  <li>• Start with questions you are confident about</li>
                  <li>• Review your answers before submitting</li>
                  <li>• Don&apos;t spend too much time on difficult questions</li>
                </ul>
              </div>

              {/* Related Papers */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Papers</h3>
                <div className="space-y-3">
                  <Link
                    href="/student/exam-paper/2"
                    className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Mathematics Paper 2</div>
                    <div className="text-sm text-gray-600">KCSE 2023 • 20 questions</div>
                  </Link>
                  <Link
                    href="/student/exam-paper/6"
                    className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Mathematics Paper 1</div>
                    <div className="text-sm text-gray-600">KCSE 2022 • 25 questions</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        )}
    </DashboardLayout>
  )
}
