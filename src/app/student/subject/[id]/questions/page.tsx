import SubjectQuestions from "@/components/student/subject-questions";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default async function SubjectQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <SubjectQuestions subjectId={id} />
    </DashboardLayout>
  );
}