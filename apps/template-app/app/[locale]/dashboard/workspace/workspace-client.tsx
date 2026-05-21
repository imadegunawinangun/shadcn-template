"use client"

import { useState, useTransition, useEffect } from "react"
import { MemberList, WorkspaceSettings } from "@workspace/users"
import { ImageKitMediaLibrary } from "@workspace/assets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "sonner"
import { 
  inviteMember, 
  removeMember, 
  updateMemberRole, 
  updateMemberAppRoles,
  updateWorkspace,
  deleteWorkspace,
  updateSiteConfig,
  TeamMember 
} from "@workspace/database"
import { Loader2 } from "lucide-react"

interface WorkspaceClientProps {
  initialMembers: TeamMember[]
  initialWorkspace: {
    id: string
    name: string
    slug: string
    image?: string | null
    enabledApps?: string[]
  }
  currentUserId: string
  isAdmin: boolean
  fallbackTheme?: any
}

export function WorkspaceClient({ initialMembers, initialWorkspace, currentUserId, isAdmin, fallbackTheme }: WorkspaceClientProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [workspace, setWorkspace] = useState(initialWorkspace)
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMemberAction = async (member: any, action: string) => {
    startTransition(async () => {
      if (action === "add") {
        const result = await inviteMember(workspace.id, member.email, member.role, currentUserId)
        if (result.success) {
          setMembers(prev => [...prev, { ...member, id: Math.random().toString(), status: "Pending" }])
          toast.success("Invitation sent successfully")
        } else {
          toast.error(result.error || "Failed to send invitation")
        }
      } else if (action === "update") {
        const result = await updateMemberRole(workspace.id, member.id, member.role)
        if (result.success) {
          setMembers(prev => prev.map(m => m.id === member.id ? member : m))
          toast.success("Member role updated")
        } else {
          toast.error(result.error || "Failed to update role")
        }
      } else if (action === "remove") {
        const result = await removeMember(workspace.id, member.id, member.status === "Pending")
        if (result.success) {
          setMembers(prev => prev.filter(m => m.id !== member.id))
          toast.success(`Removed ${member.name || member.email}`)
        } else {
          toast.error(result.error || "Failed to remove member")
        }
      } else if (action === "updateAppRoles") {
        const result = await updateMemberAppRoles(workspace.id, member.id, member.appRoles)
        if (result.success) {
          setMembers(prev => prev.map(m => m.id === member.id ? member : m))
          toast.success("Member app roles updated")
        } else {
          toast.error(result.error || "Failed to update app roles")
        }
      }
    })
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="w-full h-11 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-[400px] bg-card/50 rounded-xl border border-border/50 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-xl">
          <div className="bg-card p-4 rounded-full shadow-lg border border-border animate-in zoom-in-95 duration-200">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </div>
      )}
      
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden bg-muted/50 p-1 rounded-xl h-11 border border-border/50 shadow-sm">
          <TabsTrigger value="members" className="rounded-lg px-6 data-[state=active]:shadow-sm">Members</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="settings" className="rounded-lg px-6 data-[state=active]:shadow-sm">Settings</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="members" className="space-y-4 outline-none animate-in fade-in-50 duration-500">
          <MemberList 
            members={members as any} 
            isAdmin={isAdmin}
            availableApps={workspace.enabledApps}
            onAction={handleMemberAction} 
          />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="settings" className="space-y-4 outline-none animate-in fade-in-50 duration-500">
            <WorkspaceSettings 
              defaultValues={workspace as any} 
              isAdmin={isAdmin}
              workspaceId={workspace.id}
              fallbackTheme={fallbackTheme}
              renderMediaLibrary={({ onSelect }) => (
                <ImageKitMediaLibrary 
                  publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''}
                  urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''}
                  onSelect={onSelect}
                />
              )}
              onUpdate={async (data) => {
                startTransition(async () => {
                  const result = await updateWorkspace(workspace.id, data)
                  if (result.success) {
                    setWorkspace({ ...workspace, ...data })
                    toast.success("Workspace settings updated")
                  } else {
                    toast.error(result.error || "Failed to update workspace")
                  }
                })
              }} 
              onResetBranding={async () => {
                startTransition(async () => {
                  const result = await updateSiteConfig(workspace.id, { theme: null })
                  if (result.success) {
                    toast.success("Workspace branding reset. Following Global Site settings.")
                    window.location.reload()
                  } else {
                    toast.error("Failed to reset branding")
                  }
                })
              }}
              onDelete={async () => {
                startTransition(async () => {
                  const result = await deleteWorkspace(workspace.id)
                  if (result.success) {
                    toast.success("Workspace deleted successfully")
                    window.location.href = "/dashboard"
                  } else {
                    toast.error((result as any).error || "Failed to delete workspace")
                  }
                })
              }}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
