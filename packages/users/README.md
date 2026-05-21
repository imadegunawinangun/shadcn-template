# Users & Team Feature (@workspace/users)

Modul manajemen keanggotaan tim dan konfigurasi identitas workspace untuk kolaborasi organisasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pemilik Workspace (Owner), Admin, dan Anggota Tim. |
| **What** (Apa) | Paket modular untuk mengelola profil pengguna, daftar anggota tim (RBAC), dan pengaturan identitas organisasi (Branding). |
| **Where** (Dimana) | Digunakan pada halaman **Team** (`/dashboard/team`) dan **Workspace Settings** di dashboard. |
| **When** (Kapan) | Digunakan saat mengundang anggota baru, mengedit peran (role) staf, atau mengubah informasi dasar organisasi (logo/nama). |
| **Why** (Mengapa) | Memungkinkan kolaborasi multi-tenant yang aman dan pengelolaan struktur organisasi yang fleksibel. |
| **How** (Bagaimana) | Menyediakan komponen `MemberList` dan `WorkspaceSettings` yang terintegrasi dengan database lokal dan layanan identitas (Clerk). |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/users": "workspace:*"
  }
}
```

### 2. Implementasi Manajemen Tim
Gunakan komponen `MemberList` di halaman tim:

```tsx
import { MemberList } from "@workspace/users"

export default function TeamPage({ params }) {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Anggota Tim</h1>
      <MemberList workspaceId={params.workspaceId} />
    </div>
  )
}
```

### 3. Implementasi Pengaturan Workspace
Gunakan `WorkspaceSettings` untuk mengelola profil organisasi:

```tsx
import { WorkspaceSettings } from "@workspace/users"

export default function OrgSettingsPage({ workspace }) {
  return (
    <div className="max-w-4xl py-10">
      <WorkspaceSettings workspace={workspace} />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/users` berinteraksi erat dengan:

- **`@workspace/database`**: Mengelola persistensi data pada tabel `user`, `membership`, dan `workspace`.
- **`@workspace/ui`**: Memberikan konsistensi visual melalui komponen `Table`, `Avatar`, `Badge`, dan `Input`.
- **`apps/web`**: Aplikasi utama yang menangani sinkronisasi data dengan Clerk API dan manajemen rute tim.

---

## Contoh Kasus Penggunaan

1.  **Inviting Collaborators**:
    Pemilik bisnis mengundang manajer gudang ke dalam workspace dengan peran "Admin" agar dapat membantu mengelola stok dan laporan.

2.  **Organization Rebranding**:
    Admin memperbarui logo dan nama perusahaan agar muncul dengan benar pada header aplikasi dan cetakan invoice pelanggan.

3.  **Role Access Adjustment**:
    Mengubah hak akses staf dari "Member" menjadi "Owner" ketika terjadi pergantian kepemilikan atau tanggung jawab utama dalam organisasi.

---
*Dibuat untuk ekosistem Web SLO.*
