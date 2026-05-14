import { auth } from "@clerk/nextjs/server"
import { getSiteConfig } from "@workspace/database"
import { ThemeApplier } from "@/components/theme-applier"

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { orgId } = await auth()
  
  return (
    <>
      <DashboardThemeApplier orgId={orgId || undefined} />
      {children}
    </>
  )
}

async function DashboardThemeApplier({ orgId }: { orgId?: string }) {
  if (!orgId) return null
  
  const config = await getSiteConfig(orgId)
  if (!config) return null
  
  return <ThemeApplier initialConfig={config.theme} />
}
