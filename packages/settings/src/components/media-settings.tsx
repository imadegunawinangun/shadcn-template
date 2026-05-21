"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card"
import { getSiteConfig, updateSiteConfig } from "@workspace/database"
import { toast } from "sonner"
import { Loader2, HardDrive, HelpCircle, Save } from "lucide-react"
import { ModelProviderForm } from "./model-provider"

const mediaSchema = z.object({
  imagekitPublicKey: z.string().optional(),
  imagekitPrivateKey: z.string().optional(),
  imagekitUrlEndpoint: z.string().optional(),
})

type MediaValues = z.infer<typeof mediaSchema>

interface MediaSettingsProps {
  workspaceId?: string
}

export function MediaSettings({ workspaceId = "default-workspace" }: MediaSettingsProps = {}) {
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
  }, [form, workspaceId])

  async function onSubmit(data: MediaValues) {
    setSaving(true)
    try {
      const result = await updateSiteConfig(workspaceId, {
        imagekitPublicKey: data.imagekitPublicKey,
        imagekitPrivateKey: data.imagekitPrivateKey,
        imagekitUrlEndpoint: data.imagekitUrlEndpoint,
      })

      if (result.success) {
        toast.success("ImageKit settings updated successfully")
      } else {
        toast.error(result.error || "Failed to update ImageKit settings")
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
        <TypographyH3 className="text-2xl font-bold tracking-tight">Integrations & API Settings</TypographyH3>
        <TypographyP className="text-muted-foreground text-sm">
          Manage integrations, external storage, and custom AI Engine configurations for your workspace.
        </TypographyP>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* ImageKit Settings Card */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="border border-border/50 bg-card/30 backdrop-blur-md transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <HardDrive className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">ImageKit Media Library</CardTitle>
                <CardDescription>
                  Configure your workspace custom ImageKit account for media assets & uploads.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="imagekitPublicKey"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Public Key</FieldLabel>
                      <Input {...field} id={field.name} placeholder="public_zHu0WU1XsnbE..." className="bg-background/50" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="imagekitUrlEndpoint"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>URL Endpoint</FieldLabel>
                      <Input {...field} id={field.name} placeholder="https://ik.imagekit.io/your_id" className="bg-background/50" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="imagekitPrivateKey"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Private Key</FieldLabel>
                    <Input {...field} id={field.name} type="password" placeholder="private_u52vpL/TTUu6..." className="bg-background/50" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
                      <HelpCircle className="h-3 w-3" />
                      Never shared with the client. Used strictly for server-side upload operations.
                    </p>
                  </Field>
                )}
              />

              <div className="pt-2">
                <Button type="submit" disabled={saving} className="shadow-md rounded-xl transition-all duration-200">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving ImageKit...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save ImageKit Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Modular AI Settings Card */}
        <ModelProviderForm workspaceId={workspaceId} />
      </div>
    </div>
  )
}
