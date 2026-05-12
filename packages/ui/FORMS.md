# Forms

This project uses **React Hook Form** and **Zod** for form management and validation, combined with shadcn's accessible form components (`Field`, `Input`, `Select`, etc.).

## Setup

Ensure you have the necessary dependencies installed in your package:

```bash
pnpm add react-hook-form @hookform/resolvers/zod zod
```

## Basic Anatomy

Forms are built using the `<Controller />` from React Hook Form and `<Field />` components for accessibility and styling.

```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
      <Input
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="name@example.com"
      />
      <FieldDescription>We'll never share your email.</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## Form Pattern

### 1. Define Schema
```tsx
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
})
```

### 2. Initialize Form
```tsx
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { username: "" },
})
```

### 3. Handle Submit
```tsx
function onSubmit(data: z.infer<typeof formSchema>) {
  console.log(data)
}
```

## Field Components Reference

| Component | Description |
|-----------|-------------|
| `Field` | The root container for a form field. Supports `orientation="horizontal"`. |
| `FieldLabel` | Accessible label. Use `htmlFor` matching the control's `id`. |
| `FieldDescription` | Supplementary helper text. |
| `FieldError` | Displays validation errors. Pass `[fieldState.error]` to `errors`. |
| `FieldGroup` | Groups related controls (e.g., checkboxes). Use `data-slot="checkbox-group"`. |
| `FieldSet` | Groups related fields with a legend. |
| `FieldLegend` | The legend for a `FieldSet`. |

## Common Field Types

### Select
Use `field.value` and `onValueChange={field.onChange}`. Add `aria-invalid` to `SelectTrigger`.

### Checkbox / Radio
Use `checked={field.value.includes(item.id)}` for checkboxes or `value={field.value}` for radio groups.

### Switch
Use `checked={field.value}` and `onCheckedChange={field.onChange}`.

## Best Practices

1. **Accessibility**: Always use `aria-invalid` on the control and `data-invalid` on the `Field`.
2. **Validation Mode**: Default is `onSubmit`, but you can use `mode: "onChange"` or `"onBlur"` in `useForm` config.
3. **Array Fields**: Use `useFieldArray` for dynamic lists of fields. Ensure each item has a unique `field.id` as a key.
4. **Resetting**: Use `form.reset()` to return to default values.
