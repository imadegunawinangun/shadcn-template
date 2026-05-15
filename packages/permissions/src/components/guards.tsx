import React from "react";
import { redirect } from "next/navigation";
import { getAppPermissions } from "../index";
import { AppId } from "@workspace/database/schema";

interface AppGuardProps {
  workspaceId: string;
  userId: string;
  appId: AppId;
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Server Component Guard to protect routes at the Application level (Level 1).
 * Usage: Wrap your app layouts or pages with this.
 */
export async function AppGuard({
  workspaceId,
  userId,
  appId,
  children,
  fallbackUrl = "/dashboard"
}: AppGuardProps) {
  const { hasAccess } = await getAppPermissions(workspaceId, userId, appId);

  if (!hasAccess) {
    // Optionally log unauthorized access attempt
    redirect(fallbackUrl);
  }

  return <>{children}</>;
}

interface ActionGuardProps {
  workspaceId: string;
  userId: string;
  appId: AppId;
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Server Component Guard to protect specific features (Level 2).
 */
export async function ActionGuard({
  workspaceId,
  userId,
  appId,
  permission,
  children,
  fallback = null
}: ActionGuardProps) {
  const { permissions, isOwner, hasAccess } = await getAppPermissions(workspaceId, userId, appId);

  if (!hasAccess) return <>{fallback}</>;
  if (isOwner) return <>{children}</>;

  if (permissions[permission]) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
