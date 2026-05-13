"use client"

import { useState } from "react"
import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { MediaGallery } from "@workspace/assets"
import { navSections, currentUser } from "@/lib/navigation"
import { mockAssets } from "@/lib/mock-data"
import { uploadToCloudinaryAction } from "./actions"
import { uploadToImageKitAction } from "./imagekit-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"

export default function AssetsPage() {
  const [provider, setProvider] = useState<"cloudinary" | "imagekit">("cloudinary")

  const handleUpload = provider === "cloudinary" ? uploadToCloudinaryAction : uploadToImageKitAction

  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Media Library" }]}
      isFullWidth
    >

      <DashboardShell>
        <div className="flex items-center justify-between">
          <DashboardHeader
            heading="Media Library"
            text="Upload and manage your images, videos, and documents."
          />
          <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border">
            <span className="text-xs font-medium text-muted-foreground ml-2">Storage Provider:</span>
            <Select value={provider} onValueChange={(val: any) => setProvider(val)}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cloudinary">Cloudinary</SelectItem>
                <SelectItem value="imagekit">ImageKit</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="h-6 text-[10px] uppercase">
              {provider === "cloudinary" ? "SDK v2" : "SDK v6"}
            </Badge>
          </div>
        </div>

        <MediaGallery 
          assets={mockAssets} 
          onUpload={handleUpload}
        />

      </DashboardShell>
    </DashboardLayout>
  )
}
