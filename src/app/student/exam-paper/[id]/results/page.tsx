import ExamResults from "@/components/student/exam-results"

interface ExamResultsPageProps {
  params: {
    id: string
  }
}

export default function ExamResultsPage({ params }: ExamResultsPageProps) {
  return <ExamResults paperId={params.id} />
}
