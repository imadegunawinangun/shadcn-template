import { DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { auth } from "@clerk/nextjs/server"
import { getSiteConfig, updateSiteConfig } from "@workspace/database"
import { redirect } from "next/navigation"

export default async function AutomationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { orgId } = await auth()
  const { locale } = await params

  if (!orgId) {
    redirect("/dashboard")
  }

  const siteConfig = await getSiteConfig(orgId)

  // Pass configuration down to the client component
  const initialConfig = {
    aiProvider: siteConfig?.aiProvider || null,
    aiApiKey: siteConfig?.aiApiKey || null,
    aiBaseUrl: siteConfig?.aiBaseUrl || null,
    aiModelId: siteConfig?.aiModelId || null,
  }

  const handleSaveConfig = async (formData: any) => {
    "use server"
    const result = await updateSiteConfig(orgId, formData)
    return result
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={locale === "id" ? "Otomasi" : "Automation"}
        text={locale === "id" ? "Alat bertenaga AI dan pembuatan konten cerdas." : "AI-powered tools and smart generation."}
      />
      {/* <SmartWriter 
        workspaceId={orgId} 
        locale={locale}
        initialConfig={initialConfig} 
        onSaveConfig={handleSaveConfig} 
      /> */}
      <div className="mt-8 text-center p-8 bg-muted rounded-xl">
        <p>Modul AI SmartWriter sedang dalam tahap integrasi dengan ai-sdk baru.</p>
      </div>
    </DashboardShell>
  )
}

