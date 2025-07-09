import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation"
import ParentDashboard from "@/components/dashboard/parent"

export default async function ParentDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "parent") {
    redirect("/login") 
  }

  return <ParentDashboard />
}
