"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ExamsBrowser from "@/components/student/exams-browser"

export default function ExamsPage() {
  return (
    <DashboardLayout>
      <ExamsBrowser />
    </DashboardLayout>
  );
}
