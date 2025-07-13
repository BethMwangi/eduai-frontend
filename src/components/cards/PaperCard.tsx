import { BookOpen, Clock, Star, Play, Eye } from "lucide-react";
import Link from "next/link";

interface PaperItemProps {
  paper: {
    id: number;
    title: string;
    subject: string;
    topic: string;
    difficulty: string;
    year: string;
    type: string;
    questions: number;
    duration: string;
    attempts: number;
    lastScore?: number;
  };
  layoutMode: "list" | "grid";
  getDifficultyColor: (difficulty: string) => string;
  getTypeIcon: (type: string) => JSX.Element;
}

export function PaperCard({ paper, layoutMode, getDifficultyColor, getTypeIcon }: PaperItemProps) {
  if (layoutMode === "list") {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            {getTypeIcon(paper.type)}
            <span className="font-medium text-text">
              {paper.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(paper.difficulty)}`}>
              {paper.difficulty}
            </span>
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              {paper.year}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              {paper.type}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {paper.questions}Q
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {paper.duration}
            </span>
            {paper.attempts > 0 && (
              <span className="flex items-center gap-1 text-accent">
                <Star className="w-3 h-3" />
                Best: {paper.lastScore}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/student/paper/${paper.id}/preview`}
            className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-primary transition-colors text-sm"
          >
            <Eye className="w-3 h-3" />
            Preview
          </Link>
          <Link
            href={`/student/paper/${paper.id}/start`}
            className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
          >
            <Play className="w-3 h-3" />
            {paper.attempts > 0 ? "Retake" : "Start"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-1 text-sm">
            {paper.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            {paper.subject} • {paper.topic}
          </p>

          <div className="flex items-center gap-1 mb-2">
            <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(paper.difficulty)}`}>
              {paper.difficulty}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {paper.year}
            </span>
          </div>
        </div>
        {paper.attempts > 0 && (
          <div className="text-right text-xs">
            <span className="text-accent font-medium">
              {paper.lastScore}%
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{paper.questions} questions</span>
        <span>{paper.duration}</span>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/student/paper/${paper.id}/preview`}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors text-xs"
        >
          <Eye className="w-3 h-3" />
          Preview
        </Link>
        <Link
          href={`/student/paper/${paper.id}/start`}
          className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/90 transition-colors"
        >
          <Play className="w-3 h-3" />
          {paper.attempts > 0 ? "Retake" : "Start"}
        </Link>
      </div>
    </div>
  );
}