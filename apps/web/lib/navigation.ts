// navigation.ts
// Use string names for icons to allow serialization from Server to Client components
export const navSections = [
  {
    title: "Application",
    items: [
      { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
      { title: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
      { title: "Team", href: "/dashboard/team", icon: "Users" },
      { title: "Media", href: "/dashboard/assets", icon: "ImageIcon" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Billing", href: "/dashboard/billing", icon: "CreditCard" },
      { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
      { title: "Notifications", href: "/dashboard/notifications", icon: "Bell", label: "1" },
      { title: "Automation", href: "/dashboard/automation", icon: "Zap" },
    ],
  },
  {
    title: "Enterprise",
    items: [
      { title: "Security", href: "/dashboard/security", icon: "Shield" },
      { title: "Admin Console", href: "/dashboard/admin", icon: "Wrench" },
    ],
  },
]

export const currentUser = {
  name: "Rumah Shadcn",
  email: "rumah@example.com",
  image: "https://github.com/shadcn.png",
}
