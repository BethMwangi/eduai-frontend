"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock, Flag, CheckCircle, Eye, EyeOff, Lightbulb, BookOpen, Target } from "lucide-react"

interface ExamInterfaceProps {
  examId: string
}

export default function ExamInterface({ examId }: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [showExplanation, setShowExplanation] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Mock exam data
  const exam = {
    id: Number.parseInt(examId),
    title: "Calculus Fundamentals Test",
    subject: "Mathematics",
    topic: "Calculus",
    difficulty: "Medium",
    duration: "90 mins",
    totalQuestions: 25,
    totalPoints: 100,
    instructions: [
      "Read all questions carefully before answering",
      "You can navigate between questions using the navigation panel",
      "Flag questions you want to review later",
      "You can change your answers before submitting",
      "Tips and explanations are available for study purposes",
    ],
    questions: [
      {
        id: 1,
        question: "Find the derivative of f(x) = 3x² + 2x - 1",
        type: "Multiple Choice",
        options: ["6x + 2", "6x - 2", "3x + 2", "6x + 1"],
        correctAnswer: 0,
        points: 4,
        explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-1) = 0",
        tips: ["Remember the power rule: d/dx(x^n) = nx^(n-1)", "The derivative of a constant is always 0"],
      },
      {
        id: 2,
        question: "Calculate the limit: lim(x→0) (sin x)/x",
        type: "Multiple Choice",
        options: ["1", "0", "∞", "undefined"],
        correctAnswer: 0,
        points: 6,
        explanation: "This is a standard limit that equals 1, often proven using L'Hôpital's rule",
        tips: [
          "This is a fundamental limit in calculus",
          "Can be proven using L'Hôpital's rule or geometric arguments",
        ],
      },
      {
        id: 3,
        question: "Find the integral of ∫(2x + 3)dx",
        type: "Multiple Choice",
        options: ["x² + 3x + C", "2x² + 3x + C", "x² + 3x", "2x + 3"],
        correctAnswer: 0,
        points: 4,
        explanation: "∫(2x + 3)dx = ∫2x dx + ∫3 dx = x² + 3x + C",
        tips: ["Remember to add the constant of integration C", "Integrate each term separately"],
      },
    ],
  }

  const currentQuestion = exam.questions[currentQuestionIndex]

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleSubmitExam()
    }
  }, [timeRemaining, isSubmitted])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isSubmitted) {
      setAnswers({ ...answers, [currentQuestionIndex]: answerIndex })
    }
  }

  const handleFlagQuestion = () => {
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex)
    } else {
      newFlagged.add(currentQuestionIndex)
    }
    setFlaggedQuestions(newFlagged)
  }

  const handleSubmitExam = () => {
    setIsSubmitted(true)
    // Here you would typically send the answers to your backend
    console.log("Exam submitted with answers:", answers)
  }

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined) return "answered"
    if (flaggedQuestions.has(index)) return "flagged"
    return "unanswered"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-100 text-green-600 border-green-200"
      case "flagged":
        return "bg-yellow-100 text-yellow-600 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const answeredCount = Object.keys(answers).length
  const flaggedCount = flaggedQuestions.size
  const unansweredCount = exam.questions.length - answeredCount

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/student/questions"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Exam
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-text">{exam.title}</h1>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                timeRemaining < 600 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
            </div>
            {!isSubmitted && (
              <button
                onClick={handleSubmitExam}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Question Navigation Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Progress Summary */}
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Answered:</span>
                  <span className="font-medium text-green-600">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Flagged:</span>
                  <span className="font-medium text-yellow-600">{flaggedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Remaining:</span>
                  <span className="font-medium text-gray-600">{unansweredCount}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round((answeredCount / exam.questions.length) * 100)}% Complete
                </p>
              </div>
            </div>

            {/* Question Grid */}
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all ${
                      currentQuestionIndex === index
                        ? "border-primary bg-primary text-white"
                        : `${getStatusColor(getQuestionStatus(index))} hover:border-primary`
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded" />
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded" />
                  <span className="text-gray-600">Flagged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded" />
                  <span className="text-gray-600">Unanswered</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const nextUnanswered = exam.questions.findIndex((_, index) => answers[index] === undefined)
                    if (nextUnanswered !== -1) setCurrentQuestionIndex(nextUnanswered)
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Next Unanswered
                </button>
                <button
                  onClick={() => {
                    const nextFlagged = Array.from(flaggedQuestions)[0]
                    if (nextFlagged !== undefined) setCurrentQuestionIndex(nextFlagged)
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  Review Flagged
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Question Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {currentQuestion.points} points
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                    {currentQuestion.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTips(!showTips)}
                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                      showTips ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showTips ? "Hide Tips" : "Show Tips"}
                  </button>
                  <button
                    onClick={handleFlagQuestion}
                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                      flaggedQuestions.has(currentQuestionIndex)
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    {flaggedQuestions.has(currentQuestionIndex) ? "Unflag" : "Flag"}
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-text mb-6">{currentQuestion.question}</h2>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestionIndex] === index
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          answers[currentQuestionIndex] === index ? "border-primary bg-primary" : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestionIndex] === index && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} of {exam.questions.length}
                </span>
                <button
                  onClick={() => setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tips Section */}
            {showTips && (
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Study Tips
                </h3>
                <ul className="space-y-2">
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-yellow-700">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Study Mode:</strong> Tips and explanations are available to help you learn. In a real
                    exam, these would not be accessible.
                  </p>
                </div>
              </div>
            )}

            {/* Explanation (Study Mode) */}
            {showExplanation && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-800">Explanation</h3>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    {showExplanation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-blue-700">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Exam Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Your answers have been recorded. You answered {answeredCount} out of {exam.questions.length} questions.
              </p>
              <div className="space-y-3">
                <Link
                  href="/student/results"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  View Results
                </Link>
                <Link
                  href="/student/questions"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Back to Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
