"use server";

import { db, post, workspace, getSiteConfig, resolveBranding } from "./index";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function getPosts() {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  const posts = await db
    .select()
    .from(post)
    .where(eq(post.workspaceId, orgId))
    .orderBy(desc(post.updatedAt));

  return posts;
}

export async function getPost(id: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  const [p] = await db
    .select()
    .from(post)
    .where(
      and(
        eq(post.id, id),
        eq(post.workspaceId, orgId)
      )
    );

  if (!p) return null;

  return p;
}

export async function createPost(data: { title: string; slug: string }) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  const id = `post_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(post).values({
    id,
    workspaceId: orgId,
    title: data.title,
    slug: data.slug,
    status: "draft",
    content: "",
    categories: [],
    tags: []
  });

  revalidatePath("/dashboard/blog");
  return { id };
}

export async function updatePost(id: string, data: any) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  await db
    .update(post)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(post.id, id),
        eq(post.workspaceId, orgId)
      )
    );

  revalidatePath("/dashboard/blog");
  revalidatePath(`/dashboard/blog/editor/${id}`);
}

export async function deletePost(id: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  await db
    .delete(post)
    .where(
      and(
        eq(post.id, id),
        eq(post.workspaceId, orgId)
      )
    );

  revalidatePath("/dashboard/blog");
}

export async function getPostBySlug(slug: string) {
  const [p] = await db
    .select()
    .from(post)
    .where(eq(post.slug, slug));

  return p || null;
}
