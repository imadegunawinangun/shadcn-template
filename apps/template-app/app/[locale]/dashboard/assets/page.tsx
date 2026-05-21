import { DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { auth } from "@clerk/nextjs/server"
import { getSiteConfig } from "@workspace/database"
import { redirect } from "next/navigation"
import { AssetsClient } from "./assets-client"

export default async function AssetsPage() {
  const { orgId } = await auth()

  if (!orgId) {
    redirect("/dashboard")
  }

  const siteConfig = await getSiteConfig(orgId)

  // Use keys from database if available, otherwise fallback to process.env for local development convenience
  const initialConfig = {
    publicKey: siteConfig?.imagekitPublicKey || process.env.IMAGEKIT_PUBLIC_KEY || null,
    privateKey: siteConfig?.imagekitPrivateKey || process.env.IMAGEKIT_PRIVATE_KEY || null,
    urlEndpoint: siteConfig?.imagekitUrlEndpoint || process.env.IMAGEKIT_URL_ENDPOINT || null
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Media Library"
        text="Manage your workspace images and assets using ImageKit."
      />
      <AssetsClient workspaceId={orgId} initialConfig={initialConfig} />
    </DashboardShell>
  )
}
