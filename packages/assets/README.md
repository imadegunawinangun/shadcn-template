# Assets Feature (@workspace/assets)

Modul manajemen aset digital dan galeri media terpusat untuk seluruh ekosistem aplikasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Admin Konten, Pemilik Toko, dan Pengembang. |
| **What** (Apa) | Paket modular untuk pengelolaan media (gambar, video, dokumen) dengan fitur galeri, upload, dan pustaka eksternal. |
| **Where** (Dimana) | Digunakan pada dashboard aset (`/dashboard/assets`) atau sebagai modal pemilihan media di berbagai form aplikasi. |
| **When** (Kapan) | Digunakan saat mengunggah aset baru, mengelola library media, atau memilih gambar untuk konten/produk. |
| **Why** (Mengapa) | Untuk standarisasi manajemen media, optimasi ukuran file otomatis, dan memudahkan penggunaan kembali aset digital. |
| **How** (Bagaimana) | Mengintegrasikan layanan **ImageKit** dengan komponen UI kustom yang mendukung navigasi folder dan pencarian aset. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/assets": "workspace:*"
  }
}
```

### 2. Gunakan ImageKit Media Library
Implementasikan galeri media resmi ImageKit dalam komponen atau halaman:

```tsx
import { ImageKitMediaLibrary } from "@workspace/assets"

export default function AssetsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pustaka Media</h1>
      <ImageKitMediaLibrary 
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''}
        onSelect={(url) => console.log("Aset terpilih:", url)}
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/assets` dirancang untuk bekerja dengan:

- **`@workspace/imagekit`**: Sebagai penyedia infrastruktur pengunggahan dan transformasi gambar.
- **`@workspace/ui`**: Menyediakan elemen UI seperti `Tabs`, `Dialog`, `ScrollArea`, dan `Button`.
- **`apps/web`**: Aplikasi utama yang mengelola rute media dan menangani state pemilihan aset di level dashboard.

---

## Contoh Kasus Penggunaan

1.  **Pengelolaan Produk**:
    Pemilik toko mengunggah foto produk baru melalui galeri dan memilih salah satu aset sebagai gambar utama (thumbnail).

2.  **Pengaturan Branding**:
    Admin mengganti logo aplikasi melalui form pengaturan yang membuka modal `ImageKitMediaLibrary` untuk memilih file dari library yang sudah ada.

3.  **Optimasi Gambar Otomatis**:
    Aplikasi memanggil gambar melalui aset library ini untuk mendapatkan URL yang sudah teroptimasi (misal: otomatis format WebP dan ukuran responsif) via ImageKit.

---
*Dibuat untuk ekosistem Web SLO.*

