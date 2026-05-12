"use client"

import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { ApiKeyManager } from "@workspace/automation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { navSections, currentUser } from "@/lib/navigation"
import { mockApiKeys } from "@/lib/mock-data"

export default function AutomationPage() {
  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Automation" }]}
    >
      <DashboardShell>
        <DashboardHeader
          heading="Automation & API"
          text="Connect your workspace with third-party services."
        />
        
        <Tabs defaultValue="api" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-4">
            <ApiKeyManager keys={mockApiKeys} />
          </TabsContent>

          
          <TabsContent value="webhooks" className="space-y-4 text-sm text-muted-foreground">
            Webhook configuration coming soon...
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4 text-sm text-muted-foreground">
            Workflow automation coming soon...
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}
