import { 
  LayoutDashboard, 
  Users, 
  ImageIcon, 
  Settings, 
  CreditCard, 
  Bell, 
  Zap, 
  Shield, 
  Wrench,
  Store,
  Box,
  FileText,
  BarChart3
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  label?: string;
  appId?: string; // Optional: Only show if this app is active
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

/**
 * Global registry for all application navigation.
 * This allows us to modularize the sidebar and keep it dynamic.
 */
export const GLOBAL_NAV_REGISTRY: Record<string, NavSection[]> = {
  // Common dashboard items for all users
  common: [
    {
      title: "Organization",
      items: [
        { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
        { title: "Team", href: "/dashboard/team", icon: "Users" },
        { title: "Media", href: "/dashboard/assets", icon: "ImageIcon" },
      ],
    },
    {
      title: "Management",
      items: [
        { title: "Billing", href: "/dashboard/billing", icon: "CreditCard" },
        { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
        { title: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
        { title: "Automation", href: "/dashboard/automation", icon: "Zap" },
      ],
    },
  ],
  
  // Specific menu for POS app
  pos: [
    {
      title: "POS Terminal",
      items: [
        { title: "Cashier", href: "/pos/terminal", icon: "Store" },
        { title: "Products", href: "/pos/products", icon: "Box" },
        { title: "Transactions", href: "/pos/history", icon: "FileText" },
        { title: "Reports", href: "/pos/reports", icon: "BarChart3" },
      ],
    },
  ],

  // Admin section
  admin: [
    {
      title: "Enterprise",
      items: [
        { title: "Security", href: "/dashboard/security", icon: "Shield" },
        { title: "Admin Console", href: "/dashboard/admin", icon: "Wrench" },
      ],
    },
  ]
};

/**
 * Resolves the navigation sections for a given context
 * @param activeAppId The ID of the currently active app (e.g. 'pos', 'website')
 * @param isAdmin Whether to show admin sections
 */
export function getNavigation(activeAppId?: string, isAdmin: boolean = false) {
  const sections = [...GLOBAL_NAV_REGISTRY.common];
  
  if (activeAppId && GLOBAL_NAV_REGISTRY[activeAppId]) {
    sections.push(...GLOBAL_NAV_REGISTRY[activeAppId]);
  }
  
  if (isAdmin) {
    sections.push(...GLOBAL_NAV_REGISTRY.admin);
  }
  
  return sections;
}
