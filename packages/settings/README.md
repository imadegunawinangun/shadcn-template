# Settings Feature (@workspace/settings)

Modul manajemen konfigurasi pengguna dan workspace untuk personalisasi serta pengaturan infrastruktur.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Seluruh Pengguna Terdaftar (untuk profil) dan Admin (untuk konfigurasi sistem). |
| **What** (Apa) | Paket modular yang menyediakan form pengaturan untuk Profil, Tampilan (Appearance), dan Media (Infrastruktur). |
| **Where** (Dimana) | Digunakan pada halaman pengaturan aplikasi (`/dashboard/settings`). |
| **When** (Kapan) | Digunakan saat pengguna memperbarui informasi pribadi, mengubah tema aplikasi, atau mengatur integrasi layanan pihak ketiga. |
| **Why** (Mengapa) | Memberikan fleksibilitas bagi pengguna untuk menyesuaikan antarmuka dan memastikan data akun tetap mutakhir. |
| **How** (Bagaimana) | Menyediakan komponen form siap pakai yang terintegrasi dengan state management untuk pembaruan data secara real-time. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/settings": "workspace:*"
  }
}
```

### 2. Gunakan Komponen Pengaturan
Implementasikan tab pengaturan di dashboard Anda:

```tsx
import { ProfileSettings, AppearanceSettings } from "@workspace/settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export default function SettingsPage() {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileSettings user={currentUser} />
      </TabsContent>
      
      <TabsContent value="appearance">
        <AppearanceSettings />
      </TabsContent>
    </Tabs>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/settings` bekerja sama dengan:

- **`@workspace/ui`**: Menyediakan elemen form seperti `Input`, `Select`, `Switch`, `Button`, dan `Tabs`.
- **`@workspace/assets`**: Digunakan dalam `MediaSettings` untuk mengelola konfigurasi pustaka media (ImageKit/Cloudinary).
- **`apps/web`**: Aplikasi utama yang mengelola otentikasi user dan persistensi data pengaturan ke database.

---

## Contoh Kasus Penggunaan

1.  **Brand Personalization**:
    Admin mengunggah logo organisasi dan menentukan tema warna utama aplikasi untuk mencerminkan identitas brand perusahaan.

2.  **User Contact Update**:
    Pengguna memperbarui informasi kontak darurat dan alamat pengiriman di profil mereka untuk keperluan transaksi POS.

3.  **System Integration**:
    Pengembang memasukkan kunci API ImageKit di panel pengaturan media agar fitur upload gambar di seluruh aplikasi dapat berfungsi.

---
*Dibuat untuk ekosistem Web SLO.*
