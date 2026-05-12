# @workspace/ui

This is the core UI package for the Antigravity monorepo. It contains shared shadcn/ui components, global styles, and the modular theme system.

## 📦 Package Overview

- **Framework**: React + Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Theming**: OKLCH-based runtime theme system
- **Typography**: Advanced font scaling and mapping

---

### ⚠️ Important Convention

> [!IMPORTANT]
> **Single Source of Truth**: All UI components MUST be imported from `@workspace/ui`. 
> Do NOT create local component folders within `apps/*`. 
> 
> **Adding Components**:
> - **Standard shadcn**: Add via CLI to `packages/ui` first.
> - **Custom Components**: Build them using existing shadcn primitives as building blocks and place them in `packages/ui`.
> - **Stay in Sync**: Always import from the workspace package so all apps share the same design system.

### Importing Components
All components are exported from the package root or their specific paths. In your apps, use the workspace alias:

```tsx
import { Button } from "@workspace/ui/components/button";
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer";
```

### Adding New Components
To add a new shadcn component to this package from the root of an app (e.g., `apps/web`):

```bash
pnpm dlx shadcn@latest add [component-name] -c apps/web
```
The CLI is configured via `components.json` to automatically place new components in `packages/ui/src/components`. This ensures all components follow the project's established styling and theme standards.

---

## 🎨 Design System

This package manages the entire design language of the project.

### Theming (OKLCH)
We use a runtime theme system powered by CSS variables and `data-attributes`.
- **Primary Logic**: Located in `src/styles/globals.css`.
- **Runtime Customizer**: `src/components/theme-customizer.tsx`.
- **Documentation**: See [THEMING.md](./THEMING.md).

### Typography
Independent control over Heading and Body fonts.
- **Documentation**: See [TYPOGRAPHY.md](./TYPOGRAPHY.md).

### Forms
Shared patterns for forms using React Hook Form and Zod.
- **Documentation**: See [FORMS.md](./FORMS.md).

---

## 📁 Directory Structure

```text
├── src
│   ├── components   # UI Components (shadcn + Custom)
│   ├── hooks        # Shared UI hooks (use-mobile, etc.)
│   ├── lib          # Utility functions (cn, etc.)
│   └── styles       # Global CSS (Tailwind v4) and Theme logic
├── THEMING.md       # Detailed theming documentation
├── TYPOGRAPHY.md    # Font documentation
└── FORMS.md         # Form patterns and best practices
```

---

## 🔧 Configuration

### Tailwind CSS v4
The styles are processed using Tailwind CSS v4. The configuration is primarily located in `src/styles/globals.css` using the `@theme` block.

### components.json
Configures how the shadcn CLI interacts with this package.
