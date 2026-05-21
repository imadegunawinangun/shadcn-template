# @workspace/database - Branding Module

Modul ini menangani logika hirarki branding terpadu untuk seluruh ekosistem aplikasi Nstok.

## 5W1H Overview

*   **Who (Siapa)**: Digunakan oleh pengembang yang membangun UI multi-tenant dan ingin memastikan konsistensi brand di seluruh aplikasi.
*   **What (Apa)**: Logika resolusi tema 4-level (Level 0 sampai Level 3) yang mengambil data dari database Neon dan memberikan fallback yang tepat.
*   **Where (Dimana)**: Terletak di `packages/database/src/branding.ts` dan diekspor melalui index utama.
*   **When (Kapan)**: Dipanggil saat inisialisasi aplikasi, render landing page, atau saat memuat preview di builder UI.
*   **Why (Mengapa)**: Untuk mendukung skenario bisnis di mana satu Organisasi memiliki banyak aplikasi dengan identitas visual yang bisa diseragamkan (Level 1) atau dibedakan per aplikasi (Level 2).
*   **How (Bagaimana)**: Menggunakan fungsi `resolveBranding(workspaceId, appId, entityTheme)` untuk mendapatkan objek tema final.

## Hirarki Prioritas (0-3)

Sistem ini mengikuti urutan prioritas berikut (dari yang paling spesifik ke yang paling umum):

1.  **Level 3: Entity Theme** (e.g., Landing Page) - Paling spesifik, menimpa segalanya.
2.  **Level 2: App / Site Theme** - Spesifik untuk aplikasi tertentu (misal: hanya untuk POS).
3.  **Level 1: Organization Theme** - Standar branding untuk seluruh aplikasi dalam satu perusahaan.
4.  **Level 0: System Default** - Fallback netral jika tidak ada kustomisasi sama sekali di database.

## Contoh Penggunaan

```typescript
import { resolveBranding } from "@workspace/database";

// Di dalam Server Action atau Page
const theme = await resolveBranding(
  orgId, 
  "posnstok",   // appId
  page.theme    // Level 3 (opsional)
);

// Hasil 'theme' dapat langsung diinjeksikan ke LandingPageRenderer atau CSS Variables
```

## Integrasi Monorepo

Modul ini bergantung pada:
*   `site_config` table: Tempat penyimpanan Level 1 dan Level 2.
*   `landing_page` table: Contoh penyimpanan Level 3.
