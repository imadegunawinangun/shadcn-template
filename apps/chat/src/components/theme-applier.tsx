"use client"

import * as React from "react"

interface ThemeConfig {
  style: string;
  baseColor: string;
  color: string;
  chartColor: string;
  fontHeading: string;
  fontBody: string;
  radius: string;
  menu: string;
  menuAppearance: string;
  menuAccent: string;
  customColor?: string;
  customChartColor?: string;
}

export function ThemeApplier({ initialConfig }: { initialConfig?: any }) {
  React.useLayoutEffect(() => {
    if (!initialConfig) return;

    const config = initialConfig as ThemeConfig;
    const root = window.document.documentElement;

    // Apply attributes
    root.setAttribute("data-style", config.style?.toLowerCase() || "vega");
    root.setAttribute("data-base-color", config.baseColor?.toLowerCase() || "zinc");
    root.setAttribute("data-theme", config.color === "Custom" ? "custom" : config.color?.toLowerCase() || "neutral");
    root.setAttribute("data-chart-color", config.chartColor === "Custom" ? "custom" : config.chartColor?.toLowerCase() || "neutral");
    root.setAttribute("data-font-heading", config.fontHeading?.toLowerCase() || "inter");
    root.setAttribute("data-font-body", config.fontBody?.toLowerCase() || "inter");
    root.setAttribute("data-radius", config.radius || "0.625rem");
    root.setAttribute("data-menu", config.menu?.toLowerCase() || "default");
    root.setAttribute("data-menu-appearance", config.menuAppearance?.toLowerCase() || "solid");
    root.setAttribute("data-menu-accent", config.menuAccent?.toLowerCase() || "subtle");
    
    // Apply CSS variables
    if (config.radius) {
      root.style.setProperty("--radius", config.radius.includes("rem") ? config.radius : `${config.radius}rem`);
    }
    
    if (config.color === "Custom" && config.customColor) {
      root.style.setProperty("--primary", config.customColor);
    } else {
      root.style.removeProperty("--primary");
    }

    if (config.chartColor === "Custom" && config.customChartColor) {
      root.style.setProperty("--chart-1", config.customChartColor);
    } else {
      root.style.removeProperty("--chart-1");
    }

    // Also update localStorage to keep it in sync for the ThemeCustomizer
    localStorage.setItem("theme-config", JSON.stringify(config));
  }, [initialConfig]);

  return null;
}
