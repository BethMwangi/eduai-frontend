"use client"

import { useParams } from "next/navigation"
import ExamInterface from "@/components/student/exam-interface"

export default function ExamTakePage() {
  const params = useParams()
  const id = params?.id as string

  return <ExamInterface examId={id} />
}
