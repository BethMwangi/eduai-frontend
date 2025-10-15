// src/components/student/exam-taking-interface.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth";
import { userService } from "@/services/userService";
import type { ExamPaperTaking, PaperQuestionForTaking } from "@/types/exams";

type Props = { paperId: string };

export default function ExamTakingInterface({ paperId }: Props) {
  const router = useRouter();
  const { getValidAccessToken } = useAuth();

  // Remote data
  const [paper, setPaper] = useState<ExamPaperTaking | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showTips, setShowTips] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<null | {
    status: string;
    total_questions: number;
    correct_answers: number;
    score_percent: number;
    time_spent: number;
  }>(null);

  // Load paper from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await userService.getPaperForTaking(
          getValidAccessToken,
          Number(paperId)
        );
        if (cancelled) return;
        setPaper(data);
        setTimeRemaining(Math.max(1, (data.duration_minutes ?? 150) * 60));
      } catch (e: unknown) {
        if (!cancelled)
          setErr(
            typeof e === "object" && e !== null && "message" in e
              ? (e as { message?: string }).message || "Failed to load exam."
              : "Failed to load exam."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getValidAccessToken, paperId]);

  // Countdown
  useEffect(() => {
    if (!paper) return;
    const t = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          void handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [paper]);

  const questions = paper?.paper_questions ?? [];
  const totalQuestions = questions.length;

  const currentQuestion: PaperQuestionForTaking | null = useMemo(
    () => (totalQuestions ? questions[currentQuestionIndex] : null),
    [questions, currentQuestionIndex, totalQuestions]
  );

  const normalizeOptions = (q: PaperQuestionForTaking) => {
    const opts = q.question.options;
    if (!opts) return [];
    return Array.isArray(opts)
      ? opts
      : Object.keys(opts)
          .sort()
          .map((k) => (opts as Record<string, string>)[k]);
  };

  const currentOptions = currentQuestion
    ? normalizeOptions(currentQuestion)
    : [];

  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const timeColor =
    timeRemaining < 300
      ? "text-red-600"
      : timeRemaining < 900
      ? "text-yellow-600"
      : "text-green-600";

  const handleAnswerSelect = async (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));

    try {
      await userService.recordQuestionAttempt(getValidAccessToken, {
        question_id: Number(currentQuestion.question.id),
        selected_option: String.fromCharCode(65 + optionIndex),
      });
    } catch (err) {
      console.error("Failed to record attempt:", err);
    }
  };

  const goTo = (idx: number) =>
    idx >= 0 && idx < totalQuestions && setCurrentQuestionIndex(idx);
  const next = () => goTo(currentQuestionIndex + 1);
  const prev = () => goTo(currentQuestionIndex - 1);

  const handleSubmitExam = async () => {
    if (!paper) return;
    setIsSubmitting(true);
    const totalTime = (paper.duration_minutes ?? 150) * 60;
    const timeSpent = totalTime - timeRemaining;

    const formattedAnswers: Record<number, number> = {};
    Object.entries(answers).forEach(([qid, idx]) => {
      formattedAnswers[Number(qid)] = idx;
    });

    try {
      const result = await userService.submitExam(
        getValidAccessToken,
        paper.id,
        formattedAnswers,
        timeSpent
      );
      setSubmissionResult(result);

      router.push(`/student/exam-paper/${paperId}/results`);
    } catch (error) {
      console.error("Failed to submit exam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading exam…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!paper || !currentQuestion)
    return <div className="p-6">No questions.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {paper.exam.title} {paper.exam.year}
          </h2>
          <p className="text-sm text-gray-600">
            {paper.subject.display_name} {paper.paper_code || ""}
          </p>

          <div
            className={`mt-4 p-3 rounded-lg border-2 ${
              timeRemaining < 300
                ? "border-red-200 bg-red-50"
                : timeRemaining < 900
                ? "border-yellow-200 bg-yellow-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-4 h-4 ${timeColor}`} />
              <span className="text-sm font-medium text-gray-700">
                Time Remaining
              </span>
            </div>
            <div className={`text-2xl font-bold ${timeColor}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>

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

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>Answered ({answeredCount})</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span>Flagged ({flagged.size})</span>
            </div> */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <span>Not Answered ({totalQuestions - answeredCount})</span>
            </div>
          </div>{" "}
          <div className="p-6 border-t border-gray-200">
            {answeredCount < totalQuestions && (
              <p className="text-md text-gray-500 mt-8 text-center">
                {totalQuestions - answeredCount} questions remaining
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Question {currentQuestion.order} of {totalQuestions}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentQuestion.marks} marks •{" "}
                {currentQuestion.question.difficulty}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={prev}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 bg-transparent border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                variant="outlined"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={next}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="flex items-center gap-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
              {currentQuestionIndex === totalQuestions - 1 && (
                <Button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {currentQuestion.question.question_text}
                </h2>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setShowTips((s) => !s)}
                  className={`flex items-center gap-2 ${
                    showTips
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  {showTips ? "Hide Tips" : "Show Tips"}
                </Button>
              </div>
              <div className="space-y-3">
                {currentOptions.map((option, idx) => {
                  const selected = answers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <span className="font-medium text-gray-700">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{String(option)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {showTips && currentQuestion.question.tips && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Study Tip</h3>
                </div>
                <p className="text-yellow-800">
                  {currentQuestion.question.tips}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
