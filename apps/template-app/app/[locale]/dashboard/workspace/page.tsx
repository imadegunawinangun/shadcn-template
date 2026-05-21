import { DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { getTeamMembers, getWorkspace, syncClerkOrgWithWorkspace, db, schema, eq } from "@workspace/database"
import { WorkspaceClient } from "./workspace-client"
import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function WorkspacePage() {
  const { orgId, orgRole, orgSlug } = await auth()
  const user = await getClerkUser()

  if (!user) {
    redirect("/sign-in")
  }

  // If the user has not selected an organization, redirect to selection page
  if (!orgId) {
    // In template-app, we might not have a /select-workspace page yet, 
    // but we can redirect to dashboard or show a message.
    redirect("/dashboard")
  }
  
  // Sync the current Clerk organization with our database
  const activeWorkspace = await syncClerkOrgWithWorkspace({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0]?.emailAddress || "",
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

  const [members, workspace, siteConfig, globalConfig] = await Promise.all([
    getTeamMembers(orgId),
    getWorkspace(orgId),
    db.query.siteConfig.findFirst({
      where: eq(schema.siteConfig.workspaceId, orgId)
    }),
    db.query.siteConfig.findFirst({
      where: eq(schema.siteConfig.workspaceId, "platform")
    })
  ])

  if (!workspace) {
    return <div>Workspace not found in database.</div>
  }

  // Combine workspace data with color from siteConfig
  const workspaceWithColor = {
    ...workspace,
    primaryColor: (siteConfig?.theme as any)?.customColor || null
  }

  const isAdmin = orgRole === "org:admin" || orgRole === "admin"

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${workspace.name} - Workspace`}
        text="Manage your workspace members and general settings."
      />
      <WorkspaceClient 
        initialMembers={members} 
        initialWorkspace={workspaceWithColor as any} 
        currentUserId={user.id}
        isAdmin={isAdmin}
        fallbackTheme={globalConfig?.theme}
      />
    </DashboardShell>
  )
}
