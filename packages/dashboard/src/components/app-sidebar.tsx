"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as LucideIcons from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { 
  OrganizationSwitcher,
  UserButton 
} from "@clerk/nextjs"
import { NavSection, UserInfo } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@workspace/ui/components/dropdown-menu"
import { ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sections: NavSection[]
  user?: UserInfo
  brand?: {
    name: string
    logo: React.ReactNode
  }
  workspaces?: { id: string; name: string; slug: string }[]
  activeWorkspaceId?: string
}

export function AppSidebar({ sections, user, brand, workspaces, activeWorkspaceId, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const { isMobile } = useSidebar()
  const [mounted, setMounted] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState<number | null>(null)

  const activeWorkspace = workspaces?.find(ws => ws.id === activeWorkspaceId) || workspaces?.[0]

  React.useEffect(() => {
    setMounted(true)
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && typeof customEvent.detail.unreadCount === 'number') {
        setUnreadCount(customEvent.detail.unreadCount)
      }
    }
    window.addEventListener('notifications:updated', handleUpdate)
    return () => window.removeEventListener('notifications:updated', handleUpdate)
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 border-b flex items-center px-4">
        {mounted ? (
          <OrganizationSwitcher 
            afterCreateOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger: "w-full flex justify-between bg-sidebar-accent/50 hover:bg-sidebar-accent h-10 px-3 rounded-lg border",
                organizationPreviewMainIdentifier: "font-bold text-sm",
                organizationPreviewSecondaryIdentifier: "text-xs opacity-70"
              }
            }}
          />
        ) : (
          <div className="w-full h-10 bg-sidebar-accent/20 animate-pulse rounded-lg" />
        )}
      </SidebarHeader>
      <SidebarContent>
        {sections?.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  let Icon = item.icon
                  if (typeof Icon === "string") {
                    Icon = (LucideIcons as any)[Icon]
                  }
                  const isActive = pathname === item.href
                  const displayLabel = (item.title === "Notifications" && unreadCount !== null)
                    ? (unreadCount > 0 ? unreadCount.toString() : null)
                    : item.label

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                          {displayLabel && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-medium text-primary animate-in zoom-in duration-300">
                              {displayLabel}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 px-2">
          {mounted ? (
            <UserButton 
              showName={true} 
              appearance={{
                elements: {
                  userButtonBox: "flex-row-reverse gap-3",
                  userButtonOuterIdentifier: "text-sm font-medium p-0",
                }
              }}
            />
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent/20 animate-pulse" />
              <div className="h-4 w-24 bg-sidebar-accent/20 animate-pulse rounded" />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
