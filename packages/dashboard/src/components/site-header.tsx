"use client"

import * as React from "react"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@workspace/ui/components/breadcrumb"
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher"

import { GlobalSearch } from "@workspace/search"

interface SiteHeaderProps {
  breadcrumbs?: { title: string; href?: string }[]
  actions?: React.ReactNode
  appId?: string
}

export function SiteHeader({ breadcrumbs, actions, appId }: SiteHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs?.map((bc, index) => (
              <React.Fragment key={bc.title}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {bc.href ? (
                    <BreadcrumbLink href={bc.href} className="hidden md:block">
                      {bc.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{bc.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex-1 flex justify-center max-w-md">
        <GlobalSearch appId={appId} />
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        {actions && (
          <div className="ml-2 border-l pl-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
