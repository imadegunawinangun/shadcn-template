"use client"

import { useState, useEffect } from "react"
import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { ImageKitMediaLibrary } from "@workspace/assets"
import { currentUser } from "@/lib/navigation"
import { getAvailableProvidersAction } from "./actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"

export default function AssetsPage() {
  const [provider, setProvider] = useState<"cloudinary" | "imagekit" | "none">("none")
  const [availableProviders, setAvailableProviders] = useState<{cloudinary: boolean, imagekit: boolean}>({
    cloudinary: false,
    imagekit: false
  })

  useEffect(() => {
    async function checkProviders() {
      const available = await getAvailableProvidersAction()
      setAvailableProviders(available)
      
      // Pilih provider pertama yang tersedia secara otomatis
      if (available.imagekit) setProvider("imagekit")
      else if (available.cloudinary) setProvider("cloudinary")
    }
    checkProviders()
  }, [])

  return (
    <DashboardLayout 
      user={currentUser}
      breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Media Library" }]}
      isFullWidth
    >
      <DashboardShell>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <DashboardHeader
              heading="Media Library"
              text="Upload and manage your images, videos, and documents using the official ImageKit Media Library."
            />
            <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border">
              <span className="text-xs font-medium text-muted-foreground ml-2">Storage Provider:</span>
              <Select 
                value={provider} 
                onValueChange={(val: any) => setProvider(val)}
                disabled={!availableProviders.cloudinary && !availableProviders.imagekit}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {availableProviders.cloudinary && <SelectItem value="cloudinary">Cloudinary</SelectItem>}
                  {availableProviders.imagekit && <SelectItem value="imagekit">ImageKit</SelectItem>}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="h-6 text-[10px] uppercase">
                {provider === "cloudinary" ? "SDK v2" : "SDK v6"}
              </Badge>
            </div>
          </div>

          <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden animate-in fade-in duration-500">
            {provider === "imagekit" ? (
              <ImageKitMediaLibrary 
                publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''}
              />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center border border-dashed rounded-xl bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  {provider === "cloudinary" ? "Cloudinary widget integration is not available in this view." : "No storage provider is currently configured."}
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </DashboardLayout>
  )
}
