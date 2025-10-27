"use client"
import { useState, useEffect } from "react";
import Link from "next/link"
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Play,
  Award,
  Target,
  Calendar,
  School,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/auth";
import { userService } from "@/services/userService";
import type { ExamPaperTaking } from "@/types/exams";
import { getDifficultyColor, getExamTypeColor } from "@/utils/colorUtils";



export default function ExamPaperView() {
  const { id } = useParams<{ id: string }>();
  const paperIdNum = Number(id);
  const { getValidAccessToken } = useAuth();

  const [paper, setPaper] = useState<ExamPaperTaking | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!id || Number.isNaN(paperIdNum)) {
      setErr("Invalid paper id.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await userService.getPaperForTaking(
          getValidAccessToken,
          paperIdNum
        );
        if (!cancelled) setPaper(data);
      } catch (error) {
        console.error("Failed", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [getValidAccessToken, id, paperIdNum]);


  return (
  
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
             {loading && <div className="text-gray-500">Loading paper…</div>}
              {err && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {err}
                </div>
              )}

              {!loading && paper && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${getExamTypeColor(paper.exam?.exam_type || "")} rounded-xl flex items-center justify-center`}>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {paper.exam.title} {paper.exam.year} - {paper.subject.display_name}
                        {paper.paper_code && ` ${paper.paper_code}`}
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <School className="w-4 h-4" />
                          {paper.exam.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {paper.exam.year}
                        </span>
                        {/* `is_official` is not in taking payload; add if you later include it */}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/student/exam-paper/${paperIdNum}/take`}>
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Exam
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!loading && paper && (
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Exam Info */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{paper.paper_questions.length}</div>
                        <div className="text-sm text-gray-600">Questions</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          {paper.duration_minutes ?? "N/A"}
                        </div>
                        <div className="text-sm text-gray-600">Minutes</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Award className="w-6 h-6 text-secondary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{paper.total_marks}</div>
                        <div className="text-sm text-gray-600">Total Marks</div>
                      </div>
                  
                    </div>
                  </div>

                  {/* Questions Preview */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions Overview</h2>
                    <div className="space-y-4">
                      {paper.paper_questions.slice(0, 3).map((pq) => (
                        <div key={pq.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{pq.order}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium line-clamp-2">
                              {pq.question.question_text}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pq.question.difficulty)}`}>
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
                      {paper.paper_questions.length > 5 && (
                        <div className="text-center py-4 text-gray-500">
                          ... and {paper.paper_questions.length - 5} more questions
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
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
                </div>
              </div>
            </div>
          )}
        </div>

  );
}