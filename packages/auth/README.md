# Auth Feature (@workspace/auth)

Modul otentikasi dan manajemen sesi pengguna yang aman dan terpusat.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Seluruh Pengguna (Admin, Member, dan Pelanggan). |
| **What** (Apa) | Paket modular yang menyediakan komponen UI dan logika otentikasi (Login, Register, Password Reset). |
| **Where** (Dimana) | Digunakan pada halaman otentikasi (seperti `/sign-in`) dan sebagai gerbang keamanan untuk rute dashboard. |
| **When** (Kapan) | Digunakan saat pengguna masuk ke sistem, mendaftar akun baru, atau memerlukan validasi sesi. |
| **Why** (Mengapa) | Untuk melindungi data sensitif dan memberikan pengalaman autentikasi yang aman serta terstandarisasi. |
| **How** (Bagaimana) | Mengintegrasikan **Clerk SDK** dengan komponen UI kustom yang responsif dan mendukung berbagai provider sosial (Google/GitHub). |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/auth": "workspace:*"
  }
}
```

### 2. Gunakan Login Form
Tampilkan komponen login di halaman `page.tsx` atau rute otentikasi:

```tsx
import { LoginForm } from "@workspace/auth"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm 
        onSuccess={() => window.location.href = "/dashboard"}
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket ini berinteraksi dengan komponen lain dalam ekosistem:

- **`@workspace/ui`**: Menggunakan komponen `Button`, `Input`, `Form`, dan `Label` untuk membangun antarmuka.
- **`@workspace/database`**: (Optional) Berkoordinasi untuk sinkronisasi data user lokal setelah proses otentikasi pihak ketiga (Clerk) selesai.
- **`apps/web`**: Menentukan rute callback dan konfigurasi middleware untuk memproteksi halaman internal.

---

## Contoh Kasus Penggunaan

1.  **Secure Dashboard Access**:
    Mencegah akses ke halaman keuangan jika pengguna belum login atau sesi sudah kadaluarsa.

2.  **Social Login**:
    Memudahkan pengguna baru untuk mendaftar dengan satu klik menggunakan akun Google tanpa perlu mengisi form panjang.

3.  **Organization Switching**:
    Setelah login, komponen ini membantu mengarahkan pengguna ke pilihan workspace yang tersedia untuk akun mereka.

---
*Dibuat untuk ekosistem Web SLO.*
