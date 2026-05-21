# Search Feature (@workspace/search)

Modul pencarian global (Command Palette) untuk navigasi cepat dan pencarian data di seluruh ekosistem aplikasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengguna yang menginginkan efisiensi tinggi (Power Users) dan Administrator. |
| **What** (Apa) | Paket modular yang menyediakan antarmuka pencarian universal (Command-K) untuk rute navigasi dan objek data. |
| **Where** (Dimana) | Muncul sebagai modal melayang di tengah layar yang dapat dipicu dari mana saja dalam aplikasi. |
| **When** (Kapan) | Digunakan untuk berpindah menu dengan cepat, mencari data spesifik (Produk/User), atau menjalankan perintah sistem. |
| **Why** (Mengapa) | Meningkatkan produktivitas dengan mengurangi jumlah klik dan mempermudah akses ke fitur-fitur yang terpendam. |
| **How** (Bagaimana) | Menggunakan komponen `GlobalSearch` berbasis command-menu yang mendukung input teks dan shortcut keyboard. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/search": "workspace:*"
  }
}
```

### 2. Implementasi Global Search
Tambahkan komponen ke dalam layout utama atau header:

```tsx
import { GlobalSearch } from "@workspace/search"

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Tekan <kbd className="bg-muted px-1 rounded">⌘K</kbd> untuk mencari
      </div>
      <GlobalSearch 
        onSelect={(item) => window.location.href = item.href}
      />
    </header>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/search` berkolaborasi dengan modul berikut:

- **`@workspace/ui`**: Menggunakan komponen dasar `Command`, `Dialog`, dan elemen UI shadcn lainnya.
- **`@workspace/navigation`**: Mengambil daftar entri menu dari `GLOBAL_NAV_REGISTRY` untuk dijadikan saran navigasi otomatis.
- **`apps/web`**: Aplikasi utama yang mengelola logika pencarian data dinamis (seperti mencari user atau produk dari database).

---

## Contoh Kasus Penggunaan

1.  **Instant Navigation**:
    Pengguna mengetik "Settings" di command palette untuk langsung berpindah ke halaman pengaturan tanpa harus mencari ikon gerigi di sidebar.

2.  **Global Data Lookup**:
    Admin mencari nama pelanggan tertentu secara global untuk melihat profil atau riwayat pesanan mereka tanpa berpindah modul.

3.  **Shortcut Workflow**:
    Memungkinkan tim operasional yang sudah terbiasa dengan keyboard untuk mengoperasikan aplikasi dengan lebih cepat melalui kombinasi shortcut dan teks.

---
*Dibuat untuk ekosistem Web SLO.*
