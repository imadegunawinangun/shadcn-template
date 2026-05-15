import { db } from "@workspace/database";
import { membership, workspaceAppRole, workspace, AppId } from "@workspace/database/schema";
import { and, eq } from "drizzle-orm";

export interface PermissionResult {
  hasAccess: boolean;
  role?: string;
  permissions: Record<string, boolean>;
  isOwner: boolean;
}

/**
 * Core function to get a user's permissions for a specific app within a workspace.
 * Handles the "Owner bypass" rule automatically.
 */
export async function getAppPermissions(
  workspaceId: string,
  userId: string,
  appId: AppId
): Promise<PermissionResult> {
  // 1. Check Global Membership (Is Owner?)
  const globalMembership = await db.query.membership.findFirst({
    where: and(
      eq(membership.workspaceId, workspaceId),
      eq(membership.userId, userId)
    ),
  });

  if (!globalMembership) {
    return { hasAccess: false, permissions: {}, isOwner: false };
  }

  // Owner has absolute power (Level 1 & 2)
  if (globalMembership.role === "owner") {
    return { 
      hasAccess: true, 
      role: "owner", 
      permissions: { "*": true }, // Wildcard for all actions
      isOwner: true 
    };
  }

  // 2. Check if the App is actually enabled for this workspace (Automatic activation)
  const currentWorkspace = await db.query.workspace.findFirst({
    where: eq(workspace.id, workspaceId),
    columns: { enabledApps: true }
  });

  const isAppEnabled = currentWorkspace?.enabledApps?.includes(appId);
  if (!isAppEnabled) {
    return { hasAccess: false, permissions: {}, isOwner: false };
  }

  // 3. Check Granular App Role & Permissions
  const appRole = await db.query.workspaceAppRole.findFirst({
    where: and(
      eq(workspaceAppRole.workspaceId, workspaceId),
      eq(workspaceAppRole.userId, userId),
      eq(workspaceAppRole.appId, appId)
    ),
  });

  if (!appRole) {
    // If no specific role, but is a member, they might have "viewer" default
    // or no access at all depending on your policy.
    return { hasAccess: false, permissions: {}, isOwner: false };
  }

  return {
    hasAccess: true,
    role: appRole.roleName,
    permissions: appRole.permissions || {},
    isOwner: false
  };
}

/**
 * Level 2 Check: Can user perform a specific action?
 */
export async function canPerformAction(
  workspaceId: string,
  userId: string,
  appId: AppId,
  permissionKey: string
): Promise<boolean> {
  const { hasAccess, permissions, isOwner } = await getAppPermissions(workspaceId, userId, appId);
  
  if (!hasAccess) return false;
  if (isOwner) return true;
  
  return !!permissions[permissionKey];
}

export * from "./components/guards";
