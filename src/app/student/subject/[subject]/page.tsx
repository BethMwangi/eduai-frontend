"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import SubjectProgress from "@/components/student/subject-progress";

function SubjectProgressPageContent() {
  const params = useParams();
  const subject = decodeURIComponent(params.subject as string);

  return <SubjectProgress subject={subject} />;
}

export default function SubjectProgressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubjectProgressPageContent />
    </Suspense>
  );
}