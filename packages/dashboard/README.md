# Dashboard Feature (@workspace/dashboard)

Paket UI utama yang menyediakan kerangka layout, sistem navigasi, dan komponen visualisasi untuk area internal aplikasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Seluruh Pengguna Terdaftar (Admin, Member, Owner). |
| **What** (Apa) | Kerangka kerja (Framework) layout dashboard yang mencakup Sidebar, Header, Shell, dan komponen visualisasi data. |
| **Where** (Dimana) | Digunakan pada seluruh rute internal aplikasi yang diawali dengan `/dashboard`. |
| **When** (Kapan) | Digunakan saat pengguna mengelola data operasional, melihat statistik, atau menavigasi antar modul aplikasi. |
| **Why** (Mengapa) | Menyediakan standar antarmuka yang konsisten, responsif, dan siap pakai untuk mempercepat pengembangan fitur internal. |
| **How** (Bagaimana) | Menggunakan komponen `DashboardLayout` sebagai wrapper utama yang mengintegrasikan sistem navigasi dan konten aplikasi. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/dashboard": "workspace:*"
  }
}
```

### 2. Implementasi Layout di Halaman
Gunakan `DashboardLayout` sebagai pembungkus halaman di `layout.tsx` dashboard:

```tsx
import { DashboardLayout } from "@workspace/dashboard"
import { navSections, currentUser } from "@/lib/navigation"

export default function Layout({ children }) {
  return (
    <DashboardLayout 
      sections={navSections} 
      user={currentUser}
    >
      {children}
    </DashboardLayout>
  )
}
```

### 3. Menggunakan Komponen Statistik
Gunakan `DashboardStats` untuk menampilkan ringkasan data:

```tsx
import { DashboardStats } from "@workspace/dashboard"

const stats = [
  { title: "Total Penjualan", value: "Rp 12.500.000", description: "+15% dari bulan lalu" },
  { title: "Pelanggan Baru", value: "48", description: "12 hari ini" }
]

export function OverviewPage() {
  return <DashboardStats stats={stats} />
}
```

---

## Integrasi Monorepo

Paket `@workspace/dashboard` dirancang untuk bekerja dengan:

- **`@workspace/navigation`**: Mendefinisikan struktur menu, label, dan ikon yang akan muncul di sidebar.
- **`@workspace/ui`**: Menyediakan komponen dasar (shadcn/ui) seperti `Sidebar`, `Separator`, `Avatar`, dan `Skeleton`.
- **`apps/web`**: Aplikasi utama yang menentukan rute-rute spesifik dan menyatukan semua komponen dashboard menjadi satu sistem utuh.

---

## Contoh Kasus Penggunaan

1.  **Unified Experience**:
    Memastikan pengguna merasa berada di aplikasi yang sama saat berpindah dari halaman "Inventaris" ke "Laporan Keuangan" melalui navigasi yang seragam.

2.  **Executive Dashboard**:
    Menampilkan visualisasi data berupa grafik pertumbuhan (`Overview`) dan daftar transaksi terbaru (`RecentSales`) untuk membantu pemilik bisnis mengambil keputusan.

3.  **Mobile Friendly Operations**:
    Sidebar yang dapat diciutkan memberikan ruang kerja maksimal bagi pengguna saat mengelola data melalui tablet atau perangkat mobile di lapangan.

---
*Dibuat untuk ekosistem Web SLO.*
