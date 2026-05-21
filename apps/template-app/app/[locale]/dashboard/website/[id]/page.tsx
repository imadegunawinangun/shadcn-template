import React from "react";
import { getLandingPage } from "../actions";
import { BuilderClient } from "./builder-client";
import { notFound } from "next/navigation";

export default async function WebsiteBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getLandingPage(id);

  if (!page) {
    notFound();
  }

  return <BuilderClient pageData={page as any} />;
}
