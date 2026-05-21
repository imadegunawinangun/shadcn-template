# @workspace/webmcp

Paket ini menyediakan infrastruktur untuk integrasi **Web Model Context Protocol (WebMCP)** ke dalam ekosistem aplikasi Nstok.

---

## 5W1H Framework

### 1. Who (Siapa)
Ditujukan untuk AI Agents (seperti Claude, Cursor, atau sistem asisten internal) yang terhubung ke browser pengguna, serta pengembang yang ingin mengekspos fungsionalitas UI sebagai *tools* yang dapat dieksekusi secara programatik.

### 2. What (Apa)
Sebuah *React Hook* (`useWebMCP`) dan definisi *TypeScript Types* (`WebMCPTool`) yang menjembatani antara fungsi internal aplikasi React/Next.js dengan protokol MCP di tingkat *browser/navigator*.

### 3. Where (Dimana)
Terletak di `packages/webmcp/src` dan dapat diimpor oleh aplikasi manapun di dalam monorepo (misalnya `apps/template-app` atau `apps/web`). Registrasi aktual terjadi di level client (browser) pada object `window.__WEBMCP_TOOLS__` dan `navigator.modelContext`.

### 4. When (Kapan)
Digunakan ketika aplikasi memiliki antarmuka kompleks (seperti *Landing Page Builder* atau *Form Editor*) dan kita ingin AI dapat memanipulasi *state* aplikasi tersebut secara langsung tanpa campur tangan manual dari pengguna.

### 5. Why (Mengapa)
*   **Otomatisasi**: Memungkinkan AI untuk "mengklik" atau "mengisi form" dengan mengeksekusi fungsi React state secara langsung.
*   **Konteks**: Memberikan AI pemahaman tentang *state* aplikasi saat ini melalui skema input yang terdefinisi dengan baik.
*   **Modularitas**: Memisahkan logika registrasi tool dari komponen UI utama.

### 6. How (Bagaimana)
Definisikan *tools* menggunakan interface `WebMCPTool`, lalu teruskan array *tools* tersebut ke hook `useWebMCP` di dalam *Client Component*.

---

## Contoh Penggunaan

Berikut adalah cara mengimplementasikan WebMCP di dalam komponen pembangun halaman (Builder):

```tsx
"use client";

import { useState } from "react";
import { useWebMCP, WebMCPTool } from "@workspace/webmcp";

export function MyPageBuilder() {
  const [sections, setSections] = useState([]);

  // 1. Definisikan tools
  const tools: WebMCPTool[] = [
    {
      name: "add_section",
      description: "Menambahkan section baru ke halaman",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          type: { type: "string", enum: ["hero", "features"] }
        },
        required: ["title", "type"]
      },
      execute: async (input) => {
        setSections(prev => [...prev, { id: Date.now(), ...input }]);
        return {
          content: [{ type: "text", text: `Section ${input.title} berhasil ditambahkan.` }]
        };
      }
    }
  ];

  // 2. Daftarkan tools ke browser
  useWebMCP({ tools });

  return (
    <div>
      {/* Render builder UI Anda */}
    </div>
  );
}
```

## Ekspor Utama

*   `useWebMCP`: Hook untuk mendaftarkan dan membersihkan tools secara otomatis saat komponen di-mount/unmount.
*   `WebMCPTool`: Interface TypeScript untuk mendefinisikan struktur nama, deskripsi, schema input, dan fungsi eksekusi dari sebuah tool.
