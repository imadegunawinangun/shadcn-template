# Onboarding Feature (@workspace/onboarding)

Modul pemanduan pengguna baru (multi-step wizard) untuk memfasilitasi konfigurasi awal akun dan organisasi.

## 5W1H

| Aspek | Deskripsi |
| :--- | :--- |
| **Who** (Siapa) | Pengguna Baru (New Sign-ups) yang belum menyelesaikan profil atau pengaturan organisasi. |
| **What** (Apa) | Paket modular yang menyediakan alur kerja langkah-demi-langkah (Onboarding Flow) untuk pengumpulan data awal. |
| **Where** (Dimana) | Diterapkan pada rute `/onboarding` sebagai gerbang pertama setelah proses registrasi. |
| **When** (Kapan) | Digunakan segera setelah akun dibuat atau saat pengguna membuat workspace baru. |
| **Why** (Mengapa) | Untuk meningkatkan retensi pengguna dengan memberikan panduan yang jelas dan meminimalkan kerumitan setup awal. |
| **How** (Bagaimana) | Menggunakan komponen `OnboardingFlow` yang mengelola transisi antar langkah dan validasi data secara terpadu. |

---

## Cara Menggunakan di Aplikasi Baru

### 1. Tambahkan Dependensi
Daftarkan paket di `package.json` aplikasi Anda:

```json
{
  "dependencies": {
    "@workspace/onboarding": "workspace:*"
  }
}
```

### 2. Implementasi Onboarding Flow
Gunakan komponen `OnboardingFlow` di halaman onboarding:

```tsx
import { OnboardingFlow } from "@workspace/onboarding"

export default function OnboardingPage() {
  const steps = [
    { id: "profile", title: "Profil Pribadi", description: "Lengkapi data diri Anda" },
    { id: "org", title: "Buat Organisasi", description: "Siapkan ruang kerja tim Anda" },
    { id: "finish", title: "Selesai", description: "Anda siap memulai" }
  ]

  return (
    <div className="container max-w-xl py-20">
      <OnboardingFlow 
        steps={steps}
        onComplete={(data) => console.log("Onboarding data:", data)}
      />
    </div>
  )
}
```

---

## Integrasi Monorepo

Paket `@workspace/onboarding` dirancang untuk berinteraksi dengan:

- **`@workspace/ui`**: Menggunakan komponen `Button`, `Input`, `Progress`, `Card`, dan `Label` untuk membangun antarmuka wizard.
- **`apps/web`**: Aplikasi utama yang mengatur rute `/onboarding` dan logika redirect ke dashboard setelah sukses.
- **`framer-motion`**: Memberikan animasi transisi yang halus antar langkah untuk pengalaman pengguna yang lebih premium.

---

## Contoh Kasus Penggunaan

1.  **Initial Setup Wizard**:
    Memandu pemilik bisnis memasukkan nama toko, alamat, dan nomor telepon segera setelah mendaftar agar sistem dapat menghasilkan invoice yang akurat.

2.  **Modular Information Gathering**:
    Mengumpulkan data spesifik (misal: jumlah hewan ternak awal) untuk menyesuaikan dashboard sesuai dengan kebutuhan pengguna.

3.  **Terms & Policy Acceptance**:
    Menyisipkan langkah persetujuan syarat dan ketentuan penggunaan aplikasi sebelum pengguna mulai mengakses fitur-fitur utama.

---
*Dibuat untuk ekosistem Web SLO.*
