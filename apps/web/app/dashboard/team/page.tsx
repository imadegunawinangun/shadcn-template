"use client"

import { useState } from "react"
import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { MemberList, WorkspaceSettings, Member } from "@workspace/users"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { navSections, currentUser } from "@/lib/navigation"
import { mockMembers } from "@/lib/mock-data"
import { toast } from "sonner"


export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [workspace, setWorkspace] = useState({
    name: "My Workspace",
    slug: "my-workspace"
  })

  const handleMemberAction = (member: Member, action: string) => {
    if (action === "add") {
      setMembers(prev => [...prev, member])
    } else if (action === "update") {
      setMembers(prev => prev.map(m => m.id === member.id ? member : m))
    } else if (action === "remove") {
      setMembers(prev => prev.filter(m => m.id !== member.id))
      toast.success(`Removed ${member.name}`)
    }
  }

  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Team" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading="Team Management"
          text="Manage your team members and workspace settings."
        />
        
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Workspace Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <MemberList 
              members={members} 
              onAction={handleMemberAction} 
            />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <WorkspaceSettings 
              defaultValues={workspace} 
              onUpdate={(data) => {
                setWorkspace(data)
                toast.success("Workspace settings updated")
              }} 
            />
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}

