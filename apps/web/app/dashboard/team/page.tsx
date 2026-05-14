import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { getTeamMembers, getWorkspace, syncClerkOrgWithWorkspace } from "@workspace/database"
import { TeamClient } from "./team-client"
import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function TeamPage() {
  const { orgId, orgRole, orgSlug } = await auth()
  const user = await getClerkUser()

  if (!user) {
    redirect("/sign-in")
  }

  // If the user has not selected an organization, redirect to selection page
  if (!orgId) {
    redirect("/select-workspace")
  }
  
  // Sync the current Clerk organization with our database
  const activeWorkspace = await syncClerkOrgWithWorkspace({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0].emailAddress,
    image: user.imageUrl
  }, {
    id: orgId,
    name: "Workspace", // Will be updated by sync function from Clerk API
    slug: orgSlug || orgId,
    role: orgRole || "member"
  })

  if (!activeWorkspace) {
    return <div>Failed to sync workspace.</div>
  }

  const [members, workspace] = await Promise.all([
    getTeamMembers(orgId),
    getWorkspace(orgId)
  ])

  if (!workspace) {
    return <div>Workspace not found in database.</div>
  }

  const isAdmin = orgRole === "org:admin" || orgRole === "admin"

  return (
    <DashboardLayout 
      isAdmin={isAdmin} // Navigation resolved automatically inside DashboardLayout
      user={{
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : "User",
        email: user?.emailAddresses[0].emailAddress || "",
        image: user?.imageUrl || ""
      }}
      activeWorkspaceId={orgId}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Team" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading={`${workspace.name} - Team`}
          text="Manage your team members and workspace settings."
        />
        <TeamClient 
          initialMembers={members} 
          initialWorkspace={workspace} 
          currentUserId={user.id}
          isAdmin={isAdmin}
        />
      </DashboardShell>
    </DashboardLayout>
  )
}
