"use client"

import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { ProfileSettings, AppearanceSettings, MediaSettings } from "@workspace/settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { navSections, currentUser } from "@/lib/navigation"


import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function SettingsPage() {
  const { orgId, isLoaded } = useAuth()
  
  if (isLoaded && !orgId) {
    redirect("/select-workspace")
  }

  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Settings" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading="Settings"
          text="Manage your account settings and preferences."
        />
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <AppearanceSettings workspaceId={orgId || undefined} />
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <MediaSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 text-sm text-muted-foreground">
            Notification preferences coming soon...
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}
