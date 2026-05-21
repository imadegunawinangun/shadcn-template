import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DashboardLayout } from "@workspace/dashboard";
import { getNavigation } from "@workspace/navigation";
import { redirect } from "next/navigation";
import { getSiteConfig } from "@workspace/database";
import { DashboardThemeProvider } from "@/components/dashboard-theme-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

const NAVIGATION_REGISTRY = {
  common: [
    {
      title: "Workspace",
      items: [
        { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
        { title: "Workspace", href: "/dashboard/workspace", icon: "Building" },
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
  website: [
    {
      title: "Site Builder",
      items: [
        { title: "Landing Page", href: "/dashboard/website", icon: "Layout" },
        { title: "Appearance", href: "/dashboard/website/appearance", icon: "Globe" },
        { title: "SEO Settings", href: "/dashboard/website/seo", icon: "Search" },
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

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const navigation = getNavigation(NAVIGATION_REGISTRY, "website", true);

  let themeConfig = null;
  if (orgId) {
    const siteConfig = await getSiteConfig(orgId);
    if (siteConfig?.theme) {
      themeConfig = siteConfig.theme;
    }
  }

  if (!themeConfig) {
    const globalConfig = await getSiteConfig("platform");
    themeConfig = globalConfig?.theme || null;
  }

  return (
    <>
      <DashboardThemeProvider config={themeConfig} />
      <DashboardLayout
        user={{
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : "User",
          email: user?.emailAddresses[0]?.emailAddress || "user@example.com",
          image: user?.imageUrl,
        }}
        brand={{
          name: "Template App",
          logo: <div className="bg-primary p-1 rounded-lg text-primary-foreground font-bold">T</div>
        }}
        sections={navigation}
        breadcrumbs={[
          { title: "Overview", href: "/dashboard" }
        ]}
        actions={<LanguageSwitcher />}
      >
        {children}
      </DashboardLayout>
    </>
  );
}
