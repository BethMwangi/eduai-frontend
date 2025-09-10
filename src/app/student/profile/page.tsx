"use client";

import StudentProfile from "@/components/student/student-profile"
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/context/auth";


export default function StudentProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout user={user}>
      <StudentProfile user={user} />
    </DashboardLayout>
  );
}