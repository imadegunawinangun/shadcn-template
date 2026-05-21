"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
})

type ProfileValues = z.infer<typeof profileSchema>

interface ProfileSettingsProps {
  initialData?: {
    name?: string | null
    email?: string | null
    avatarUrl?: string | null
  }
}

export function ProfileSettings({ initialData }: ProfileSettingsProps = {}) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "John Doe",
      email: initialData?.email || "john@example.com",
    },
  })

  function onSubmit(data: ProfileValues) {
    console.log("Profile updated:", data)
  }

  const initials = initialData?.name
    ? initialData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JD"

  return (
    <div className="space-y-6">
      <div>
        <TypographyH3>Profile</TypographyH3>
        <TypographyP className="text-muted-foreground">
          Update your personal information.
        </TypographyP>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={initialData?.avatarUrl || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Button variant="outline">Change Avatar</Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input {...field} id={field.name} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input {...field} id={field.name} type="email" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}
