import ExamResults from "@/components/student/exam-results";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

type Params = { id: string };

export default function ExamResultsPage({ params }: { params: Params }) {
  return (
    <DashboardLayout>
      <ExamResults paperId={params.id} />
    </DashboardLayout>
  );
}