"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { SidebarProvider, SidebarInset } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"
import { NavSection, UserInfo } from "../types"

interface DashboardLayoutProps {
  children: React.ReactNode
  sections: NavSection[]
  user?: UserInfo
  brand?: {
    name: string
    logo: React.ReactNode
  }
  breadcrumbs?: { title: string; href?: string }[]
  headerActions?: React.ReactNode
  isFullWidth?: boolean
}

export function DashboardLayout({
  children,
  sections,
  user,
  brand,
  breadcrumbs,
  headerActions,
  isFullWidth = false
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar sections={sections} user={user} brand={brand} />
      <SidebarInset className="relative flex flex-col min-h-screen">
        {/* Background Decorations to show off Translucent effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-chart-1/10 blur-[100px]" />
        </div>

        <SiteHeader breadcrumbs={breadcrumbs} actions={headerActions} />
        <main className={cn(
          "flex-1 overflow-y-auto w-full mx-auto p-4 md:p-6 lg:p-8",
          isFullWidth ? "max-w-none" : "max-w-screen-2xl"
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

