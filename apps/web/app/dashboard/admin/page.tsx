"use client"

import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { FeatureFlags } from "@workspace/admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { navSections, currentUser } from "@/lib/navigation"
import { mockFeatureFlags } from "@/lib/mock-data"

export default function AdminPage() {
  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Admin Console" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading="Admin Console"
          text="Internal tools for system management and troubleshooting."
        />
        
        <Tabs defaultValue="flags" className="space-y-6">
          <TabsList>
            <TabsTrigger value="flags">Feature Flags</TabsTrigger>
            <TabsTrigger value="impersonation">Impersonation</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flags" className="space-y-4">
            <FeatureFlags flags={mockFeatureFlags} />
          </TabsContent>

          
          <TabsContent value="impersonation" className="space-y-4 text-sm text-muted-foreground">
            User impersonation tools coming soon...
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4 text-sm text-muted-foreground">
            Maintenance mode controls coming soon...
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}
