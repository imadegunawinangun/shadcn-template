# 🚀 Antigravity Shadcn Template

A premium, production-ready Next.js monorepo template featuring a **Modular Theme System**, advanced typography, and a modern developer experience.

![Theme Customizer Preview](https://github.com/imadegunawinangun/shadcn-template/raw/main/preview.png)

## ✨ Key Highlights

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router) with [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with full **OKLCH** color support.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) components shared across the monorepo.
- **Modular Theme System**: 
  - **Runtime Customization**: Switch styles, colors, and fonts instantly without page reloads.
  - **Auto-Contrast Engine**: Built-in accessibility logic to ensure WCAG compliance.
  - **Glassmorphism**: Native support for translucent navigation and layouts.
- **Monorepo Structure**: Powered by [Turborepo](https://turbo.build/repo) and `pnpm` workspaces.
- **Database & Auth**: Integrated with [Drizzle ORM](https://orm.drizzle.team/) and [Better Auth](https://better-auth.com/).

---

## 🎨 Advanced Theming

The centerpiece of this template is the **Theme Customizer**. It allows you to control the entire look and feel of your application from a single sidebar:

| Feature | Description |
|---------|-------------|
| **Style Presets** | Choose from Vega, Maia, Nova, and more for different spacing/radius logic. |
| **Dual Color System** | Independent control over Base (Backgrounds) and Accent (Branding) colors. |
| **Typography Scaling** | Separate Heading and Body font selection from a curated Google Font collection. |
| **Menu Layouts** | Inverted, Translucent, and multiple Active Accent styles for navigation. |
| **Chart Sync** | All charts automatically inherit the chosen theme palette. |

> [!TIP]
> See [THEMING.md](./packages/ui/THEMING.md) for technical details on how the OKLCH-based theme system works.

---

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/imadegunawinangun/shadcn-template.git
cd shadcn-template
pnpm install
```

### 2. Development
Run all apps and packages in development mode:
```bash
pnpm dev
```

### 3. Adding UI Components
To add new shadcn components to the shared package:
```bash
pnpm dlx shadcn@latest add [component-name] -c apps/web
```

> [!IMPORTANT]
> **Single Source of Truth**: All UI components MUST be taken from `packages/ui`. 
> 
> **Guidelines**:
> - **Standard shadcn**: Add via CLI to `packages/ui` first.
> - **Custom Components**: Build them using existing shadcn primitives as building blocks and place them in `packages/ui`.
> - **Zero Local Components**: Do NOT create component folders locally within individual apps.

---

## 📂 Project Structure

```text
├── apps
│   └── web              # Main Next.js application
├── packages
│   ├── ui               # Shared UI components, styles (Tailwind v4), and Theming
│   ├── cloudinary       # Media management integration
│   ├── db               # Database schema and Drizzle ORM
│   └── eslint-config    # Shared ESLint configuration
├── turbo.json           # Turborepo configuration
└── pnpm-workspace.yaml  # Workspace definitions
```

---

## 📖 Internal Documentation

- [**Theming Guide**](./packages/ui/THEMING.md): OKLCH, Variables, and Customization.
- [**Typography**](./packages/ui/TYPOGRAPHY.md): List of available fonts and usage.
- [**Form Patterns**](./packages/ui/FORMS.md): Best practices for Hook Form + Zod.

---

## 🤝 Contributing

This template is designed for high-velocity teams. If you find a bug or have a feature request, please open an issue or submit a pull request.

Built with ❤️ by [Antigravity](https://github.com/imadegunawinangun).
