"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Globe, Trash2, Save, Image as ImageIcon, Pencil, ImagePlus } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  image: z.string().optional(),
})

type WorkspaceValues = z.infer<typeof workspaceSchema>

interface WorkspaceSettingsProps {
  defaultValues: WorkspaceValues
  onUpdate: (data: WorkspaceValues) => void
  onDelete?: () => void
  imageKitConfig?: {
    publicKey: string
    urlEndpoint: string
  }
  renderMediaLibrary?: (props: { onSelect: (url: string) => void }) => React.ReactNode
}

export function WorkspaceSettings({ defaultValues, onUpdate, onDelete, imageKitConfig, renderMediaLibrary }: WorkspaceSettingsProps) {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const form = useForm<WorkspaceValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues,
  })

  function onSubmit(data: WorkspaceValues) {
    onUpdate(data)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-xl">Workspace Profile</CardTitle>
          <CardDescription>
            This is your workspace's public profile and URL.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            <Controller
              name="image"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Workspace Logo</FieldLabel>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-6 p-4 rounded-xl border border-dashed bg-muted/20">
                      <div className="h-20 w-20 rounded-xl border-2 border-background shadow-sm overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                        {field.value ? (
                          <img src={field.value} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Dialog open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen}>
                            <DialogTrigger asChild>
                              <Button type="button" variant="outline" size="sm" className="h-9 gap-2">
                                <ImagePlus className="h-4 w-4" />
                                {field.value ? "Change Logo" : "Choose Logo"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-6xl p-0 overflow-hidden border-none shadow-2xl">
                              <DialogHeader className="p-6 pb-0">
                                <DialogTitle>Media Library</DialogTitle>
                                <DialogDescription>
                                  Select an image from your ImageKit library to use as your workspace logo.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-0">
                                {renderMediaLibrary ? (
                                  renderMediaLibrary({
                                    onSelect: (url) => {
                                      field.onChange(url)
                                      form.setValue("image", url, { shouldDirty: true, shouldValidate: true })
                                      // Small delay to ensure state updates before modal closes
                                      setTimeout(() => {
                                        setIsMediaLibraryOpen(false)
                                      }, 150)
                                    }
                                  })
                                ) : (
                                  <div className="p-12 text-center text-muted-foreground">
                                    Media Library component is missing.
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {field.value && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => field.onChange("")}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Recommended size: 200x200px. Supports PNG, JPG, or SVG.
                        </p>
                      </div>
                    </div>
                  </div>
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Workspace Name</FieldLabel>
                  <Input {...field} value={field.value ?? ""} id={field.name} className="h-10" placeholder="Acme Inc." />
                  <TypographyP className="text-[10px] text-muted-foreground mt-1">
                    Your team will see this name in their dashboard.
                  </TypographyP>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Workspace Slug</FieldLabel>
                  <div className="flex items-center gap-0 group">
                    <div className="bg-muted px-3 h-10 flex items-center border border-r-0 rounded-l-md text-xs font-medium text-muted-foreground transition-colors group-focus-within:border-primary group-focus-within:bg-primary/5">
                      <Globe className="h-3 w-3 mr-2" />
                      app.example.com/
                    </div>
                    <Input {...field} value={field.value ?? ""} id={field.name} className="rounded-l-none h-10 border-l-0" placeholder="my-workspace" />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </CardContent>
          <CardFooter className="bg-muted/20 border-t py-3 flex justify-end">
            <Button type="submit" size="sm" className="gap-2 px-4 h-9">
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="border-destructive/20 shadow-sm overflow-hidden">
        <CardHeader className="bg-destructive/5 border-b border-destructive/10">
          <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
          <CardDescription className="text-destructive/70">
            Permanently delete this workspace and all of its data. This action is irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <TypographyP className="text-sm text-muted-foreground">
            Once you delete a workspace, there is no going back. Please be certain.
          </TypographyP>
        </CardContent>
        <CardFooter className="bg-destructive/5 py-3 border-t border-destructive/10 flex justify-end">
          <Button 
            variant="destructive" 
            size="sm" 
            className="gap-2 h-9 px-4"
            onClick={() => {
              if (confirm("Are you sure you want to delete this workspace? This cannot be undone.")) {
                onDelete?.()
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Workspace
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
