"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  TrendingUp,
  Award,
  Target,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/auth";

interface ExamResultsProps {
  paperId: string;
}

interface QuestionResult {
  id: string;
  order: number;
  question_text: string;
  marks: number;
  difficulty: string;
  user_answer?: number;
  correct_answer: number;
  is_correct: boolean;
  is_attempted: boolean;
  options: string[];
}

export default function ExamResults({ paperId }: ExamResultsProps) {
  const router = useRouter();
  const { getValidAccessToken } = useAuth();

  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      const data = await userService.getExamResults(
        getValidAccessToken,
        paperId
      );
      setExamResults(data);
    };
    loadResults();
  }, [getValidAccessToken, paperId]);

  if (loading || !examResults) {
    return <div className="text-center py-12">Loading results...</div>;
  }

  const totalQuestions = examResults.question_results.length;
  const attemptedQuestions = examResults.question_results.filter(
    (q: any) => q.is_attempted
  ).length;
  const correctQuestions = examResults.question_results.filter(
    (q: any) => q.is_correct
  ).length;
  const incorrectQuestions = examResults.question_results.filter(
    (q: any) => q.is_attempted && !q.is_correct
  ).length;
  const unattemptedQuestions = totalQuestions - attemptedQuestions;

  const getGradeInfo = (percentage: number) => {
    if (percentage >= 90)
      return { grade: "A", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 80)
      return { grade: "A-", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 75)
      return { grade: "B+", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 70)
      return { grade: "B", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 65)
      return { grade: "B-", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 60)
      return { grade: "C+", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage >= 55)
      return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage >= 50)
      return { grade: "C-", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage >= 45)
      return { grade: "D+", color: "text-orange-600", bg: "bg-orange-100" };
    if (percentage >= 40)
      return { grade: "D", color: "text-orange-600", bg: "bg-orange-100" };
    return { grade: "D-", color: "text-red-600", bg: "bg-red-100" };
  };

  const gradeInfo = getGradeInfo(examResults.submission.percentage);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleRetakeExam = () => {
    router.push(`/student/exam-paper/${paperId}/take`);
  };

  const handleReviewQuestions = (type: "incorrect" | "unattempted" | "all") => {
    const params = new URLSearchParams({ review: type });
    router.push(`/student/exam-paper/${paperId}/review?${params.toString()}`);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard/student");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-full ${gradeInfo.bg} flex items-center justify-center`}
            >
              <Award className={`w-8 h-8 ${gradeInfo.color}`} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exam Completed!
          </h1>
          <p className="text-lg text-gray-600">
            {examResults.exam_paper.exam.title}{" "}
            {examResults.exam_paper.exam.year} -{" "}
            {examResults.exam_paper.subject.display_name}{" "}
            {examResults.exam_paper.paper_code}
          </p>
        </div>

        {/* Score Overview */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className={`px-6 py-3 rounded-full ${gradeInfo.bg}`}>
                  <span className={`text-3xl font-bold ${gradeInfo.color}`}>
                    {gradeInfo.grade}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-4xl font-bold text-gray-900">
                    {examResults.submission.total_score}/
                    {examResults.exam_paper.total_marks}
                  </div>
                  <div className="text-lg text-gray-600">
                    {examResults.submission.percentage}%
                  </div>
                </div>
              </div>
              <Progress
                value={examResults.submission.percentage}
                className="h-3 mb-4"
              />
              <p className="text-gray-600">
                Time taken:{" "}
                {formatTime(examResults.submission.time_taken_minutes)} of{" "}
                {formatTime(examResults.exam_paper.duration_minutes || 0)}
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {correctQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {incorrectQuestions}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-600">
                  {unattemptedQuestions}
                </div>
                <div className="text-sm text-gray-600">Unattempted</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {attemptedQuestions}
                </div>
                <div className="text-sm text-gray-600">Attempted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Questions by Difficulty:</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["EASY", "MEDIUM", "HARD"].map((difficulty) => {
                  const difficultyQuestions =
                    examResults.question_results.filter(
                      (q) => q.difficulty === difficulty
                    );
                  const correctInDifficulty = difficultyQuestions.filter(
                    (q) => q.is_correct
                  ).length;
                  const totalInDifficulty = difficultyQuestions.length;
                  const percentage =
                    totalInDifficulty > 0
                      ? (correctInDifficulty / totalInDifficulty) * 100
                      : 0;

                  return (
                    <div
                      key={difficulty}
                      className="text-center p-4 border rounded-lg"
                    >
                      <Badge
                        variant={
                          difficulty === "EASY"
                            ? "secondary"
                            : difficulty === "MEDIUM"
                            ? "default"
                            : "destructive"
                        }
                        className="mb-2"
                      >
                        {difficulty}
                      </Badge>
                      <div className="text-lg font-semibold">
                        {correctInDifficulty}/{totalInDifficulty}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round(percentage)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={handleRetakeExam}
            className="flex items-center gap-2 h-12"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Exam
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleReviewQuestions("incorrect")}
            className="flex items-center gap-2 h-12"
            disabled={incorrectQuestions === 0}
          >
            <XCircle className="w-4 h-4" />
            Review Incorrect ({incorrectQuestions})
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleReviewQuestions("unattempted")}
            className="flex items-center gap-2 h-12"
            disabled={unattemptedQuestions === 0}
          >
            <AlertCircle className="w-4 h-4" />
            Review Unattempted ({unattemptedQuestions})
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleReviewQuestions("all")}
            className="flex items-center gap-2 h-12"
          >
            <Eye className="w-4 h-4" />
            Review All Questions
          </Button>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button
            variant="outlined"
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 mx-auto bg-transparent"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
