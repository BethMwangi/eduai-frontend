import ExamPaperView from "@/components/student/exam-paper-view"

interface ExamPaperPageProps {
  params: {
    id: string
  }
}

export default function ExamPaperPage({ params }: ExamPaperPageProps) {
  return <ExamPaperView paperId={params.id} />
}
