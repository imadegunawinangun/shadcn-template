import React from "react";
import { 
  DashboardShell, 
  DashboardHeader 
} from "@workspace/dashboard";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { getPosts, createPost } from "@workspace/database";
import { BlogClient } from "./blog-client";
import { redirect } from "next/navigation";

export default async function BlogPagesPage() {
  const posts = await getPosts();

  async function handleCreate(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    
    if (!title || !slug) return;
    
    const { id } = await createPost({ title, slug });
    redirect(`/dashboard/blog/editor/${id}`);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manajemen Blog & CMS"
        text="Kelola semua artikel blog dan konten CMS Anda secara terpusat."
      >
        <form action={handleCreate} className="flex gap-2">
           <input name="title" placeholder="Judul Artikel" className="h-9 px-3 rounded-md border bg-background text-sm" required />
           <input name="slug" placeholder="slug" className="h-9 px-3 rounded-md border bg-background text-sm w-32" required />
           <Button type="submit" size="sm">
            <Plus className="size-4 mr-2" /> Tulis Baru
           </Button>
        </form>
      </DashboardHeader>

      <BlogClient initialPosts={posts as any} />
    </DashboardShell>
  );
}
