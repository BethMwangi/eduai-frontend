"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  AlertCircle,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../dashboard/dashboard-layout";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/auth";
import {
  ApiQuestionDetail,
  QuestionPracticeProps,
  SequenceResponse,
} from "@/types/auth";
import { getDifficultyColor } from "@/utils/colorUtils";
import { formatTime } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"] as const;
type Letter = (typeof LETTERS)[number];

export default function QuestionPractice({
  questionId,
}: QuestionPracticeProps) {
  const { getValidAccessToken } = useAuth();
  const [question, setQuestion] = useState<ApiQuestionDetail | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confidence, setConfidence] = useState<"Sure" | "Not Sure">("Sure");
  const [selfExplanation, setSelfExplanation] = useState("");
  const [showConfidenceSelector, setShowConfidenceSelector] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!questionId) return;
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const subjectId = urlParams.get("subject_id")
          ? parseInt(urlParams.get("subject_id")!)
          : undefined;
        const difficulty = urlParams.get("difficulty") as
          | "easy"
          | "medium"
          | "hard"
          | undefined;
        const index = urlParams.get("index")
          ? parseInt(urlParams.get("index")!)
          : 1;

        let questionData: ApiQuestionDetail | null = null;
        let sequenceData: SequenceResponse | null = null;

        // Try to get question with sequence info if we have filters
        if (subjectId || difficulty) {
          try {
            sequenceData = await userService.getQuestionSequence(
              getValidAccessToken,
              {
                index: index || 1,
                subject_id: subjectId,
                difficulty,
              }
            );

            if (sequenceData.results && sequenceData.results.length > 0) {
              questionData = sequenceData.results[0];
            }
          } catch (error) {
            console.warn(
              "Sequence endpoint failed, falling back to individual question:",
              error
            );
          }
        }

        // Fallback to individual question fetch if sequence failed or no filters
        if (!questionData) {
          questionData = await userService.getQuestionById(
            getValidAccessToken,
            Number(questionId)
          );
        }

        setQuestion(questionData as ApiQuestionDetail);

        // Set navigation info if we have sequence data
        if (sequenceData) {
          setCurrentPosition(sequenceData.progress.current);
          setTotalQuestions(sequenceData.progress.total);
          setHasNext(sequenceData.has_next);
          setHasPrevious(sequenceData.has_prev);
        }

        console.log("🔍 DEBUG: Question data:", questionData);
        console.log("🔍 DEBUG: Sequence data:", sequenceData);
      } catch (e) {
        console.error("Failed to load question:", e);
        setError("Failed to load question.");
      } finally {
        setLoading(false);
      }
    })();
  }, [questionId, getValidAccessToken]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "Sure":
        return "bg-green-100 text-green-600 border-green-200";
      case "Not Sure":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Loading state
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

  // Error or no question
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

  // Safe fallback for topic
  const topicName =
    (question as ApiQuestionDetail & { topic?: { display_name?: string } })
      .topic?.display_name ??
    question.subject?.display_name ??
    "Topic";

  // FIXED: Build questionData with proper letter handling
  const questionData = {
    id: question.id,
    question: question.question_text,
    subject: question.subject?.display_name || "Subject",
    topic: topicName,
    difficulty: question.difficulty
      ? question.difficulty.charAt(0).toUpperCase() +
        question.difficulty.slice(1)
      : "Unknown",
    type:
      question.question_type?.toLowerCase() === "mcq"
        ? "Multiple Choice"
        : question.question_type || "Other",

    optionsList: LETTERS.map((k) => ({
      key: k,
      text: (question.options || {})[k],
    })).filter((o) => o.text),

    correctLetter: (question as ApiQuestionDetail & { correct_option?: string })
      .correct_option as Letter | undefined,

    explanation: question.explanation || "No explanation provided.",
    detailedExplanation:
      (question as ApiQuestionDetail & { detailed_explanation?: string })
        .detailed_explanation || "No detailed explanation available.",
    tips: (question as ApiQuestionDetail & { tips?: string[] }).tips || [],
    relatedConcepts:
      (question as ApiQuestionDetail & { related_concepts?: string[] })
        .related_concepts || [],
    estimatedTime:
      (question as ApiQuestionDetail & { estimated_time?: string })
        .estimated_time || "2 mins",
    points: (question as ApiQuestionDetail & { points?: number }).points ?? 5,
    // Use real attempt count from backend
    attempts: question.attempts_count ?? 0,
    tags: (question as ApiQuestionDetail & { tags?: string[] }).tags || [],
  };

  // derive index of the correct letter for UI highlighting
  const correctIndex = questionData.correctLetter
    ? questionData.optionsList.findIndex(
        (o) => o.key === questionData.correctLetter
      )
    : -1;

  const isCorrect =
    selectedLetter && questionData.correctLetter
      ? selectedLetter === questionData.correctLetter
      : false;

  const handleSubmit = async () => {
    if (!selectedLetter) return;

    setSubmitting(true);
    setSubmitError("");
    setIsSubmitted(true);
    setShowExplanation(true);

    try {
      const submitData = {
        question_id: Number(questionId),
        selected_option: selectedLetter,
        confidence: confidence,
        self_explanation: selfExplanation.trim() || undefined,
        asked_ai_help: showTips,
      };

      await userService.recordQuestionAttempt(getValidAccessToken, submitData);
    } catch (err) {
      console.error("❌ Error recording attempt:", err);
      setSubmitError("Failed to save your answer. Please try again.");

      setIsSubmitted(false);
      setShowExplanation(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedLetter(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setShowTips(false);
    setSubmitError("");
    setConfidence("Sure");
    setSelfExplanation("");
    setShowConfidenceSelector(false);
  };

  const goToNextQuestion = async () => {
    if (!hasNext) return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const subjectId = urlParams.get("subject_id")
        ? parseInt(urlParams.get("subject_id")!)
        : undefined;
      const difficulty = urlParams.get("difficulty") as
        | "easy"
        | "medium"
        | "hard"
        | undefined;
      const currentIndex = parseInt(urlParams.get("index") || "1");
      const nextIndex = currentIndex + 1;

      // Get the next question from the sequence API
      const nextSequence = await userService.getQuestionSequence(
        getValidAccessToken,
        {
          index: nextIndex,
          subject_id: subjectId,
          difficulty,
        }
      );

      if (nextSequence.results && nextSequence.results.length > 0) {
        const nextQuestionId = nextSequence.results[0].id;

        urlParams.set("index", nextIndex.toString());

        // Navigate to the next question using the correct route format
        router.push(
          `/student/question/${nextQuestionId}/practice?${urlParams.toString()}`
        );
      } else {
        console.log("No next question available");
      }
    } catch (error) {
      console.error("Failed to get next question:", error);
      // Fallback: try simple ID increment if sequence API fails
      const urlParams = new URLSearchParams(window.location.search);
      const currentIndex = parseInt(urlParams.get("index") || "1");
      const nextIndex = currentIndex + 1;
      const nextQuestionId = Number(questionId) + 1;

      urlParams.set("index", nextIndex.toString());
      router.push(
        `/student/question/${nextQuestionId}/practice?${urlParams.toString()}`
      );
    }
  };

  const goToPreviousQuestion = async () => {
    if (!hasPrevious) return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const subjectId = urlParams.get("subject_id")
        ? parseInt(urlParams.get("subject_id")!)
        : undefined;
      const difficulty = urlParams.get("difficulty") as
        | "easy"
        | "medium"
        | "hard"
        | undefined;
      const currentIndex = parseInt(urlParams.get("index") || "1");
      const prevIndex = Math.max(1, currentIndex - 1);

      // Get the previous question from the sequence API
      const prevSequence = await userService.getQuestionSequence(
        getValidAccessToken,
        {
          index: prevIndex,
          subject_id: subjectId,
          difficulty,
        }
      );

      if (prevSequence.results && prevSequence.results.length > 0) {
        const prevQuestionId = prevSequence.results[0].id;

        // Update URL parameters
        urlParams.set("index", prevIndex.toString());

        // Navigate to the previous question using the correct route format
        router.push(
          `/student/question/${prevQuestionId}/practice?${urlParams.toString()}`
        );
      } else {
        console.log("No previous question available");
      }
    } catch (error) {
      console.error("Failed to get previous question:", error);
      // Fallback: try simple ID decrement if sequence API fails
      const urlParams = new URLSearchParams(window.location.search);
      const currentIndex = parseInt(urlParams.get("index") || "1");
      const prevIndex = Math.max(1, currentIndex - 1);
      const prevQuestionId = Math.max(1, Number(questionId) - 1);

      urlParams.set("index", prevIndex.toString());
      router.push(
        `/student/question/${prevQuestionId}/practice?${urlParams.toString()}`
      );
    }
  };
  return (
    <DashboardLayout>
      <>
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side: Title and Question counter */}
            <div className="flex items-center gap-4">
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold text-text">
                  Question Practice
                </h1>
                {currentPosition && totalQuestions && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">
                      Question {currentPosition} of {totalQuestions}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousQuestion}
                disabled={!hasPrevious}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  hasPrevious
                    ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "border-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={goToNextQuestion}
                disabled={!hasNext}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  hasNext
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
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
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                      {questionData.type}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {formatTime(timeSpent)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTips((s) => !s)}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                        showTips
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
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

                <h2 className="text-xl font-semibold text-text mb-6">
                  {questionData.question}
                </h2>

                {/* FIXED: Answer Options using letter keys */}
                <div className="space-y-3 mb-6">
                  {questionData.optionsList.map((opt, index) => {
                    const isSelected = selectedLetter === opt.key;
                    const isAnswer = index === correctIndex;

                    return (
                      <button
                        key={opt.key}
                        onClick={() =>
                          !isSubmitted && setSelectedLetter(opt.key)
                        }
                        disabled={isSubmitted}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSubmitted
                            ? isAnswer
                              ? "border-green-500 bg-green-50"
                              : isSelected
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                            : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        } ${
                          isSubmitted ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {opt.key}. {opt.text}
                          </span>
                          {isSubmitted && (
                            <>
                              {isAnswer ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : isSelected ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                              ) : null}
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Enhanced Submit Section */}
                {!isSubmitted && selectedLetter && (
                  <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {/* Confidence Selector */}
                    <div>
                      <button
                        onClick={() =>
                          setShowConfidenceSelector(!showConfidenceSelector)
                        }
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        <span>How confident are you?</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(
                            confidence
                          )}`}
                        >
                          {confidence}
                        </span>
                      </button>

                      {showConfidenceSelector && (
                        <div className="mt-2 flex gap-2">
                          {["Sure", "Not Sure"].map((level) => (
                            <button
                              key={level}
                              onClick={() =>
                                setConfidence(level as "Sure" | "Not Sure")
                              }
                              className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                                confidence === level
                                  ? getConfidenceColor(level)
                                  : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Optional Self Explanation */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Explain your reasoning (optional):
                      </label>
                      <textarea
                        value={selfExplanation}
                        onChange={(e) => setSelfExplanation(e.target.value)}
                        placeholder="Why did you choose this answer?"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {/* Enhanced Submit Button */}
                {!isSubmitted && (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedLetter === null || submitting}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                )}

                {/* Submit Error */}
                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 text-sm">{submitError}</span>
                    <button
                      onClick={handleSubmit}
                      className="ml-auto px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Enhanced Result */}
                {isSubmitted && !submitting && (
                  <div
                    className={`p-4 rounded-lg ${
                      isCorrect
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {isCorrect ? (
                        <>
                          <Trophy className="w-6 h-6 text-green-500" />
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </>
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <span
                        className={`font-semibold ${
                          isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </span>
                      <span className="text-sm text-gray-600">
                        Time: {formatTime(timeSpent)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(
                          confidence
                        )}`}
                      >
                        {confidence}
                      </span>
                    </div>
                    {isCorrect && (
                      <div className="text-green-700 text-sm space-y-1">
                        <p>🎉 Great job! Correctly answered</p>
                      </div>
                    )}
                    {!isCorrect && (
                      <div className="text-red-700 text-sm space-y-1">
                        <p>
                          The correct answer is {questionData.correctLetter}:{" "}
                          {questionData.optionsList.find(
                            (o) => o.key === questionData.correctLetter
                          )?.text ?? "N/A"}
                        </p>
                        <p>
                          📊 Your attempt has been recorded for learning
                          analytics.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text">
                      Explanation
                    </h3>
                    <button
                      onClick={() => setShowExplanation((prev) => !prev)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                    >
                      {showExplanation ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 mb-4">
                      {questionData.explanation}
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Detailed Solution:
                      </h4>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {questionData.detailedExplanation}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips Section */}
              {showTips && questionData.tips.length > 0 && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Study Tips
                  </h3>
                  <ul className="space-y-2">
                    {questionData.tips.map((tip: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-yellow-700"
                      >
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  {questionData.relatedConcepts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        Related Concepts:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {questionData.relatedConcepts.map((concept: string) => (
                          <span
                            key={concept}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Question Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text mb-4">
                  Question Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subject:</span>
                    <span className="font-medium text-text">
                      {questionData.subject}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Topic:</span>
                    <span className="font-medium text-text">
                      {questionData.topic}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Difficulty:</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                        questionData.difficulty
                      )}`}
                    >
                      {questionData.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Est. Time:</span>
                    <span className="font-medium text-text">
                      {questionData.estimatedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Points:</span>
                    <span className="font-medium  px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {questionData.points} points
                    </span>
                  </div>
                  {currentPosition && totalQuestions && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Position:</span>
                      <span className="font-medium text-text">
                        {currentPosition} of {totalQuestions}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Progress */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text mb-4">
                  Your Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time Spent:</span>
                    <span className="font-medium text-text">
                      {formatTime(timeSpent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Previous Attempts:</span>
                    <span className="font-medium text-text">
                      {questionData.attempts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Attempt:</span>
                    <span className="font-medium text-text">
                      #{questionData.attempts + 1}
                    </span>
                  </div>
                  {isSubmitted && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Result:</span>
                        <span
                          className={`font-medium ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Confidence:</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(
                            confidence
                          )}`}
                        >
                          {confidence}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-text mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  {hasNext && (
                    <button
                      onClick={goToNextQuestion}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Target className="w-4 h-4" />
                      Next Question
                    </button>
                  )}
                  {hasPrevious && (
                    <button
                      onClick={goToPreviousQuestion}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous Question
                    </button>
                  )}
                  <Link
                    href="/student/question-pool"
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
              {questionData.tags.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {questionData.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-50 text-gray-600 text-sm rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
