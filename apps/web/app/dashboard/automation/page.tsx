"use client"

import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"

// Client Components (Imported from main entry)
import { WorkflowManager, ExecutionLogViewer } from "@workspace/workflows"
import { WebhookManager } from "@workspace/webhooks"
import { ApiKeyManager } from "@workspace/api-keys"
import { ModelProviderForm } from "@workspace/settings"

// Server Actions (Imported directly from /actions which is "use server" and safe for client RPC)
import { getWorkflows, getWorkflowLogs } from "@workspace/workflows/actions"
import { getWebhooks, getWebhookDeliveries } from "@workspace/webhooks/actions"
import { getApiKeys, createApiKey, deleteApiKey } from "@workspace/api-keys/actions"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { navSections, currentUser } from "@/lib/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { Info, History, Cpu } from "lucide-react"

export default function AutomationPage() {
  const workspaceId = "default-workspace" 
  
  const [workflows, setWorkflows] = useState<any[]>([])
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [executionLogs, setExecutionLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function fetchData() {
      try {
        const [w, k, wh, d, el] = await Promise.all([
          getWorkflows(workspaceId),
          getApiKeys(workspaceId),
          getWebhooks(workspaceId),
          getWebhookDeliveries(workspaceId),
          getWorkflowLogs(workspaceId)
        ])
        setWorkflows(w)
        setApiKeys(k)
        setWebhooks(wh)
        setDeliveries(d)
        setExecutionLogs(el)
      } catch (error) {
        console.error("Failed to fetch automation data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateKey = async (name: string) => {
    startTransition(async () => {
      try {
        const newKey = await createApiKey(workspaceId, name)
        setApiKeys([newKey as any, ...apiKeys])
        toast.success("API Key created successfully")
      } catch (error) {
        toast.error("Failed to create API key")
      }
    })
  }

  const handleDeleteKey = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteApiKey(id)
        setApiKeys(apiKeys.filter(k => k.id !== id))
        toast.success("API Key deleted")
      } catch (error) {
        toast.error("Failed to delete API key")
      }
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout sections={navSections} user={currentUser}>
        <DashboardShell>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardShell>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout sections={navSections} user={currentUser}>
      <DashboardShell>
        <DashboardHeader
          heading="Automation Platform"
          text="Micro-Packages with True RPC Isolation."
        />

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex gap-4 items-start shadow-sm mb-6">
          <div className="p-2 bg-primary/10 rounded-xl text-primary"><Info className="h-5 w-5" /></div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary">RPC Isolation Mode v3.1</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sistem sekarang menggunakan pemisahan <b>RPC Entry Points</b>. 
              Kode database kini benar-benar terisolasi di server dan browser hanya menerima referensi fungsi (stubs).
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              AI Engine
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflows" className="space-y-4">
            <WorkflowManager workflows={workflows} workspaceId={workspaceId} />
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <ApiKeyManager keys={apiKeys} onCreate={handleCreateKey} onDelete={handleDeleteKey} />
          </TabsContent>
          
          <TabsContent value="webhooks" className="space-y-4">
            <WebhookManager webhooks={webhooks} workspaceId={workspaceId} deliveries={deliveries} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <ModelProviderForm workspaceId={workspaceId} showCardHeader={true} className="max-w-4xl" />
          </TabsContent>

          <TabsContent value="history">
            <ExecutionLogViewer logs={executionLogs} />
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}

