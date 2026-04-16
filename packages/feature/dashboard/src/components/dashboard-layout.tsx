"use client"

import * as React from "react"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { DashboardConfig } from "../types"

interface DashboardLayoutProps {
  children: React.ReactNode
  config: DashboardConfig
  title?: React.ReactNode
  actions?: React.ReactNode
}

export function DashboardLayout({
  children,
  config,
  title,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="[--header-height:calc(theme(spacing.12))]">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar config={config} />
          <SidebarInset>
            <SiteHeader title={title || "Dashboard"} actions={actions} />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}
