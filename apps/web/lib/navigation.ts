import { NavSection, getNavigation } from "@workspace/navigation";

export const DASHBOARD_NAV_REGISTRY: Record<string, NavSection[]> = {
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

export function getAppNavigation(activeAppId?: string, isAdmin: boolean = false) {
  return getNavigation(DASHBOARD_NAV_REGISTRY, activeAppId, isAdmin);
}

// Backward compatibility for existing pages
export const navSections = getAppNavigation(undefined, false);
export const currentUser = {
  name: "John Doe",
  email: "john@example.com",
  image: "https://github.com/shadcn.png"
};
