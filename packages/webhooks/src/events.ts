import { registerWebhookEvents } from "./registry";

/**
 * Simulasi "Penyuntikan" event dari paket lain.
 * Di dunia nyata, paket seperti @workspace/billing akan mengekspor event mereka,
 * dan kita mengimpornya di sini.
 */

// Contoh event dari paket Users
const userEvents = [
  { id: "user.created", label: "User Created", description: "Dipicu saat ada pengguna baru mendaftar.", category: "User" },
  { id: "user.deleted", label: "User Deleted", description: "Dipicu saat akun pengguna dihapus.", category: "User" },
];

// Contoh event dari paket Billing
const billingEvents = [
  { id: "payment.succeeded", label: "Payment Succeeded", description: "Terjadi saat pembayaran berhasil.", category: "Payment" },
  { id: "subscription.cancelled", label: "Subscription Cancelled", description: "Dipicu saat langganan dibatalkan.", category: "Payment" },
];

// Daftarkan semua event ke registry pusat
registerWebhookEvents([...userEvents, ...billingEvents]);

// Export ulang registry functions agar bisa digunakan paket lain untuk menyuntikkan event secara manual
export * from "./registry";
export * from "./actions";
