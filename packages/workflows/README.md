# @workspace/workflows

Modul inti untuk orkestrasi otomasi visual menggunakan sistem berbasis node (Visual Canvas).

## 📝 5W1H (Analisis Strategis)
*   **What**: Platform otomasi visual yang memungkinkan pembuatan alur kerja (workflow) tanpa kode (No-Code).
*   **Why**: Mengurangi ketergantungan pada tim engineering untuk logika bisnis yang sering berubah dan memberikan fleksibilitas operasional.
*   **Who**: Digunakan oleh **Admin/Operasional** untuk membuat flow, dikembangkan oleh **Developer** untuk menambah integrasi (Pieces).
*   **Where**: Terintegrasi di dalam Dashboard Admin pada bagian Automation.
*   **When**: Digunakan saat sistem butuh melakukan serangkaian aksi otomatis berdasarkan pemicu (trigger) tertentu.
*   **How**: Menggunakan React Flow untuk interface visual dan engine server-side untuk eksekusi logika.

## 🚀 Cara Penggunaan
1.  Akses antarmuka **Workflow Manager** pada aplikasi Anda.
2.  Klik **"Create Flow"** untuk menginisialisasi alur kerja baru dan membuka **Visual Canvas**.
3.  Gunakan **Visual Canvas** untuk menyusun logika:
    *   Klik ikon **Plus (+)** untuk menambah Node baru (Trigger atau Action).
    *   Tarik garis antar node untuk menentukan urutan eksekusi.
    *   Konfigurasikan detail setiap node pada panel yang tersedia.
4.  Klik **"Save"** untuk mematangkan alur kerja ke sistem.
5.  Gunakan switch **"Active/Pause"** untuk mengontrol eksekusi alur kerja secara real-time.

## 📦 Implementasi pada Aplikasi Baru
Jika Anda membuat aplikasi baru (misal: `apps/mobile-admin`) dan ingin menggunakan fitur ini:

1.  **Instalasi Dependensi**:
    Tambahkan ke `package.json` aplikasi Anda:
    ```json
    "dependencies": {
      "@workspace/workflows": "workspace:*"
    }
    ```
2.  **Impor Komponen**:
    Di halaman (page) Anda, panggil manajer workflow:
    ```tsx
    import { WorkflowManager } from "@workspace/workflows"
    import { getWorkflows } from "@workspace/workflows/actions"

    export default async function Page() {
      const workflows = await getWorkflows(workspaceId);
      return <WorkflowManager workflows={workflows} workspaceId={workspaceId} />
    }
    ```
3.  **Environment Variables**: Pastikan aplikasi baru tersebut memiliki akses ke `DATABASE_URL`.

## 🛠️ Informasi Teknis (Developer)
*   **Teknologi**: React Flow, Drizzle ORM, Next.js Server Actions.
*   **Struktur Data**: Nodes dan Edges disimpan dalam kolom JSONB `flow` pada tabel `workflow`.
*   **Engine**: Logika eksekusi berada di `src/lib/engine.ts`, yang menjalankan fungsi `run()` dari setiap Piece secara sekuensial.

### Cara Menambah Fitur Baru (Pieces)
1.  Buat file baru di `src/pieces/[nama-integrasi].ts`.
2.  Definisikan skema input (props) dan fungsi `run()`.
3.  Daftarkan piece tersebut di `src/pieces/registry.ts`.
4.  Piece akan muncul secara otomatis di menu "Add Node" pada canvas.

## 👥 Panduan Stakeholder
*   **User**: Gunakan canvas untuk menyusun logika bisnis Anda tanpa menulis kode. Pastikan setiap node terhubung dengan benar.
*   **Owner**: Fitur ini meningkatkan efisiensi operasional hingga 80% dengan mengotomatiskan tugas repetitif.
*   **Developer**: Pastikan setiap Piece baru memiliki *error handling* yang kuat agar tidak menghentikan seluruh antrean workflow.

---

## 🏗️ Status Pengembangan: PAUSED
*   **Kondisi Terakhir**: Visual editor stabil, integrasi database (Drizzle) siap, Demo Mode aktif.
*   **Rencana Mendatang**: Implementasi If/Else Logic dan Data Mapping.
