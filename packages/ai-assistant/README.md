Package ini menyediakan komponen Asisten AI yang dapat melayang (floating) dan interaktif untuk aplikasi web.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengguna aplikasi yang membutuhkan bantuan cepat, ringkasan data, atau panduan fitur. |
| **What** (Apa) | Widget asisten AI interaktif yang terintegrasi dengan berbagai LLM (Large Language Models). |
| **Where** (Dimana) | Diletakkan sebagai komponen melayang (floating widget) di pojok layar atau panel chat di dashboard. |
| **When** (Kapan) | Digunakan saat pengguna memiliki pertanyaan kontekstual, butuh bantuan navigasi, atau pengolahan data instan. |
| **Why** (Mengapa) | Mengurangi beban support manual dan meningkatkan efisiensi pengguna dengan memberikan jawaban real-time 24/7. |
| **How** (Bagaimana) | Berkomunikasi dengan AI providers melalui streaming API dan merendernya dengan UI yang halus (Framer Motion). |


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

## Contoh Kasus Penggunaan

1.  **Onboarding Helper**:
    Membantu pengguna baru memahami fitur-fitur kompleks dengan menjawab pertanyaan seperti "Di mana saya bisa mengatur metode pembayaran?".

2.  **Smart Data Analyst**:
    Membantu administrator meringkas laporan penjualan atau statistik mingguan menjadi poin-poin yang mudah dipahami.

3.  **Natural Language Action**:
    Memungkinkan pengguna melakukan perintah lewat chat, misalnya "Tampilkan semua pesanan dari minggu lalu" dan asisten akan mengarahkan atau memfilter data tersebut.

## Integrasi Monorepo

Package ini didesain untuk bekerja dengan `AIProvider` yang ada di `apps/web`. Disarankan menggunakan wrapper agar konfigurasi API Key tetap aman dan terpusat.

---
*Dibuat untuk ekosistem Web SLO.*
