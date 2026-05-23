"use client";

import React, { useState, useEffect } from "react";
import { PuckEditor } from "@workspace/landing-page";
import { updateLandingPage } from "../actions";
import { Data } from "@puckeditor/core";

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: any;
  status?: string;
  theme?: any;
  resolvedTheme?: any;
  workspaceId: string;
  fallbackConfigs?: {
    global?: any;
    workspace?: any;
    app?: any;
  };
}

export function BuilderClient({ pageData }: { pageData: PageData }) {
  const [mounted, setMounted] = useState(false);
  const [puckData, setPuckData] = useState<Data | null>(null);

  useEffect(() => {
    // Parse Puck content
    const parsedData: Data = (pageData.content && typeof pageData.content === 'object' && 'content' in pageData.content) 
      ? pageData.content as Data
      : { content: [], root: { props: { title: pageData.title } }, zones: {} };

    if (parsedData.root) {
      if (!parsedData.root.props) parsedData.root.props = {};
      (parsedData.root.props as any).status = pageData.status || "draft";
    }

    setPuckData(parsedData);
    setMounted(true);
  }, [pageData]);

  if (!mounted || !puckData) return null;

  const handleSave = async (data: Data) => {
    const status = (data.root?.props as any)?.status || "draft";
    await updateLandingPage(pageData.id, { 
      content: data as any,
      status: status,
    } as any);
  };

  const handleSaveTheme = async (themeConfig: any) => {
    try {
      await updateLandingPage(pageData.id, { theme: themeConfig });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Gagal menyimpan ke database" };
    }
  };

  return (
    <div className="relative">
      <PuckEditor 
        initialData={puckData} 
        onSave={handleSave} 
        title={`Edit Laman: ${pageData.title}`}
        workspaceId={pageData.workspaceId}
        appId={`lp-${pageData.id}`}
        fallbackConfigs={pageData.fallbackConfigs}
        initialTheme={pageData.theme}
        resolvedTheme={pageData.resolvedTheme}
        onSaveTheme={handleSaveTheme}
      />
    </div>
  );
}


