"use client";

import { useParams } from "next/navigation";
import QuestionPractice from "@/components/student/question-practice";

export default function QuestionPracticePage() {
  const params = useParams();
  const id = params?.id as string;

  return <QuestionPractice questionId={id} />;
}
