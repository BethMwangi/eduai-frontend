import ExamTakingInterface from "@/components/student/exam-taking-interface"
import DashboardLayout from "@/components/dashboard/dashboard-layout";

interface ExamTakePageProps {
  params: {
    id: string
  }
}

export default function ExamTakePage({ params }: ExamTakePageProps) {
  return (
    <DashboardLayout>
      <ExamTakingInterface paperId={params.id} />
    </DashboardLayout>
  );
}
