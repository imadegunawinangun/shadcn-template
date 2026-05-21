"use client"

import { useState, useTransition } from "react"
import { ImageKitMediaLibrary } from "@workspace/assets"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { updateSiteConfig } from "@workspace/database"
import { toast } from "sonner"
import { Loader2, Key, Link as LinkIcon, Settings2, ExternalLink } from "lucide-react"

interface AssetsClientProps {
  workspaceId: string
  initialConfig: {
    publicKey?: string | null
    privateKey?: string | null
    urlEndpoint?: string | null
  }
}

export function AssetsClient({ workspaceId, initialConfig }: AssetsClientProps) {
  const [config, setConfig] = useState(initialConfig)
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(!config.publicKey || !config.urlEndpoint)

  const [formData, setFormData] = useState({
    publicKey: config.publicKey || "",
    privateKey: config.privateKey || "",
    urlEndpoint: config.urlEndpoint || ""
  })

  const hasValidConfig = !!config.publicKey && !!config.urlEndpoint

  const handleSave = () => {
    if (!formData.publicKey || !formData.urlEndpoint) {
      toast.error("Public Key and URL Endpoint are required")
      return
    }

    startTransition(async () => {
      const result = await updateSiteConfig(workspaceId, {
        imagekitPublicKey: formData.publicKey,
        imagekitPrivateKey: formData.privateKey,
        imagekitUrlEndpoint: formData.urlEndpoint
      })

      if (result.success) {
        toast.success("ImageKit configuration saved successfully")
        setConfig({
          publicKey: formData.publicKey,
          privateKey: formData.privateKey,
          urlEndpoint: formData.urlEndpoint
        })
        setIsEditing(false)
      } else {
        toast.error("Failed to save configuration")
      }
    })
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl mt-8">
        <Card className="border-border/50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              ImageKit Integration Setup
            </CardTitle>
            <CardDescription className="flex flex-col gap-2">
              <span>Connect your ImageKit account to enable the media library. You can find these details in your ImageKit Developer options.</span>
              <a 
                href="https://imagekit.io/dashboard/developer/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline text-xs flex items-center w-fit"
              >
                Get your keys from ImageKit Dashboard <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Field>
              <FieldLabel>Public Key <span className="text-destructive">*</span></FieldLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input 
                  value={formData.publicKey}
                  onChange={e => setFormData({ ...formData, publicKey: e.target.value })}
                  className="pl-10 h-10" 
                  placeholder="public_..." 
                />
              </div>
            </Field>

            <Field>
              <FieldLabel>Private Key (Optional, for server operations)</FieldLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input 
                  type="password"
                  value={formData.privateKey}
                  onChange={e => setFormData({ ...formData, privateKey: e.target.value })}
                  className="pl-10 h-10" 
                  placeholder="private_..." 
                />
              </div>
            </Field>

            <Field>
              <FieldLabel>URL Endpoint <span className="text-destructive">*</span></FieldLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input 
                  value={formData.urlEndpoint}
                  onChange={e => setFormData({ ...formData, urlEndpoint: e.target.value })}
                  className="pl-10 h-10" 
                  placeholder="https://ik.imagekit.io/your_id" 
                />
              </div>
            </Field>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t py-3 flex justify-between">
            {hasValidConfig ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
            ) : (
              <div />
            )}
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
          <Settings2 className="h-4 w-4" />
          Settings
        </Button>
      </div>
      <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden animate-in fade-in duration-500">
        <ImageKitMediaLibrary
          publicKey={config.publicKey!}
          urlEndpoint={config.urlEndpoint!}
        />
      </div>
    </div>
  )
}
