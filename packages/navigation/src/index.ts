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
  BarChart3,
  Globe,
  Layout
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
 * Resolves the navigation sections for a given context from a provided registry
 * @param registry The navigation registry to resolve from
 * @param activeAppId The ID of the currently active app (e.g. 'pos', 'website')
 * @param isAdmin Whether to show admin sections
 */
export function getNavigation(
  registry: Record<string, NavSection[]>, 
  activeAppId?: string, 
  isAdmin: boolean = false
) {
  const sections = [...(registry.common || [])];
  
  if (activeAppId && registry[activeAppId]) {
    sections.push(...registry[activeAppId]);
  }
  
  if (isAdmin && registry.admin) {
    sections.push(...registry.admin);
  }
  
  return sections;
}
