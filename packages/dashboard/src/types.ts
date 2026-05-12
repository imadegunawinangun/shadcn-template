import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
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

export interface DashboardConfig {
  sections: NavSection[]
}
