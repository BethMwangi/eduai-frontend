"use client";

import { FC } from "react";

type FamilyProgressCardProps = {
  child: {
    id: number;
    first_name: string;
    grade: number;
    total_questions_attempted: number;
    total_correct_answers: number;
    current_streak_days: number;
  };
};

const FamilyProgressCard: FC<FamilyProgressCardProps> = ({ child }) => {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {child.first_name[0]}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-text">{child.first_name}</h3>
            <p className="text-sm text-gray-500">{child.grade}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-text">
            {Math.round(
              (child.total_correct_answers / (child.total_questions_attempted || 1)) *
                100
            )}%
          </p>
          <p className="text-xs text-gray-500">Average</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <p className="font-medium text-text">{child.total_questions_attempted}</p>
          <p className="text-gray-500">Questions</p>
        </div>
        <div>
          <p className="font-medium text-accent">{child.total_correct_answers}</p>
          <p className="text-gray-500">Correct</p>
        </div>
        <div>
          <p className="font-medium text-secondary">{child.current_streak_days}</p>
          <p className="text-gray-500">Streak</p>
        </div>
      </div>
    </div>
  );
};

export default FamilyProgressCard;
