# Modular Theme System Documentation

This project implements a robust, runtime-customizable theme system built with **Tailwind CSS v4**, **Next.js**, and **shadcn/ui**.

## 🚀 Overview

The system allows users to customize the UI appearance dynamically through the `ThemeCustomizer` component. Changes are applied instantly via `data-attributes` on the `<html>` element and persisted in `localStorage`.

### Key Features
- **Style Selection**: Switch between different UI densities and spacing systems (Vega, Maia, Nova, etc.).
- **Dynamic Palettes**: Change Base (backgrounds) and Accent (branding) colors independently.
- **Auto-Contrast A11y**: Automatically ensures text readability regardless of the chosen accent color.
- **Advanced Typography**: Independent control over Heading and Body fonts with a wide collection of Google Fonts.
- **Menu Layouts**: Support for Inverted, Translucent (Glassmorphism), and various Active Accent styles.

---

## 🎨 Color System (OKLCH)

We use the **OKLCH** color space for all core variables. This ensures perceptual uniformity, making it easier to maintain accessibility standards.

### Core Variables
Defined in `globals.css`:
- `--background`, `--foreground`: Base page colors.
- `--primary`, `--primary-foreground`: Main branding colors.
- `--sidebar-background`: Independent sidebar colors.

### 🛡️ Auto-Contrast System
To ensure accessibility, we use a dynamic variable `--primary-text-safe`:
```css
/* Light Mode: Darkens light colors to be readable on white */
--primary-text-safe: color-mix(in oklch, var(--primary), black 25%);

/* Dark Mode: Lightens colors to pop against dark backgrounds */
--primary-text-safe: color-mix(in oklch, var(--primary), white 20%);
```
This is automatically applied to menu text and icons when using the **Subtle** accent style.

---

## 🔡 Typography

The system distinguishes between **Heading** and **Body** fonts.

### Adding New Fonts
1.  **Register** in `apps/web/app/layout.tsx` using `next/font/google`.
2.  **Expose** the variable in the `<html>` class.
3.  **Map** the variable in `globals.css`:
    ```css
    [data-font-heading="new-font"] { --font-heading: var(--font-new-font); }
    ```
4.  **Add** to the selection list in `theme-customizer.tsx`.

---

## 🧭 Navigation & Layouts

### Menu Appearance
- **Default**: Solid color matching the base theme.
- **Inverted**: Swaps sidebar colors (Dark Sidebar in Light Mode).
- **Translucent**: Applies a `backdrop-filter: blur(12px) saturate(180%)` for a glass effect.

### Menu Accent Styles
- **Bold**: High-contrast, solid primary background for active items.
- **Subtle**: Soft primary-tinted background with safe-contrast text.
- **None**: Minimalist approach with a primary-colored underline.

---

## 📊 Charts

Chart colors are managed via `--chart-1` to `--chart-5`.
When a user selects a `Chart Color` in the customizer, it overrides `--chart-1` dynamically. Components should use these variables to stay in sync with the theme:
```tsx
<Bar dataKey="value" fill="var(--color-chart-1)" />
```

---

## 💾 Persistence

All user preferences are stored in `localStorage` under the key `theme-config`. The `ThemeCustomizer` component hydrates this state on mount to prevent layout shifts.

---

## 🛠️ File Structure
- `packages/ui/src/components/theme-customizer.tsx`: UI Logic & State.
- `packages/ui/src/styles/globals.css`: CSS Variables & Theme Mapping.
- `apps/web/app/layout.tsx`: Font loading & Root Provider.
