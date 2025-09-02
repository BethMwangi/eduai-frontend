import SubjectProgress from "@/components/student/subject-progress"

export default function SubjectProgressPage({ params }: { params: { subject: string } }) {
  return <SubjectProgress subject={params.subject} />
}
