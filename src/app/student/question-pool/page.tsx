"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import QuestionPool from "@/components/student/question-pool";

export default function QuestionPoolPage() {
  return (
    <DashboardLayout>
      {() => (
        <div className="bg-gray-50 min-h-screen">
          <QuestionPool />
        </div>
      )}
    </DashboardLayout>
  );
}