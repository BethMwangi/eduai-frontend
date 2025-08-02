"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb,
  Eye,
  EyeOff,
  RotateCcw,
  BookOpen,
  Target,
  Loader,
} from "lucide-react"
import DashboardLayout from "../dashboard/dashboard.layout";
import { userService } from "@/services/userService";

interface QuestionPracticeProps {
  questionId: string
}

export default function QuestionPractice({ questionId }: QuestionPracticeProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  interface Question {
    id: number;
    question_text: string;
    subject?: { display_name: string };
    topic?: { display_name: string };
    difficulty: string;
    question_type: string;
    options?: { [key: string]: string };
    correct_answer_index?: number;
    explanation?: string;
    detailed_explanation?: string;
    tips?: string[];
    related_concepts?: string[];
    estimated_time?: string;
    points?: number;
    attempts_count?: number;
    tags?: string[];
  }
  
    const [question, setQuestion] = useState<Question | null>(null)


  // Mock question data - in real app, fetch based on questionId
  // const question = {
  //   id: Number.parseInt(questionId),
  //   question: "Find the derivative of f(x) = 3x² + 2x - 1",
  //   subject: "Mathematics",
  //   topic: "Calculus",
  //   difficulty: "Medium",
  //   type: "Multiple Choice",
  //   options: ["6x + 2", "6x - 2", "3x + 2", "6x + 1"],
  //   correctAnswer: 0,
  //   explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-1) = 0. Therefore, f'(x) = 6x + 2.",
  //   detailedExplanation: `
  //     To find the derivative of f(x) = 3x² + 2x - 1, we apply the power rule to each term:
      
  //     1. For 3x²: The power rule states that d/dx(x^n) = nx^(n-1)
  //        So d/dx(3x²) = 3 × 2x^(2-1) = 6x
      
  //     2. For 2x: d/dx(2x) = 2 × 1 = 2
      
  //     3. For -1: The derivative of a constant is 0
      
  //     Therefore: f'(x) = 6x + 2 + 0 = 6x + 2
  //   `,
  //   tips: [
  //     "Remember the power rule: d/dx(x^n) = nx^(n-1)",
  //     "The derivative of a constant is always 0",
  //     "When differentiating, handle each term separately",
  //     "Don't forget to multiply by the coefficient",
  //   ],
  //   relatedConcepts: ["Power Rule", "Polynomial Derivatives", "Basic Differentiation"],
  //   estimatedTime: "2 mins",
  //   points: 5,
  //   attempts: 0,
  //   tags: ["derivatives", "power rule", "polynomials"],
  // }

    useEffect(() => {
    async function fetchQuestion() {
      try {
        setLoading(true);
        const response = await userService.getQuestionById(Number(questionId));
        setQuestion(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Failed to load the question. Please try again.");
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [questionId]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const handleSubmit = async () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true)
      setShowExplanation(true)

      try {
        // Record the attempt in the API
        await userService.recordQuestionAttempt({
          question_id: Number(questionId),
          selected_option: String.fromCharCode(65 + selectedAnswer), // Convert to A, B, C, etc.
          confidence: "medium", // You could add a confidence selector to the UI
          self_explanation: "", // Could be added as a text input in the UI
          asked_ai_help: showTips, // Track if user used the tips feature
        });
      } catch (err) {
        console.error("Error recording attempt:", err);
        // Consider showing an error message to the user
      }
    }
  }
  const handleReset = () => {
    setSelectedAnswer(null)
    setIsSubmitted(false)
    setShowExplanation(false)
    setShowTips(false)
  }
  const questionData = {
    id: question.id,
    question: question.question_text,
    subject: question.subject?.display_name || "Subject",
    topic: question.topic?.display_name || "Topic",
    difficulty: question.difficulty,
    type: question.question_type === "mcq" ? "Multiple Choice" : question.question_type,
    options: Object.values(question.options || {}),
    correctAnswer: question.correct_answer_index || 0,
    explanation: question.explanation || "No explanation provided.",
    detailedExplanation: question.detailed_explanation || "No detailed explanation available.",
    tips: question.tips || [],
    relatedConcepts: question.related_concepts || [],
    estimatedTime: question.estimated_time || "2 mins",
    points: question.points || 5,
    attempts: question.attempts_count || 0,
    tags: question.tags || [],
  };
 const isCorrect = selectedAnswer === questionData.correctAnswer

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-600"
      case "Medium":
        return "bg-yellow-100 text-yellow-600"
      case "Hard":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600">Loading question...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !question) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-lg">
            <h2 className="text-red-700 font-semibold text-xl mb-2">Error</h2>
            <p className="text-red-600">{error || "Question not found"}</p>
            <Link
              href="/student/questions"
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg"
            >
              Back to Questions
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
 

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/student/questions"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Questions
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-text">Question Practice</h1>
              <p className="text-gray-600">
                {questionData.subject} • {questionData.topic}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(questionData.difficulty)}`}>
                {questionData.difficulty}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {questionData.points} points
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">{question.type}</span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {formatTime(timeSpent)}
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
                    onClick={handleReset}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-text mb-6">{questionData.question}</h2>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !isSubmitted && setSelectedAnswer(index)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? isSubmitted
                          ? index === questionData.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-primary bg-primary/5"
                        : isSubmitted && index === questionData.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                      {isSubmitted && (
                        <div>
                          {index === questionData.correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : selectedAnswer === index ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Submit Answer
                </button>
              )}

              {/* Result */}
              {isSubmitted && (
                <div
                  className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <span className={`font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                    <span className="text-sm text-gray-600">Time: {formatTime(timeSpent)}</span>
                  </div>
                  {isCorrect && (
                    <p className="text-green-700 text-sm">Great job! You earned {questionData.points} points.</p>
                  )}
                  {!isCorrect && (
                    <p className="text-red-700 text-sm">
                      The correct answer is {String.fromCharCode(65 + questionData.correctAnswer)}:{" "}
                      {questionData.options[questionData.correctAnswer]}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text">Explanation</h3>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                  >
                    {showExplanation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 mb-4">{questionData.explanation}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Detailed Solution:</h4>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{questionData.detailedExplanation}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tips Section */}
            {showTips && (
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Study Tips
                </h3>
                <ul className="space-y-2">
                  {questionData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-yellow-700">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Related Concepts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {questionData.relatedConcepts.map((concept) => (
                      <span key={concept} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Question Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Question Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subject:</span>
                  <span className="font-medium text-text">{questionData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Topic:</span>
                  <span className="font-medium text-text">{questionData.topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(questionData.difficulty)}`}>
                    {questionData.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Time:</span>
                  <span className="font-medium text-text">{questionData.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Points:</span>
                  <span className="font-medium text-text">{questionData.points}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Spent:</span>
                  <span className="font-medium text-text">{formatTime(timeSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Attempts:</span>
                  <span className="font-medium text-text">{questionData.attempts + 1}</span>
                </div>
                {isSubmitted && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Result:</span>
                    <span className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/student/question/${Number.parseInt(questionId) + 1}/practice`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Target className="w-4 h-4" />
                  Next Question
                </Link>
                <Link
                  href="/student/questions"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse More
                </Link>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {questionData.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-sm rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
