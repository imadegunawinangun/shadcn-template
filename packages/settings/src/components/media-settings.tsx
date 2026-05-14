"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { getSiteConfig, updateSiteConfig } from "@workspace/database"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const mediaSchema = z.object({
  imagekitPublicKey: z.string().optional(),
  imagekitPrivateKey: z.string().optional(),
  imagekitUrlEndpoint: z.string().optional(),
})

type MediaValues = z.infer<typeof mediaSchema>

export function MediaSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<MediaValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      imagekitPublicKey: "",
      imagekitPrivateKey: "",
      imagekitUrlEndpoint: "",
    },
  })

  useEffect(() => {
    async function loadConfig() {
      // In a real application, this ID would come from a workspace context
      const workspaceId = "default-workspace"
      const config = await getSiteConfig(workspaceId)
      if (config) {
        form.reset({
          imagekitPublicKey: config.imagekitPublicKey || "",
          imagekitPrivateKey: config.imagekitPrivateKey || "",
          imagekitUrlEndpoint: config.imagekitUrlEndpoint || "",
        })
      }
      setLoading(false)
    }
    loadConfig()
  }, [form])

  async function onSubmit(data: MediaValues) {
    setSaving(true)
    try {
      const workspaceId = "default-workspace"
      const result = await updateSiteConfig(workspaceId, {
        imagekitPublicKey: data.imagekitPublicKey,
        imagekitPrivateKey: data.imagekitPrivateKey,
        imagekitUrlEndpoint: data.imagekitUrlEndpoint,
      })

      if (result.success) {
        toast.success("Media settings updated successfully")
      } else {
        toast.error(result.error || "Failed to update settings")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <TypographyH3>Media & Storage</TypographyH3>
        <TypographyP className="text-muted-foreground">
          Configure your external storage providers and media settings.
        </TypographyP>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <div className="space-y-4">
          <TypographyP className="font-medium text-sm">ImageKit Configuration</TypographyP>
          
          <Controller
            name="imagekitPublicKey"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Public Key</FieldLabel>
                <Input {...field} id={field.name} placeholder="public_..." />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="imagekitPrivateKey"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Private Key</FieldLabel>
                <Input {...field} id={field.name} type="password" placeholder="private_..." />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <p className="text-[10px] text-muted-foreground mt-1">
                  Never shared with the client. Used for server-side operations.
                </p>
              </Field>
            )}
          />

          <Controller
            name="imagekitUrlEndpoint"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>URL Endpoint</FieldLabel>
                <Input {...field} id={field.name} placeholder="https://ik.imagekit.io/your_id" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Media Settings
        </Button>
      </form>
    </div>
  )
}
