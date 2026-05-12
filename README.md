# 🌌 Antigravity Enterprise Template

The definitive Next.js monorepo template designed for high-performance, aesthetically superior, and AI-native large-scale applications. This template serves as a blueprint for production-ready SaaS, Dashboards, and complex web platforms.

---

## 🚀 Vision & Strategy

This is not just a boilerplate; it's a **Design-Driven Development** system. It enforces architectural boundaries that ensure maintainability as your project grows from a simple MVP to a multi-app ecosystem.

### Core Pillars
1. **Visual Excellence**: Built-in support for high-end aesthetics (Glassmorphism, OKLCH gradients, Advanced Typography scaling).
2. **Strict Modularity**: Shared logic and UI reside in standalone packages, making them reusable across multiple applications.
3. **AI-Ready DX**: Structured specifically to be understood and extended by AI coding assistants with minimal context overhead.
4. **Performance by Default**: Leveraging Next.js 15, Turbopack, and Server Components for industry-leading Core Web Vitals.

---

## 🛠️ Technical Stack

### Core Infrastructure
- **Monorepo**: Managed by [Turborepo](https://turbo.build/) and `pnpm` workspaces.
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with native **OKLCH** color support.
- **Runtime**: Node.js 20+ with [TypeScript](https://www.typescriptlang.org/) for end-to-end type safety.

### Specialized Layers
- **UI System**: [shadcn/ui](https://ui.shadcn.com/) components with a custom **Modular Theme Engine**.
- **Auth**: [Clerk](https://clerk.com/) for enterprise-grade authentication and user management.
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations.
- **Media**: [Cloudinary](https://cloudinary.com/) for automated image/video optimization.
- **Revenue**: [Stripe](https://stripe.com/) integration via the `@workspace/payments` package.
- **Dashboard**: Enterprise-grade metrics and visualizations via the `@workspace/dashboard` package.

---

## ✨ Existing Features

### 📊 Dashboard & Metrics
- **Centralized Dashboard Package**: Reusable components for complex data visualizations.
- **Dynamic Charts**: Integrated with Recharts and the global theme system.
- **Modular Shell**: Standardized layouts for internal application views.
- **Real-time Metrics**: Optimized components for displaying KPIs and activity feeds.

### 🎨 Modular Theme System (Runtime)
- **Style Presets**: Instant switching between design languages (Vega, Maia, Nova, etc.).
- **Dual Color System**: High-precision accent and base color control using OKLCH.
- **Typography Matrix**: 30+ curated Google Fonts with automatic heading/body pairing and scaling.
- **Dynamic Radius**: Control the "roundness" of your entire application with a single setting.
- **Auto-Contrast**: WCAG-compliant color logic that ensures text readability on any background.

### 🍱 Component Library
- **Shared shadcn/ui**: A centralized package of UI primitives used across all applications.
- **Glassmorphism**: Built-in support for translucent layouts, headers, and sidebars.
- **Responsive Navigation**: Collapsible sidebars and sticky headers with backdrop-blur.
- **Chart Palette Sync**: All data visualizations automatically inherit the active theme's colors.

### 🛡️ Enterprise Readiness
- **Universal Auth**: Pre-integrated Clerk hooks, middleware, and UI components.
- **Type-Safe DB**: Pre-configured Drizzle schema with automated migration workflows.
- **Media Optimization**: Auto-optimized image delivery via Cloudinary.
- **Billing Infrastructure**: Ready-to-use Stripe patterns for subscriptions and payments.

---

## 📂 Architecture Overview

```text
├── apps
│   └── web              # Premium Next.js application (The "View" layer)
├── packages
│   ├── ui               # Design System: shadcn, Tailwind v4, & Theme Engine
│   ├── database         # Data Layer: Schema definitions & Drizzle config
│   ├── payments         # Revenue Layer: Stripe integration & billing logic
│   ├── dashboard        # Metrics Layer: Reusable dashboard widgets & layouts
│   ├── cloudinary       # Media Layer: Asset management & optimization
│   ├── eslint-config    # Governance: Shared linting & formatting standards
│   └── typescript-config# Governance: Shared TS configurations
├── .agents              # AI Agent Workspace: Skills, instructions, & context
├── turbo.json           # Build & Cache orchestration
└── pnpm-workspace.yaml  # Workspace orchestration
```

---

## 🤖 AI Agent Operating Procedures (AOP)

> [!IMPORTANT]
> **MANDATORY GUIDELINES FOR AI ASSISTANTS**
> If you are an AI agent working on this repository, you MUST follow these rules to maintain project integrity:

### 1. UI Governance
- **NO LOCAL COMPONENTS**: Never create component folders inside `apps/web/components`.
- **UI PACKAGE FIRST**: All UI components must reside in `packages/ui/src/components`.
- **ADDING COMPONENTS**: Use `pnpm dlx shadcn@latest add [component] -c apps/web` to add standard components to the shared library.

### 2. Styling Standards
- **Variable-First**: Use OKLCH variables (e.g., `bg-primary/50`, `text-accent-foreground`). Never hardcode hex/rgb.
- **Theme Compatibility**: Ensure all new UI elements support the **Modular Theme System** (Vega, Maia, Nova presets).

### 3. Data Flow & Type Safety
- **Schema Centralization**: Define all database schemas in `packages/database/src/schema.ts`.
- **Exporting**: Always export schemas and types from the database package for consumption in apps.
- **Mutations**: Prefer Next.js Server Actions for data mutations.

### 4. Communication & Commits
- **Conventional Commits**: Use `feat(scope):`, `fix(scope):`, etc.
- **Aesthetics**: When asked to build a feature, prioritize "Premium Design" (Gradients, Hover Effects, Micro-animations).

### 5. Tailwind v4 Monorepo Configuration
- **Scanning Packages**: In Tailwind v4, sibling packages are NOT scanned by default.
- **Explicit @source**: You MUST explicitly add sibling packages to the `@source` directive in the global CSS file (usually in `packages/ui/src/styles/globals.css`).
- **Path Precision**: Ensure the relative path in `@source` correctly points to the root of the target packages (e.g., `../../../../packages/*/src/**/*.{ts,tsx}`).


---

## 🎨 Advanced Theming System

The template features a runtime **Theme Customizer** that controls:
- **Style Presets**: Toggle between different radius, spacing, and border logic.
- **Dual Color Engine**: Independent control over Base (Neutrals) and Accent (Branding) colors using OKLCH.
- **Typography Matrix**: Access to 30+ curated Google Fonts with automatic heading/body pairing.
- **Accessibility**: Built-in contrast checking to ensure WCAG compliance regardless of color choice.

---

## 🏗️ Getting Started

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [pnpm 9+](https://pnpm.io/)

### 2. Installation
```bash
git clone https://github.com/imadegunawinangun/shadcn-template.git
cd shadcn-template
pnpm install
```

### 3. Development
```bash
pnpm dev
```

### 4. Database Sync
```bash
# Generate migrations
pnpm --filter @workspace/database db:generate

# Push changes to DB
pnpm --filter @workspace/database db:push
```

---

## 📈 Non-Technical: Project Management & Scaling

### For Product Managers
- **Feature Encapsulation**: This architecture allows you to spin up new apps (e.g., `apps/admin` or `apps/docs`) in days by reusing the existing `packages`.
- **Consistent Branding**: Marketing and Product teams can iterate on the visual identity via the Theme Engine without touching code.

### For Stakeholders
- **Scalability**: The monorepo structure is designed to handle teams of 10+ developers without merge-conflict hell.
- **Future Proof**: Ready for expansion into Mobile (Expo) or Desktop (Electron) by sharing the core `logic` and `ui` packages.

---

## 💡 Developer Lessons & Monorepo Gotchas

### 🎨 Tailwind CSS v4 in Monorepos
When building features in standalone packages (like `@workspace/assets`), Tailwind v4's Just-In-Time engine might not detect your classes if the package path is not registered.
- **The Symptom**: Your Tailwind classes (like `group-hover` or custom colors) appear in the code but have no effect in the browser.
- **The Fix**: Update `packages/ui/src/styles/globals.css` and add the package to the `@source` list.
- **Named Groups**: While Tailwind v4 supports named groups (`group/name`), it's often safer to use standard `group` classes if you've already refactored the base components (like `Card`) to be generic and "group-free".

### 📦 Modular UI Components
Base components (like `Card`, `Input`, `Button`) should be kept as "pure" as possible.
- Avoid hardcoded margins, padding, or forced `group` names in the base component.
- Use `cn()` to allow the consuming feature to override styles (e.g., `<Card className="p-0">`).
- This ensures that a single component library can support both dense data tables and spacious marketing cards.

---

## 🤝 Contributing & Governance

This template is maintained by **Antigravity**. 

- **Code Reviews**: Strict adherence to ESLint and Prettier rules.
- **Design Reviews**: Every new component must be validated against the global theme system.

Built with ❤️ by [Antigravity](https://github.com/imadegunawinangun).
