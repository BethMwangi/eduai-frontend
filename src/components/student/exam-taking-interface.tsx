"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Flag, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/common/Button";
import { Progress } from "@/components/ui/progress"

interface ExamTakingInterfaceProps {
  paperId: string
}

export default function ExamTakingInterface({ paperId }: ExamTakingInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(150 * 60) // 150 minutes in seconds
  const [showTips, setShowTips] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock exam data
  const examPaper = {
    id: paperId,
    exam: { title: "KCSE", year: 2023, source: "KNEC" },
    subject: { display_name: "Mathematics" },
    paper_code: "Paper 1",
    duration_minutes: 150,
    total_marks: 100,
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
          explanation: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
          tips: "Remember to perform the same operation on both sides of the equation.",
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
          explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-1) = 0. So f'(x) = 6x + 2",
          tips: "Use the power rule: d/dx(xⁿ) = nxⁿ⁻¹. The derivative of a constant is 0.",
        },
      },
      // Add more questions as needed
    ],
  }

  const currentQuestion = examPaper.paper_questions[currentQuestionIndex]
  const totalQuestions = examPaper.paper_questions.length
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / totalQuestions) * 100

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeRemaining < 300) return "text-red-600" // Less than 5 minutes
    if (timeRemaining < 900) return "text-yellow-600" // Less than 15 minutes
    return "text-green-600"
  }

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }))
  }

  const handleFlagQuestion = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id)
      } else {
        newSet.add(currentQuestion.id)
      }
      return newSet
    })
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push(`/student/exam-paper/${paperId}/results`)
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const getQuestionStatus = (questionId: string) => {
    if (answers[questionId] !== undefined) return "answered"
    if (flaggedQuestions.has(questionId)) return "flagged"
    return "unanswered"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white"
      case "flagged":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Question Navigation Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {examPaper.exam.title} {examPaper.exam.year}
          </h2>
          <p className="text-sm text-gray-600">
            {examPaper.subject.display_name} {examPaper.paper_code}
          </p>

          {/* Timer */}
          <div
            className={`mt-4 p-3 rounded-lg border-2 ${timeRemaining < 300 ? "border-red-200 bg-red-50" : timeRemaining < 900 ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-4 h-4 ${getTimeColor()}`} />
              <span className="text-sm font-medium text-gray-700">Time Remaining</span>
            </div>
            <div className={`text-2xl font-bold ${getTimeColor()}`}>{formatTime(timeRemaining)}</div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Questions Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-5 gap-2 mb-6">
            {examPaper.paper_questions.map((pq, index) => {
              const status = getQuestionStatus(pq.id)
              return (
                <button
                  key={pq.id}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    index === currentQuestionIndex ? "ring-2 ring-primary ring-offset-2" : ""
                  } ${getStatusColor(status)}`}
                >
                  {pq.order}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Flagged ({flaggedQuestions.size})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Not Answered ({totalQuestions - answeredCount})</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-2">
            <Button
              variant="outlined"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => {
                const nextUnanswered = examPaper.paper_questions.findIndex(
                  (pq, index) => index > currentQuestionIndex && !answers[pq.id],
                )
                if (nextUnanswered !== -1) goToQuestion(nextUnanswered)
              }}
            >
              Next Unanswered
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => {
                const flaggedArray = Array.from(flaggedQuestions)
                if (flaggedArray.length > 0) {
                  const flaggedIndex = examPaper.paper_questions.findIndex((pq) => pq.id === flaggedArray[0])
                  if (flaggedIndex !== -1) goToQuestion(flaggedIndex)
                }
              }}
            >
              Review Flagged
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 border-t border-gray-200">
          <Button
            onClick={handleSubmitExam}
            disabled={isSubmitting}
            className="w-full"
            variant={answeredCount === totalQuestions ? "primary" : "outlined"}
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </Button>
          {answeredCount < totalQuestions && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {totalQuestions - answeredCount} questions remaining
            </p>
          )}
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col">
        {/* Question Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Question {currentQuestion.order} of {totalQuestions}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentQuestion.marks} marks • {currentQuestion.question.difficulty}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                size="sm"
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2"
              >
                {showTips ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showTips ? "Hide Tips" : "Show Tips"}
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={handleFlagQuestion}
                className={`flex items-center gap-2 ${
                  flaggedQuestions.has(currentQuestion.id) ? "bg-yellow-100 text-yellow-700" : ""
                }`}
              >
                <Flag className="w-4 h-4" />
                {flaggedQuestions.has(currentQuestion.id) ? "Unflag" : "Flag"}
              </Button>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Question Text */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.question.question_text}</h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      answers[currentQuestion.id] === index
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === index
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion.id] === index && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            {showTips && currentQuestion.question.tips && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Study Tip</h3>
                </div>
                <p className="text-blue-800">{currentQuestion.question.tips}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outlined"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>

            <Button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
