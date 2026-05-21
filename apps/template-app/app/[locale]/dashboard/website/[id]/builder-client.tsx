"use client";

import React, { useState, useEffect, useRef } from "react";
import { PuckEditor } from "@workspace/landing-page";
import { updateLandingPage } from "../actions";
import { Data } from "@puckeditor/core";
import { useWebMCP, WebMCPTool } from "@workspace/webmcp";
import { AIAssistant } from "@workspace/ai-assistant";
import { FloatingActionButton } from "@workspace/ui/components/floating-action-button";
import { AIChatOverlay } from "@workspace/ui/components/ai-chat-overlay";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const editorRef = useRef<any>(null); // Referensi untuk mengakses editor jika perlu

  // 1. Definisikan WebMCP Tools
  const tools: WebMCPTool[] = [
    {
      name: "get_page_content",
      description: "Mendapatkan konten landing page saat ini",
      inputSchema: { type: "object", properties: {} },
      execute: async () => puckData,
    },
    {
      name: "update_page_title",
      description: "Mengubah judul halaman landing page",
      inputSchema: {
        type: "object",
        properties: { title: { type: "string" } },
        required: ["title"]
      },
      execute: async (args) => {
        if (!puckData) throw new Error("Editor belum dimuat");
        const newData = { ...puckData };
        if (newData.root) {
            newData.root.props = { ...newData.root.props, title: args.title };
            setPuckData(newData);
            return { success: true, newTitle: args.title };
        }
        return { success: false, error: "Gagal memperbarui judul" };
      },
    }
  ];

  // 2. Registrasi WebMCP
  useWebMCP({ tools });

  const handleAICommand = async (command: string): Promise<string> => {
    // Di sini kita bisa mengintegrasikan dengan logic AI
    // Untuk saat ini, kita coba cek apakah ada tool yang cocok
    try {
        if (command.includes("judul") || command.includes("title")) {
            const match = command.match(/['"](.*?)['"]/);
            const title = match ? match[1] : "Judul Baru";
            await tools.find(t => t.name === "update_page_title")?.execute({ title });
            return `Judul berhasil diubah menjadi: ${title}`;
        }
        return "Saya mengerti Anda ingin: " + command + ". (Logika eksekusi tool sedang dikembangkan)";
    } catch (e: any) {
        return "Error: " + e.message;
    }
  };

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

  const handleOpenChat = () => {
    // Di sini Anda bisa membuka modal chat, atau memicu trigger AI agent
    alert("AI Agent siap membantu! Anda bisa mengetik perintah di sini (atau integrasikan dengan widget chat AI Anda)");
    console.log("WebMCP Tools tersedia di window.__WEBMCP_TOOLS__");
  };

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

      <FloatingActionButton onClick={() => setIsChatOpen(!isChatOpen)} />
      <AIChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSendMessage={handleAICommand}
      />
      <AIAssistant />
    </div>
  );
}

