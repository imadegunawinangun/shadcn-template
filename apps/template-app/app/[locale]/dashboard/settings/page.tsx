import React from "react";
import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardHeader, DashboardShell } from "@workspace/dashboard";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const { userId, orgId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getClerkUser();

  const profileData = {
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "User",
    email: user?.emailAddresses[0]?.emailAddress || "user@example.com",
    avatarUrl: user?.imageUrl || null,
  };

  const workspaceId = orgId || "default-workspace";

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account profile, workspace integrations, and media configurations."
      />
      <SettingsClient 
        profileData={profileData} 
        workspaceId={workspaceId} 
      />
    </DashboardShell>
  );
}
