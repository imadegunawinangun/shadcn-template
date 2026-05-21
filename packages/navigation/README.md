# Navigation Feature (@workspace/navigation)

Pusat pendaftaran (registry) navigasi global untuk mengelola struktur menu dan rute aplikasi secara modular.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengembang (untuk konfigurasi) dan Seluruh Pengguna (untuk navigasi). |
| **What** (Apa) | Registry navigasi terpusat yang mendefinisikan kategori menu, rute (URL), ikon, dan logika visibilitas. |
| **Where** (Dimana) | Digunakan oleh komponen sidebar di dashboard untuk merender daftar menu secara dinamis. |
| **When** (Kapan) | Digunakan setiap kali aplikasi memuat antarmuka dashboard untuk menyesuaikan menu dengan izin akses pengguna. |
| **Why** (Mengapa) | Memudahkan pengelolaan menu yang kompleks dalam monorepo; satu tempat untuk mengatur semua rute navigasi. |
| **How** (Bagaimana) | Mengelompokkan item navigasi ke dalam `GLOBAL_NAV_REGISTRY` dan memfilternya menggunakan fungsi `getNavigation`. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/navigation": "workspace:*"
  }
}
```

### 2. Konfigurasi Navigasi
Dapatkan struktur navigasi berdasarkan konteks aplikasi:

```tsx
import { getNavigation } from "@workspace/navigation"

export default function DashboardLayout({ children }) {
  // Misal: aplikasi aktif adalah 'pos' dan user adalah admin
  const sections = getNavigation("pos", true)
  
  return (
    <Sidebar sections={sections}>
      {children}
    </Sidebar>
  )
}
```

### 3. Mendaftarkan Menu Baru
Tambahkan entri baru di `src/index.ts` untuk modul baru:

```tsx
export const GLOBAL_NAV_REGISTRY = {
  // ... existing
  my_new_app: [
    {
      title: "My Feature",
      items: [
        { title: "Home", href: "/my-app", icon: "Home" }
      ]
    }
  ]
}
```

---

## Integrasi Monorepo

Paket `@workspace/navigation` merupakan tulang punggung sistem navigasi:

- **`@workspace/dashboard`**: Paket utama yang mengonsumsi data navigasi untuk dirender di `AppSidebar`.
- **`apps/web`**: Menentukan logika bisnis untuk menentukan `activeAppId` mana yang harus ditampilkan kepada pengguna.
- **`lucide-react`**: Menggunakan referensi string ikon yang dipetakan ke komponen ikon Lucide di level UI.

---

## Contoh Kasus Penggunaan

1.  **Contextual Sidebar**:
    Saat admin berpindah dari dashboard utama ke modul **POS**, sistem secara otomatis mengganti atau menambah menu yang relevan dengan tugas kasir.

2.  **RBAC (Role Based Access Control)**:
    Menyembunyikan menu sensitif seperti "Security" atau "Billing" bagi pengguna dengan role "Staff" secara instan melalui filter `isAdmin`.

3.  **Modular Feature Expansion**:
    Saat fitur "Marketing" ditambahkan sebagai paket baru, pengembang cukup menambahkan definisinya di registry ini agar fitur tersebut muncul di dashboard pengguna tanpa mengubah kode layout utama.

---
*Dibuat untuk ekosistem Web SLO.*
