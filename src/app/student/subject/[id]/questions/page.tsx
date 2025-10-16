import SubjectQuestions from "@/components/student/subject-questions"

export default function SubjectQuestionsPage({ params }: { params: { id: string } }) {
  return <SubjectQuestions subjectId={params.id} />
}
