import React from "react";
import { getPost } from "@workspace/database";
import { EditorClient } from "./editor-client";
import { notFound } from "next/navigation";

export default async function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return <EditorClient postData={post as any} />;
}
