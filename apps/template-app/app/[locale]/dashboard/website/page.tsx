import React from "react";
import { auth } from "@clerk/nextjs/server";
import { getSiteConfig } from "@workspace/database";
import { getLandingPages } from "./actions";
import { WebsitePagesClient } from "./pages-client";

export default async function WebsitePagesPage() {
  const { orgId, userId } = await auth();
  const workspaceId = orgId || userId;
  
  if (!workspaceId) {
    return <div>Unauthorized</div>;
  }
  
  const pages = await getLandingPages();
  const workspaceConfig = await getSiteConfig(workspaceId, null);

  return (
    <WebsitePagesClient 
      initialPages={pages as any} 
      workspaceId={workspaceId} 
      workspaceTheme={workspaceConfig?.theme as any} 
    />
  );
}

