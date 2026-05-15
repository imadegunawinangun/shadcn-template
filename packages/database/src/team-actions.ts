"use server"

import { db } from "./index";
import { membership, user, workspace, entity, workspaceAppRole } from "./schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  appRoles?: Record<string, string>;
  status: "Active" | "Pending" | "Inactive";
  image?: string;
};

/**
 * Fetch all members and pending invitations for a workspace
 */
export async function getTeamMembers(workspaceId: string): Promise<TeamMember[]> {
  if (!db) return [];

  try {
    // 1. Get existing members
    const members = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: membership.role,
        image: user.image,
      })
      .from(membership)
      .innerJoin(user, eq(membership.userId, user.id))
      .where(eq(membership.workspaceId, workspaceId));

    // 2. Get app-specific roles from the new table
    const appRolesData = await db.query.workspaceAppRole.findMany({
      where: eq(workspaceAppRole.workspaceId, workspaceId),
    });

    // Map app roles by userId
    const appRolesByUser: Record<string, Record<string, string>> = {};
    appRolesData.forEach((ar) => {
      if (!appRolesByUser[ar.userId]) {
        appRolesByUser[ar.userId] = {};
      }
      appRolesByUser[ar.userId][ar.appId] = ar.roleName;
    });

    const formattedMembers: TeamMember[] = members.map((m: any) => ({
      ...m,
      appRoles: appRolesByUser[m.id] || {},
      status: "Active",
    }));

    // 3. Get pending invitations from Clerk
    const formattedInvites = await getPendingInvitations(workspaceId);

    return [...formattedMembers, ...formattedInvites];
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

/**
 * Gets workspace details by ID
 */
export async function getWorkspace(workspaceId: string) {
  if (!db) return null;
  
  try {
    const results = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1);
      
    return results[0] || null;
  } catch (error) {
    console.error("Failed to fetch workspace:", error);
    return null;
  }
}

/**
 * Ensures a user and their current organization exist in our database.
 * This syncs Clerk's Organization data with our local Workspace table.
 */
export async function syncClerkOrgWithWorkspace(userData: {
  id: string;
  name: string;
  email: string;
  image?: string;
}, orgData?: {
  id: string;
  name: string;
  slug: string;
  role: string;
}) {
  if (!db) return null;

  try {
    // 1. Upsert user
    await db.insert(user).values({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: user.id,
      set: {
        name: userData.name,
        email: userData.email,
        image: userData.image,
        updatedAt: new Date(),
      }
    });

    if (!orgData) return null;

    // 2. Fetch the LATEST data from Clerk directly (don't trust the session token)
    let finalName = orgData.name;
    let finalSlug = orgData.slug;
    let finalImage = "";
    
    // Check if we already have this workspace in DB to see if we should skip image sync
    const existingWorkspace = await db.query.workspace.findFirst({
      where: eq(workspace.id, orgData.id)
    });

    try {
      const client = await clerkClient();
      const org = await client.organizations.getOrganization({ organizationId: orgData.id });
      if (org) {
        finalName = org.name;
        finalSlug = org.slug || orgData.slug;
        // Only take the image from Clerk if we don't have one locally yet
        // This prevents race conditions where a fresh upload via Workspace Tab 
        // is overwritten by an older image URL from Clerk API during revalidation.
        finalImage = existingWorkspace?.image || org.imageUrl || "";
      }
    } catch (e) {
      console.warn("Failed to fetch fresh org data from Clerk, using provided data:", e);
    }

    // 3. Upsert workspace using Clerk Org ID
    await db.insert(workspace).values({
      id: orgData.id,
      name: finalName,
      slug: finalSlug,
      image: finalImage,
    }).onConflictDoUpdate({
      target: workspace.id,
      set: {
        name: finalName,
        slug: finalSlug,
        image: finalImage,
        updatedAt: new Date(),
      }
    });

    // 4. Upsert membership
    await db.insert(membership).values({
      workspaceId: orgData.id,
      userId: userData.id,
      role: orgData.role.includes("admin") ? "owner" : "member",
    }).onConflictDoUpdate({
      target: [membership.workspaceId, membership.userId],
      set: {
        role: orgData.role.includes("admin") ? "owner" : "member",
        updatedAt: new Date(),
      }
    });

    return {
      workspaceId: orgData.id,
      role: orgData.role,
      workspaceName: finalName,
      workspaceSlug: finalSlug
    };
  } catch (error) {
    console.error("Failed to sync Clerk Org:", error);
    return null;
  }
}

/**
 * Gets all entities (Level 2) for a specific workspace.
 */
export async function getEntities(workspaceId: string, type?: string) {
  if (!db) return [];
  
  try {
    let query = db
      .select()
      .from(entity)
      .where(eq(entity.workspaceId, workspaceId));
      
    if (type) {
      query = db
        .select()
        .from(entity)
        .where(
          and(
            eq(entity.workspaceId, workspaceId),
            eq(entity.type, type)
          )
        );
    }
    
    return await query.orderBy(entity.name);
  } catch (error) {
    console.error("Failed to fetch entities:", error);
    return [];
  }
}

/**
 * Creates a new entity for a workspace.
 */
export async function createEntity(workspaceId: string, data: { name: string, type: string, location?: string }) {
  if (!db) return null;
  
  try {
    const id = `ent-${Math.random().toString(36).substring(2, 9)}`;
    const [newEntity] = await db.insert(entity).values({
      id,
      workspaceId,
      name: data.name,
      type: data.type,
      location: data.location,
    }).returning();
    
    return newEntity;
  } catch (error) {
    console.error("Failed to create entity:", error);
    return null;
  }
}

/**
 * Invites a new member (Legacy - use Clerk instead where possible)
 */
export async function inviteMember(workspaceId: string, email: string, role: string, invitedBy: string) {
  try {
    const client = await clerkClient();
    
    // Map local roles to Clerk organization roles
    const clerkRole = role.toLowerCase().includes("admin") || role.toLowerCase() === "owner" 
      ? "org:admin" 
      : "org:member";

    await client.organizations.createOrganizationInvitation({
      organizationId: workspaceId,
      emailAddress: email,
      role: clerkRole,
      inviterUserId: invitedBy,
    });
    
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to invite member:", error);
    return { 
      success: false, 
      error: error.errors?.[0]?.message || error.message || "Failed to invite member" 
    };
  }
}

/**
 * Fetches pending invitations directly from Clerk
 */
export async function getPendingInvitations(workspaceId: string) {
  try {
    const client = await clerkClient();
    const invitations = await client.organizations.getOrganizationInvitationList({
      organizationId: workspaceId,
      status: ["pending"],
    });

    return (invitations.data || []).map(inv => ({
      id: inv.id,
      name: "",
      email: inv.emailAddress,
      role: inv.role === "org:admin" ? "admin" : "member",
      status: "Pending" as const,
      image: undefined
    }));
  } catch (error) {
    console.error("Failed to fetch invitations from Clerk:", error);
    return [];
  }
}

/**
 * Removes a member or invitation
 */
export async function removeMember(workspaceId: string, userId: string, isInvitation = false) {
  if (!db) return { success: false };
  
  try {
    const client = await clerkClient();

    if (isInvitation) {
      // 1. Revoke in Clerk
      try {
        await client.organizations.revokeOrganizationInvitation({
          organizationId: workspaceId,
          invitationId: userId,
          requestingUserId: "system",
        });
      } catch (ce) {
        console.warn("Clerk invitation revoke failed (maybe already accepted):", ce);
      }
      // No local deletion needed anymore as the table is gone
    } else {
      // 1. Remove from Clerk Organization
      try {
        await client.organizations.deleteOrganizationMembership({
          organizationId: workspaceId,
          userId: userId,
        });
      } catch (ce) {
        console.warn("Clerk member removal failed:", ce);
      }

      // 2. Delete locally
      await db.delete(membership).where(
        and(
          eq(membership.workspaceId, workspaceId),
          eq(membership.userId, userId)
        )
      );
    }
    
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove member:", error);
    return { success: false, error: "Database error" };
  }
}

/**
 * Updates a member's role
 */
export async function updateMemberRole(workspaceId: string, userId: string, role: string) {
  if (!db) return { success: false };
  
  try {
    // 1. Sync with Clerk
    try {
      const client = await clerkClient();
      const clerkRole = role.toLowerCase().includes("admin") || role.toLowerCase() === "owner" 
        ? "org:admin" 
        : "org:member";

      await client.organizations.updateOrganizationMembership({
        organizationId: workspaceId,
        userId: userId,
        role: clerkRole,
      });
    } catch (ce) {
      console.warn("Clerk role update failed:", ce);
    }

    // 2. Update locally
    await db.update(membership)
      .set({ role: role.toLowerCase() as any })
      .where(
        and(
          eq(membership.workspaceId, workspaceId),
          eq(membership.userId, userId)
        )
      );
      
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to update member role:", error);
    return { success: false, error: "Database error" };
  }
}

/**
 * Updates a member's app-specific roles
 */
export async function updateMemberAppRoles(workspaceId: string, userId: string, appRoles: Record<string, string>) {
  if (!db) return { success: false };
  
  try {
    // Perform updates in a transaction for the new workspaceAppRole table
    await db.transaction(async (tx) => {
      for (const [appId, roleName] of Object.entries(appRoles)) {
        if (!roleName) {
          // If role is empty/none, delete the access
          await tx.delete(workspaceAppRole)
            .where(
              and(
                eq(workspaceAppRole.workspaceId, workspaceId),
                eq(workspaceAppRole.userId, userId),
                eq(workspaceAppRole.appId, appId)
              )
            );
          continue;
        }

        // Upsert the app role
        await tx.insert(workspaceAppRole)
          .values({
            workspaceId,
            userId,
            appId,
            roleName,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [workspaceAppRole.workspaceId, workspaceAppRole.userId, workspaceAppRole.appId],
            set: {
              roleName,
              updatedAt: new Date(),
            },
          });
      }
    });
      
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to update app roles:", error);
    return { success: false, error: "Database error" };
  }
}

/**
 * Updates workspace settings and syncs with Clerk
 */
export async function updateWorkspace(workspaceId: string, data: { name?: string, slug?: string, image?: string }) {
  if (!db) return { success: false };
  
  try {
    // 1. Update Clerk Organization if possible
    try {
      const client = await clerkClient();
      console.log(`Syncing with Clerk: ID=${workspaceId}, Name=${data.name}`);
      
      const updatePayload: any = { name: data.name };
      if (data.slug) updatePayload.slug = data.slug;
      
      // Note: Updating Logo in Clerk usually requires a file upload. 
      // If we only have a URL from our storage (like ImageKit), 
      // we primarily store it in our database.
      
      try {
        await client.organizations.updateOrganization(workspaceId, updatePayload);
        
        // 1.2 Update Logo in Clerk if image URL is provided
        if (data.image) {
          console.log("Syncing logo with Clerk...");
          try {
            const response = await fetch(data.image);
            if (response.ok) {
              const blob = await response.blob();
              const file = new File([blob], "logo.png", { type: blob.type || 'image/png' });
              
              await client.organizations.updateOrganizationLogo(workspaceId, {
                file: file
              });
              console.log("Clerk logo sync successful");
            }
          } catch (logoError) {
            console.error("Failed to sync logo with Clerk:", logoError);
            // We don't fail the whole operation if only the logo sync fails
          }
        }
      } catch (clerkError: any) {
        // Fallback: If slugs are disabled in Clerk dashboard, try updating name only
        if (clerkError.message?.toLowerCase().includes("slug")) {
          console.warn("Clerk Slugs not enabled, updating name only");
          await client.organizations.updateOrganization(workspaceId, { name: data.name });
        } else {
          throw clerkError;
        }
      }
      
      console.log("Clerk sync successful");
    } catch (clerkError: any) {
      console.error("Clerk Sync Error:", clerkError);
      return { 
        success: false, 
        error: clerkError.errors?.[0]?.message || clerkError.message || "Failed to sync with Clerk" 
      };
    }

    // 2. Update local database
    await db.update(workspace)
      .set({ 
        name: data.name,
        slug: data.slug,
        image: data.image,
        updatedAt: new Date()
      })
      .where(eq(workspace.id, workspaceId));
      
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to update workspace:", error);
    return { success: false, error: "Database error" };
  }
}

/**
 * Deletes a workspace
 */
export async function deleteWorkspace(workspaceId: string) {
    if (!db) return { success: false };
    try {
        await db.transaction(async (tx: any) => {
            await tx.delete(membership).where(eq(membership.workspaceId, workspaceId));
            await tx.delete(entity).where(eq(entity.workspaceId, workspaceId));
            await tx.delete(workspace).where(eq(workspace.id, workspaceId));
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete workspace:", error);
        return { success: false };
    }
}
