"use client"

import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { AuditLogList } from "@workspace/security"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { navSections, currentUser } from "@/lib/navigation"
import { mockLogs } from "@/lib/mock-data"

export default function SecurityPage() {
  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Security" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading="Security & Compliance"
          text="Monitor security events and manage account protection."
        />
        
        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audit" className="space-y-4">
            <AuditLogList logs={mockLogs} />
          </TabsContent>

          
          <TabsContent value="sessions" className="space-y-4 text-sm text-muted-foreground">
            Session management coming soon...
          </TabsContent>

          <TabsContent value="2fa" className="space-y-4 text-sm text-muted-foreground">
            2FA configuration coming soon...
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}
