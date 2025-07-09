"use client"

import { useParams } from "next/navigation"
import PaperPreview from "@/components/student/paper-preview"

export default function PaperPreviewPage() {
  const params = useParams()
  const id = params?.id as string

  return <PaperPreview paperId={id} />
}
