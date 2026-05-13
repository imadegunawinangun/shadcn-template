# @workspace/api-keys

Modul manajemen autentikasi untuk akses sistem-ke-sistem secara aman.

## 📝 5W1H (Analisis Strategis)
*   **What**: Kunci digital (Token) yang memberikan izin akses ke API platform tanpa perlu login manual (Username/Password).
*   **Why**: Memungkinkan pengembang pihak ketiga atau script otomasi internal untuk berinteraksi dengan data platform secara aman dan terukur.
*   **Who**: **Developer** dan **System Integrator**.
*   **Where**: Dikelola melalui tab **API Keys** di Dashboard Automation.
*   **When**: Digunakan saat ingin melakukan integrasi via kode (Programmatic Access).
*   **How**: Menggunakan UUID unik dan hashing (future update) untuk memastikan kredensial tidak dapat dibaca secara mentah di database.

## 🚀 Cara Penggunaan
1.  Akses antarmuka **API Key Manager** di aplikasi Anda.
2.  Klik **"+ Create New Key"** dan beri nama identitas untuk kunci tersebut.
3.  **Salin Kunci Segera**: Sistem akan menampilkan kunci asli Anda. Segera simpan di tempat aman karena kunci ini tidak akan ditampilkan lagi demi keamanan.
4.  Gunakan kunci tersebut pada header HTTP `Authorization: Bearer [KUNCI_ANDA]` saat melakukan pemanggilan API ke platform ini.

## 📦 Implementasi pada Aplikasi Baru
1.  **Instalasi Dependensi**:
    Tambahkan ke `package.json` aplikasi Anda:
    ```json
    "dependencies": {
      "@workspace/api-keys": "workspace:*"
    }
    ```
2.  **Impor Komponen**:
    ```tsx
    import { ApiKeyManager } from "@workspace/api-keys"
    import { getApiKeys } from "@workspace/api-keys/actions"

    export default async function Page() {
      const keys = await getApiKeys(workspaceId);
      return <ApiKeyManager initialKeys={keys} workspaceId={workspaceId} />
    }
    ```

## 🛠️ Informasi Teknis (Developer)
*   **Storage**: Disimpan di tabel `apiKey`.
*   **Safety**: Kunci yang ditampilkan ke user adalah kunci asli, namun sistem menyarankan penyimpanan versi hash di database untuk standar produksi yang lebih tinggi.
*   **Revocation**: Menghapus API Key di dashboard akan langsung membatalkan semua akses yang menggunakan kunci tersebut secara real-time.

## 👥 Panduan Stakeholder
*   **User**: Perlakukan API Key seperti password Anda. Jangan pernah membagikannya di chat publik atau repository kode terbuka (Git).
*   **Owner**: Memberikan kontrol akses yang granular dan mempermudah skalabilitas integrasi dengan mitra bisnis.
*   **Developer**: Implementasikan limitasi (Rate Limiting) pada API yang menggunakan kunci ini untuk mencegah penyalahgunaan.

---

## 🏗️ Status Pengembangan: PAUSED
*   **Kondisi Terakhir**: UI Manajemen stabil, integrasi database siap, Demo Mode aktif.
*   **Rencana Mendatang**: Scoping (hak akses terbatas per key) dan fitur kadaluarsa (Expiration Date).
