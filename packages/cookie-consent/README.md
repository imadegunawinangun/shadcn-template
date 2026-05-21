# Cookie Consent Feature (@workspace/cookie-consent)

Modul manajemen privasi dan persetujuan penggunaan cookie sesuai standar regulasi global (GDPR/CCPA).

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Seluruh Pengunjung Website dan Pengguna Aplikasi. |
| **What** (Apa) | Paket modular untuk menampilkan banner persetujuan cookie dan mengelola preferensi privasi pengguna. |
| **Where** (Dimana) | Muncul sebagai banner global di bagian bawah halaman aplikasi. |
| **When** (Kapan) | Ditampilkan pada kunjungan pertama atau saat preferensi cookie perlu diperbarui. |
| **Why** (Mengapa) | Memastikan kepatuhan hukum privasi data dan memberikan transparansi penggunaan pelacak kepada pengguna. |
| **How** (Bagaimana) | Menggunakan komponen UI kustom dan hook React untuk menyimpan/mengambil status persetujuan dari cookie browser. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/cookie-consent": "workspace:*"
  }
}
```

### 2. Implementasi di Root Layout
Tambahkan komponen `CookieConsent` agar muncul di seluruh halaman:

```tsx
import { CookieConsent } from "@workspace/cookie-consent"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent 
          privacyPolicyUrl="/privacy-policy"
          onAccept={(settings) => console.log("User accepted:", settings)}
        />
      </body>
    </html>
  )
}
```

### 3. Menggunakan Status Persetujuan
Gunakan hook `useCookieConsent` untuk mengeksekusi skrip secara kondisional:

```tsx
import { useCookieConsent } from "@workspace/cookie-consent"

export function AnalyticsTracker() {
  const { isAccepted } = useCookieConsent()

  useEffect(() => {
    if (isAccepted("analytics")) {
      // Inisialisasi Google Analytics
    }
  }, [isAccepted])

  return null
}
```

---

## Integrasi Monorepo

Paket ini berinteraksi dengan:

- **`@workspace/ui`**: Menggunakan komponen `Button`, `Switch`, dan `Dialog` untuk antarmuka banner dan pengaturan detail.
- **`apps/web`**: Aplikasi utama yang menghosting kebijakan privasi dan merender banner secara global.
- **`js-cookie`**: Digunakan untuk persistensi data persetujuan di browser pengguna.

---

## Contoh Kasus Penggunaan

1.  **Regulator Compliance**:
    Memastikan website memenuhi syarat hukum di Uni Eropa (GDPR) dengan tidak mengaktifkan cookie pelacakan sebelum ada persetujuan eksplisit.

2.  **Selective Marketing**:
    Hanya mengaktifkan skrip retargeting iklan (seperti Facebook Pixel) jika pengguna memberikan izin pada kategori "Marketing".

3.  **User Trust**:
    Memberikan rasa aman kepada pengguna dengan transparan menjelaskan kategori cookie apa saja yang digunakan (Essential, Analytics, Marketing).

---
*Dibuat untuk ekosistem Web SLO.*
