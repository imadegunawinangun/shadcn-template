import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon | string
  disabled?: boolean
  external?: boolean
  label?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface UserInfo {
  name: string
  email: string
  image?: string
}

export interface DashboardLayoutProps {
  children: React.ReactNode
  sections?: NavSection[]
  appId?: string
  isAdmin?: boolean
  user?: UserInfo
  brand?: {
    name: string
    logo: React.ReactNode
  }
  breadcrumbs?: { title: string; href?: string }[]
  actions?: React.ReactNode
  workspaces?: { id: string; name: string; slug: string }[]
  activeWorkspaceId?: string
  isFullWidth?: boolean
}
