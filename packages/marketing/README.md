# Marketing Feature (@workspace/marketing)

Kumpulan komponen UI premium untuk membangun halaman pendaratan (Landing Page) yang responsif dan persuasif.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Tim Pemasaran, Pengembang Web, dan Calon Pelanggan. |
| **What** (Apa) | Paket modular yang menyediakan komponen section untuk Landing Page (Hero, Features, Pricing, Testimonials). |
| **Where** (Dimana) | Digunakan pada aplikasi publik atau halaman depan sistem sebelum login. |
| **When** (Kapan) | Digunakan saat membangun situs promosi, halaman fitur produk, atau tabel harga layanan. |
| **Why** (Mengapa) | Memberikan kesan pertama yang profesional (Premium Look) dan meningkatkan konversi pengunjung menjadi pengguna. |
| **How** (Bagaimana) | Menyediakan komponen siap pakai yang fleksibel dengan desain modern berbasis shadcn/ui. |

---

## Arsitektur Modular Rendering (4 Pilar)

Paket ini merupakan inti dari **Mesin Visual** dalam sistem Landing Page Builder. Arsitekturnya didasarkan pada 4 pilar utama:

1. **Section Library (Katalog)**: Menyediakan ID varian unik (#001 - #104) sebagai identitas visual untuk setiap modul.
2. **Builder Engine (Data)**: Mengonversi konfigurasi pengguna menjadi objek JSON yang menyimpan tipe komponen dan ID varian.
3. **Marketing Components (Visual)**: Setiap komponen di paket ini (`Hero`, `Features`, dll) bersifat **Variant-Aware**, artinya ia akan mengubah layout secara otomatis berdasarkan prop `variant` (ID Library) yang dikirimkan.
4. **Renderer (Jembatan)**: Logika cerdas yang memetakan data JSON dari database ke komponen nyata dalam paket ini secara dinamis.

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/marketing": "workspace:*"
  }
}
```

### 2. Bangun Landing Page
Susun komponen marketing untuk membentuk halaman depan:

```tsx
import { Hero, Features, Pricing } from "@workspace/marketing"

export default function HomePage() {
  return (
    <main>
      <Hero 
        title="Kelola Bisnis Lebih Cerdas"
        description="Platform all-in-one untuk efisiensi operasional Anda."
      />
      <Features />
      <Pricing />
    </main>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/marketing` dirancang sebagai wajah depan ekosistem:

- **`@workspace/ui`**: Menggunakan fondasi komponen visual seperti `Button`, `Card`, `Badge`, dan sistem tipografi yang konsisten.
- **`@workspace/billing`**: Berintegrasi dengan komponen `Pricing` untuk menampilkan detail paket harga yang sinkron dengan backend billing.
- **`apps/web`**: Aplikasi utama yang menggunakan paket ini untuk menyajikan konten publik kepada pengunjung internet.

---

## Contoh Kasus Penggunaan

1.  **Product Showcase**:
    Menampilkan fitur-fitur unggulan aplikasi (seperti AI Assistant atau Workflow Automation) dengan visual yang menarik untuk calon pembeli.

2.  **Flexible Pricing Display**:
    Menyajikan perbandingan antar paket (Starter vs Grow) secara transparan agar pelanggan dapat memilih layanan yang paling sesuai dengan skala bisnis mereka.

3.  **High-Conversion Landing**:
    Menggunakan section Hero yang dinamis dengan Call-to-Action (CTA) yang jelas untuk mendorong pengunjung segera melakukan pendaftaran (Sign Up).

---
*Dibuat untuk ekosistem Web SLO.*
