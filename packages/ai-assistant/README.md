# @workspace/ai-assistant

Package ini menyediakan komponen Asisten AI yang dapat melayang (floating) dan interaktif untuk aplikasi web.

## Fitur

- 🚀 **Multi-Provider Support**: Mendukung OpenRouter, OpenAI, Anthropic, dan provider lainnya melalui konfigurasi fleksibel.
- ✨ **Premium UI**: Dibuat dengan Framer Motion untuk animasi yang halus dan Lucide React untuk ikonografi.
- 📝 **Markdown Support**: Mendukung rendering pesan dalam format Markdown yang rapi.
- 📱 **Responsive Design**: Optimal untuk tampilan mobile maupun desktop.
- 🛠️ **Configurable**: Pesan awal, model, dan provider dapat disesuaikan melalui props.

## Cara Instalasi

Pastikan package ini sudah terdaftar di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/ai-assistant": "workspace:*"
  }
}
```

Lalu jalankan `pnpm install`.

## Penggunaan Dasar

### 1. Import Komponen
```tsx
import { AIAssistant } from "@workspace/ai-assistant";
```

### 2. Implementasi di Komponen Client
```tsx
export function MyPage() {
  return (
    <AIAssistant 
      provider="openrouter"
      apiKey="YOUR_API_KEY"
      modelId="google/gemini-2.0-flash-001"
      initialMessage="Halo, ada yang bisa saya bantu?"
    />
  );
}
```

## Props

| Prop | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `provider` | `string` | `"openrouter"` | Nama provider AI yang digunakan. |
| `apiKey` | `string` | `-` | API Key untuk autentikasi ke provider. |
| `modelId` | `string` | `-` | ID Model spesifik (misal: `gpt-4o-mini`). |
| `baseUrl` | `string` | `-` | URL API kustom jika menggunakan proxy/custom provider. |
| `initialMessage` | `string` | `"Halo! Saya asisten AI..."` | Pesan pertama yang ditampilkan saat chat dibuka. |

## Integrasi Monorepo

Package ini didesain untuk bekerja dengan `AIProvider` yang ada di `apps/web`. Disarankan menggunakan wrapper agar konfigurasi API Key tetap aman dan terpusat.

---
*Dibuat untuk ekosistem Web SLO.*
