"use client"

import { DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { RotateCcw, Loader2 } from "lucide-react"
import { useOrganization, useAuth } from "@clerk/nextjs"
import { getSiteConfig, updateSiteConfig } from "@workspace/database"
import { toast } from "sonner"
import { useState, useTransition, useEffect } from "react"

export default function AppearancePage() {
  const { organization } = useOrganization()
  const { userId } = useAuth()
  const orgId = organization?.id || userId || "platform"
  const [isPending, startTransition] = useTransition()
  const [workspaceConfig, setWorkspaceConfig] = useState<any>(null)

  useEffect(() => {
    async function loadFallback() {
      const config = await getSiteConfig(orgId, null) // Level 1 (Org/Workspace)
      setWorkspaceConfig(config?.theme || null)
    }
    if (orgId && orgId !== "platform") loadFallback()
  }, [orgId])

  const handleReset = async () => {
    if (orgId === "platform") {
      toast.error("Please select an organization first")
      return
    }
    
    if (!confirm("Reset branding Aplikasi Website ke standar organisasi?")) return

    startTransition(async () => {
      const result = await updateSiteConfig(orgId, { theme: null }, "website")
      if (result.success) {
        toast.success("App branding reset successfully")
        window.location.reload()
      } else {
        toast.error("Failed to reset app branding")
      }
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Site Appearance"
        text="Manage the global appearance and branding of your entire site."
      />
      <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Global Theme Configuration</CardTitle>
            <CardDescription>
              Sesuaikan gaya visual khusus untuk aplikasi Website ini.
              Pengaturan ini akan menimpa standar organisasi (Level 2).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 text-sm">
              <p className="font-semibold text-orange-600 dark:text-orange-400 mb-1">Branding Priority: Level 2 (Site/App)</p>
              <p className="text-muted-foreground">
                Pengaturan ini khusus untuk aplikasi **Website** ini. 
                Ia menimpa standar Organisasi (Level 1).
              </p>
            </div>
            <div className="flex gap-2 max-w-md">
              <div className="flex-1">
                <ThemeCustomizer 
                  workspaceId={orgId} 
                  appId="website" 
                  fallbackConfig={workspaceConfig}
                />
              </div>
              <Button 
                variant="outline" 
                className="h-12 px-4 border-dashed hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                onClick={handleReset}
                disabled={isPending || orgId === "platform"}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
