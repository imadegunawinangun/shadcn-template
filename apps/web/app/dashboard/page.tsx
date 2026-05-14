import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const { orgId } = await auth()

  // If the user has an active organization, go to the team dashboard
  if (orgId) {
    redirect("/dashboard/team")
  }

  // Otherwise, force them to select or create an organization
  redirect("/select-workspace")
}
