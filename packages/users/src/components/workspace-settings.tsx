"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"

const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
})

type WorkspaceValues = z.infer<typeof workspaceSchema>

interface WorkspaceSettingsProps {
  defaultValues: WorkspaceValues
  onUpdate: (data: WorkspaceValues) => void
}

export function WorkspaceSettings({ defaultValues, onUpdate }: WorkspaceSettingsProps) {
  const form = useForm<WorkspaceValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues,
  })

  function onSubmit(data: WorkspaceValues) {
    onUpdate(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <TypographyH3>Workspace Settings</TypographyH3>
        <TypographyP className="text-muted-foreground">
          Manage your workspace identity and configuration.
        </TypographyP>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Workspace Name</FieldLabel>
              <Input {...field} id={field.name} />
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">app.example.com/</span>
                <Input {...field} id={field.name} />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit">Update Workspace</Button>
      </form>

      <div className="pt-6 border-t">
        <TypographyH3 className="text-destructive">Danger Zone</TypographyH3>
        <TypographyP className="text-muted-foreground mb-4">
          Permanently delete this workspace and all of its data.
        </TypographyP>
        <Button variant="destructive">Delete Workspace</Button>
      </div>
    </div>
  )
}
