# Landing Page Builder Feature (@workspace/landing-page)

Paket ini menyediakan mesin inti (Core Engine) untuk sistem Landing Page Builder modular, memungkinkan pembuatan halaman pendaratan secara visual melalui antarmuka editor dan renderer dinamis.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengembang yang ingin mengintegrasikan fitur "Website Builder" ke dalam aplikasinya. |
| **What** (Apa) | Kumpulan komponen inti (Renderer, Library, Editor) untuk menyusun landing page berbasis data JSON. |
| **Where** (Dimana) | Digunakan di sisi dashboard (untuk pengeditan) dan sisi publik (untuk tampilan akhir). |
| **When** (Kapan) | Digunakan saat membangun sistem Manajemen Konten (CMS) atau Website Builder mandiri. |
| **Why** (Mengapa) | Memisahkan logika pembangunan halaman dari aplikasi utama agar fitur builder bersifat modular dan reusable. |
| **How** (Bagaimana) | Mengambil data JSON dari database dan memetakannya ke komponen marketing melalui mesin Renderer. |

---

## Arsitektur Modular (4 Pilar Utama)

Paket ini mengimplementasikan sistem **Modular Data-Driven Rendering**:

1. **Section Library**: Katalog varian layout yang bisa dipilih pengguna.
2. **Section Editor**: Antarmuka untuk mengedit isi konten (teks, gambar, dll) secara dinamis.
3. **Renderer**: Mesin yang mengubah data JSON menjadi tampilan website fungsional.
4. **Data Sync**: Sistem sinkronisasi antara editor visual dengan skema database.

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/landing-page": "workspace:*"
  }
}
```

### 2. Implementasi Renderer (Sisi Publik)
Gunakan `LandingPageRenderer` untuk menampilkan konten dari database:

```tsx
import { LandingPageRenderer } from "@workspace/landing-page";

export default function PublicPage({ data }) {
  return <LandingPageRenderer sections={data.content} />;
}
```

### 3. Implementasi Editor (Sisi Dashboard)
Gunakan `SectionLibrary` dan `SectionEditor` untuk membangun antarmuka builder:

```tsx
import { SectionLibrary, SectionEditor } from "@workspace/landing-page";

// ... di dalam komponen dashboard Anda
<SectionLibrary onAddSection={handleNewSection} />
<SectionEditor section={selectedSection} onUpdate={handleUpdate} />
```

---

## Integrasi Monorepo

- **`@workspace/marketing`**: Bergantung pada paket marketing sebagai penyedia "Mesin Visual" (komponen Hero, Features, dll).
- **`@workspace/ui`**: Menggunakan komponen UI dasar seperti `Dialog`, `Input`, dan `Button` untuk membangun antarmuka editor.
- **`apps/template-app`**: Aplikasi referensi utama yang mengonsumsi paket ini untuk fitur Dashboard Website.

---
*Dibuat untuk ekosistem Web SLO.*
