# Typography

This project uses a set of typography components based on shadcn/ui. These components ensure consistent styling across the application.

## Components

All typography components are available in `@workspace/ui/components/typography`.

### Usage

```tsx
import { 
  TypographyH1, 
  TypographyH2, 
  TypographyP, 
  TypographyInlineCode 
} from "@workspace/ui/components/typography"

export function MyComponent() {
  return (
    <div>
      <TypographyH1>Taxonomy</TypographyH1>
      <TypographyP>
        The King's Plan is a <TypographyInlineCode>strategy</TypographyInlineCode> for the kingdom.
      </TypographyP>
      <TypographyH2>The Joke</TypographyH2>
      <TypographyP>
        Why did the chicken cross the road? To get to the other side.
      </TypographyP>
    </div>
  )
}
```

### Reference

| Component | Element | Description |
|-----------|---------|-------------|
| `TypographyH1` | `h1` | Main page heading |
| `TypographyH2` | `h2` | Section heading |
| `TypographyH3` | `h3` | Subsection heading |
| `TypographyH4` | `h4` | Small subsection heading |
| `TypographyP` | `p` | Standard paragraph text |
| `TypographyBlockquote` | `blockquote` | Blockquotes |
| `TypographyTable` | `table` | Responsive table wrapper |
| `TypographyList` | `ul` | Unordered list |
| `TypographyInlineCode` | `code` | Inline code snippets |
| `TypographyLead` | `p` | Lead text (larger, muted) |
| `TypographyLarge` | `div` | Large, bold text |
| `TypographySmall` | `small` | Small, medium-weight text |
| `TypographyMuted` | `p` | Small, muted color text |

## Tailwind Typography (`prose`)

In addition to manual components, this project includes the `@tailwindcss/typography` plugin. This is useful for styling "raw" HTML content (e.g., from a CMS, Markdown, or long-form articles) where you don't want to use manual components for every tag.

### Usage

Simply wrap your content in a `div` with the `prose` class.

```tsx
export function Article() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>This is an automatic H1</h1>
      <p>This paragraph is automatically styled with proper spacing.</p>
      <ul>
        <li>Bullet points work out of the box</li>
      </ul>
    </article>
  )
}
```

### When to use what?

| Feature | Manual Components (`TypographyH1`, etc.) | Tailwind Typography (`prose`) |
|---------|------------------------------------------|------------------------------|
| **Best for** | UI Elements, landing pages, forms | Long articles, CMS content, Markdown |
| **Control** | High (component-level props/classes) | Automated (layout-level) |
| **Effort** | Manual tagging | Wrap once |
| **Styling** | Follows shadcn design system exactly | Generic typography defaults |

---

## Design Tokens

If you need to use the classes directly (e.g. for third-party libraries), refer to the implementation in `packages/ui/src/components/typography.tsx`.

