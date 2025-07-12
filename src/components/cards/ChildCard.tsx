import { Eye } from "lucide-react";
import React from "react";

interface ChildCardProps {
  child: {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    age: number;
    grade: number;
    grade_name: string;
    overall_average_score: number;
    current_streak_days: number;
    total_subjects: number;
    total_questions_attempted: number;
    last_activity_date: string | null;
  };
  onViewDetail: (id: number) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onViewDetail }) => {
  const avatar = `${child.first_name[0]}${child.last_name[0]}`;
  const lastActive = child.last_activity_date
    ? new Date(child.last_activity_date).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{avatar}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text">{child.full_name}</h3>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">
              Grade: <span className="font-medium">{child.grade}</span>
            </span>
            <span className="text-sm text-gray-500">
              Age: <span className="font-medium">{child.age}</span>
            </span>
          </div>
        </div>
        <button
          className="p-2 text-gray-400 hover:text-primary transition-colors"
          onClick={() => onViewDetail(child.id)}
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-text">
            {child.overall_average_score}%
          </p>
          <p className="text-xs text-gray-500">Avg Score</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">
            {child.current_streak_days}
          </p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{child.total_subjects} subjects</span>
        <span>{child.total_questions_attempted} questions</span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Last active: {lastActive}</span>
        <div
          className={`w-2 h-2 rounded-full ${child.last_activity_date ? "bg-accent" : "bg-gray-300"}`}
        ></div>
      </div>
    </div>
  );
};

export default ChildCard;
