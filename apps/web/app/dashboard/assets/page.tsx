"use client"

import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { MediaGallery } from "@workspace/assets"
import { navSections, currentUser } from "@/lib/navigation"
import { mockAssets } from "@/lib/mock-data"


export default function AssetsPage() {
  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Media Library" }]}
      isFullWidth
    >

      <DashboardShell>
        <DashboardHeader
          heading="Media Library"
          text="Upload and manage your images, videos, and documents."
        />
        <MediaGallery assets={mockAssets} />

      </DashboardShell>
    </DashboardLayout>
  )
}
