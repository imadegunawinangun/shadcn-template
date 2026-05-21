"use client"

import * as React from "react"

export function DashboardThemeProvider({ config }: { config: any }) {
  React.useEffect(() => {
    if (!config) return
    const root = window.document.documentElement
    root.setAttribute("data-style", (config.style || "Nova").toLowerCase())
    root.setAttribute("data-base-color", (config.baseColor || "Zinc").toLowerCase())
    root.setAttribute("data-theme", (config.color || "Slate") === "Custom" ? "custom" : (config.color || "Slate").toLowerCase())
    root.setAttribute("data-secondary-theme", (config.secondaryColor || "Slate") === "Custom" ? "custom" : (config.secondaryColor || "Slate").toLowerCase())
    root.setAttribute("data-chart-color", (config.chartColor || "Auto") === "Custom" ? "custom" : (config.chartColor || "Auto").toLowerCase())
    root.setAttribute("data-font-heading", (config.fontHeading || "Inter").toLowerCase())
    root.setAttribute("data-font-body", (config.fontBody || "Roboto").toLowerCase())
    root.setAttribute("data-radius", config.radius || "0.5")
    root.setAttribute("data-menu", (config.menu || "Default").toLowerCase())
    root.setAttribute("data-menu-appearance", (config.menuAppearance || "Solid").toLowerCase())
    root.setAttribute("data-menu-accent", (config.menuAccent || "Subtle").toLowerCase())
    
    root.style.setProperty("--radius", (config.radius || "0.5").includes("rem") ? config.radius : `${config.radius || "0.5"}rem`)
    
    if (config.color === "Custom") {
      root.style.setProperty("--primary", config.customColor)
    } else {
      root.style.removeProperty("--primary")
    }

    if (config.secondaryColor === "Custom") {
      root.style.setProperty("--secondary", config.customSecondaryColor)
    } else {
      root.style.removeProperty("--secondary")
    }

    if (config.chartColor === "Custom") {
      root.style.setProperty("--chart-1", config.customChartColor)
    } else {
      root.style.removeProperty("--chart-1")
    }
  }, [config])

  return null
}
