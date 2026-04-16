import { ReactNode } from "react"

export interface NavItem {
  title: string
  url: string
  icon?: ReactNode
  items?: {
    title: string
    url: string
  }[]
}

export interface User {
  name: string
  email: string
  avatar: string
}

export interface DashboardConfig {
  user: User
  navMain: NavItem[]
  navSecondary?: NavItem[]
  documents?: {
    name: string
    url: string
    icon?: ReactNode
  }[]
  brand: {
    name: string
    logo: ReactNode
  }
}
