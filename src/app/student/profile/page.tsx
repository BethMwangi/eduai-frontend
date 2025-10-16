"use client";

import StudentProfile from "@/components/student/student-profile"
import DashboardLayout from "@/components/dashboard/dashboard-layout";


export default function StudentProfilePage() {

  return (
    <DashboardLayout>
      <StudentProfile />
    </DashboardLayout>
  );
}