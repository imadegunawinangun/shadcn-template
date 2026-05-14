"use client"

import { useState, useEffect } from "react"
import { DashboardLayout, DashboardHeader, DashboardShell } from "@workspace/dashboard"
import { MediaGallery, ImageKitMediaLibrary } from "@workspace/assets"
import { currentUser } from "@/lib/navigation"
import { mockAssets } from "@/lib/mock-data"
import { uploadToCloudinaryAction, getAvailableProvidersAction } from "./actions"
import { uploadToImageKitAction, listAssetsImageKitAction, renameAssetImageKitAction } from "./imagekit-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export default function AssetsPage() {
  const [provider, setProvider] = useState<"cloudinary" | "imagekit" | "none">("none")
  const [availableProviders, setAvailableProviders] = useState<{cloudinary: boolean, imagekit: boolean}>({
    cloudinary: false,
    imagekit: false
  })
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    if (provider === "none") return
    async function loadAssets() {
      setIsLoading(true)
      try {
        if (provider === "imagekit") {
          const data = await listAssetsImageKitAction()
          setAssets(data)
        } else {
          // Fallback to mock for cloudinary for now, or implement listAssetsCloudinaryAction
          setAssets(mockAssets)
        }
      } catch (error) {
        console.error("Failed to load assets:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAssets()
  }, [provider])

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
              text="Upload and manage your images, videos, and documents."
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

          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="gallery">Custom Gallery</TabsTrigger>
              <TabsTrigger value="imagekit">Official Widget</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="mt-6">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-sm text-muted-foreground animate-pulse">Loading assets from {provider}...</p>
                </div>
              ) : (
                <MediaGallery 
                  assets={assets} 
                  onUpload={async (source, name) => {
                    if (provider === "imagekit") {
                      const asset = await uploadToImageKitAction(source, name)
                      const newData = await listAssetsImageKitAction()
                      setAssets(newData)
                      return asset
                    } else if (provider === "cloudinary") {
                      const asset = await uploadToCloudinaryAction(source, name)
                      return asset
                    }
                    throw new Error("Upload not supported")
                  }}
                  onRename={async (id, newName, oldName) => {
                    if (provider === "imagekit") {
                      await renameAssetImageKitAction(id, newName, oldName)
                      const newData = await listAssetsImageKitAction()
                      setAssets(newData)
                    }
                  }}
                  onCopy={async (newUrl, originalName) => {
                    if (provider === "imagekit") {
                      const asset = await uploadToImageKitAction(newUrl, `edited-${originalName}`)
                      const newData = await listAssetsImageKitAction()
                      setAssets(newData)
                      return asset
                    }
                    throw new Error("Copy only supported for ImageKit")
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="imagekit" className="mt-6">
              {provider === "imagekit" ? (
                <ImageKitMediaLibrary 
                  publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''}
                  urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''}
                />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center border border-dashed rounded-xl bg-muted/20">
                  <p className="text-sm text-muted-foreground">ImageKit is not selected as the provider.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardShell>
    </DashboardLayout>
  )
}
