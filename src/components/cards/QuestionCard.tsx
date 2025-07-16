import { Clock, Star, Play, Eye } from "lucide-react";
import Link from "next/link";
import { getSubjectColor } from "@/utils/colorUtils";

interface QuestionItemProps {
  question: {
    id: number;
    question: string;
    subject: string;
    topic: string;
    difficulty: string;
    type: string;
    estimatedTime: string;
    points: number;
    attempts: number;
    lastScore?: number;
  };
  layoutMode: "list" | "grid";
  getDifficultyColor: (difficulty: string) => string;
}

export function QuestionCard({
  question,
  layoutMode,
  getDifficultyColor,
}: QuestionItemProps) {
  if (layoutMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              {question.question}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {/* Subject with color from utility */}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${getSubjectColor(
                  question.subject
                )}`}
              >
                {question.subject}
              </span>

              <span className="text-gray-500">• {question.topic}</span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(
                  question.difficulty
                )}`}
              >
                {question.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {question.estimatedTime}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full">
              {question.points} points
            </span>
            {question.attempts > 0 && (
              <span className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4" />
                Best: {question.lastScore}%
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/student/question/${question.id}/preview`}
            className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-primary transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Link>
          <Link
            href={`/student/question/${question.id}/practice`}
            className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            Practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {question.question}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(
              question.difficulty
            )}`}
          >
            {question.difficulty}
          </span>
          <span className="text-xs text-gray-500">
            {question.subject} • {question.topic}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {question.estimatedTime}
        </span>
        <span>{question.points} points</span>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/student/question/${question.id}/preview`}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
        >
          <Eye className="w-3 h-3" />
          Preview
        </Link>
        <Link
          href={`/student/question/${question.id}/practice`}
          className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          <Play className="w-3 h-3" />
          Practice
        </Link>
      </div>
    </div>
  );
}
