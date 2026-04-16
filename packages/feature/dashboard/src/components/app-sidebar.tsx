"use client"

import * as React from "react"
import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { DashboardConfig } from "../types"

export function AppSidebar({ 
  config,
  ...props 
}: React.ComponentProps<typeof Sidebar> & { config: DashboardConfig }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                {config.brand.logo}
                <span className="text-base font-semibold">{config.brand.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={config.navMain} />
        {config.documents && <NavDocuments items={config.documents} />}
        {config.navSecondary && <NavSecondary items={config.navSecondary} className="mt-auto" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={config.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
