# Permissions Feature (@workspace/permissions)

Sistem kontrol akses berbasis peran (RBAC) dua tingkat untuk mengelola izin pengguna secara granular dalam ekosistem multi-tenant.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengembang Backend, Administrator Sistem, dan Manajer Tim. |
| **What** (Apa) | Paket modular untuk validasi hak akses pengguna (Level 1: Akses Aplikasi; Level 2: Izin Tindakan Spesifik). |
| **Where** (Dimana) | Digunakan pada Server Components, API Routes, Server Actions, dan UI Components (Guards). |
| **When** (Kapan) | Dipanggil setiap kali pengguna mencoba mengakses modul aplikasi atau melakukan operasi CRUD pada data. |
| **Why** (Mengapa) | Menjamin isolasi data antar organisasi dan memberikan kontrol penuh atas apa yang boleh dilakukan setiap anggota tim. |
| **How** (Bagaimana) | Memvalidasi identitas pengguna terhadap tabel `membership` dan `workspaceAppRole` di database. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/permissions": "workspace:*"
  }
}
```

### 2. Validasi Akses di Server Component
Proteksi halaman dashboard agar hanya bisa diakses oleh user dengan role tertentu:

```tsx
import { getAppPermissions } from "@workspace/permissions"

export default async function InventoryPage({ params }) {
  const { hasAccess, role } = await getAppPermissions(
    params.workspaceId, 
    currentUser.id, 
    "inventory"
  )

  if (!hasAccess) {
    return <div>Anda tidak memiliki akses ke modul Inventaris.</div>
  }

  return <div>Selamat datang, {role}!</div>
}
```

### 3. Validasi Tindakan di Server Action
Pastikan user memiliki izin sebelum menghapus data:

```tsx
import { canPerformAction } from "@workspace/permissions"

export async function deleteProductAction(workspaceId, userId, productId) {
  const allowed = await canPerformAction(workspaceId, userId, "pos", "delete_product")
  
  if (!allowed) throw new Error("Unauthorized")
  
  // Lanjutkan proses hapus...
}
```

---

## Integrasi Monorepo

Paket `@workspace/permissions` bertindak sebagai lapisan keamanan inti:

- **`@workspace/database`**: Menggunakan schema `membership` dan `workspaceAppRole` sebagai sumber kebenaran (Source of Truth) hak akses.
- **`apps/web`**: Mengintegrasikan pengecekan izin pada level middleware dan rute aplikasi untuk proteksi menyeluruh.
- **`@workspace/ui`**: Menyediakan komponen pembungkus (Guards) untuk menyembunyikan elemen UI jika user tidak memiliki izin.

---

## Contoh Kasus Penggunaan

1.  **Multi-Tenant Isolation**:
    Memastikan staf dari Organisasi A tidak dapat melihat atau memodifikasi data milik Organisasi B.

2.  **Granular Staff Roles**:
    Seorang "Kasir" hanya diizinkan untuk membuat transaksi baru, sementara "Manajer Toko" diizinkan untuk melihat laporan laba rugi dan menghapus transaksi yang salah.

3.  **Global Admin/Owner Access**:
    Pemilik workspace (`role: owner`) secara otomatis mendapatkan akses ke semua fitur tanpa perlu konfigurasi manual tambahan.

---
*Dibuat untuk ekosistem Web SLO.*
