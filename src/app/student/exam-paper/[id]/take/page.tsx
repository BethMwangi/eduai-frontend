import ExamTakingInterface from "@/components/student/exam-taking-interface"

interface ExamTakePageProps {
  params: {
    id: string
  }
}

export default function ExamTakePage({ params }: ExamTakePageProps) {
  return <ExamTakingInterface paperId={params.id} />
}
