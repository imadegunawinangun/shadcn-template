"use client";

import { useEffect } from "react";
import { useWebMCP } from "@workspace/webmcp";
import { toast } from "sonner";

export function DemoToolsRegistry() {
  const demoTools = [
    {
      name: "bukaHalaman",
      description: "Membuka halaman tertentu di aplikasi. Parameter tujuan berupa string (misalnya '/dashboard' atau '/settings')",
      inputSchema: {
        type: "object",
        properties: {
          tujuan: { type: "string" }
        },
        required: ["tujuan"]
      },
      mode: "deterministic" as const,
      requiresApproval: false,
      execute: async (args: any) => {
        window.location.href = args.tujuan;
        return `Berhasil berpindah ke halaman ${args.tujuan}`;
      }
    },
    {
      name: "publishHalaman",
      description: "Mempublish halaman builder saat ini agar bisa diakses oleh publik.",
      inputSchema: {
        type: "object",
        properties: {},
      },
      mode: "reasoning" as const,
      requiresApproval: true,
      execute: async () => {
        toast.success("Halaman berhasil dipublish (DEMO)");
        return "Halaman berhasil dipublish.";
      }
    },
    {
      name: "ubahTema",
      description: "Mengubah tema aplikasi (dark/light)",
      inputSchema: {
        type: "object",
        properties: {
          tema: { type: "string", enum: ["dark", "light"] }
        },
        required: ["tema"]
      },
      mode: "deterministic" as const,
      execute: async (args: any) => {
        if (args.tema === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        return `Tema berhasil diubah ke ${args.tema}`;
      }
    }
  ];

  useWebMCP({ tools: demoTools as any });

  return null; // This component doesn't render anything
}
