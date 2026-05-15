import { PricingPlan } from "./index";

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "Rp 0",
    description: "Ideal untuk peternak mandiri yang ingin mulai go-digital.",
    features: [
      "stoknstok (Catat Stok & Populasi)",
      "Batas 50 ekor hewan ternak",
      "Laporan harian sederhana",
      "Biaya Transaksi POS: 2.0% + Rp 2.500",
      "Support via Komunitas"
    ],
    buttonText: "Pakai Gratis",
    current: true
  },
  {
    name: "Grow",
    price: "Rp 149.000",
    description: "Optimasi pakan dan penjualan profesional untuk hasil maksimal.",
    features: [
      "Semua fitur Starter",
      "feednstok (Analisis FCR & Efisiensi)",
      "posnstok (Kasir & Reseller)",
      "Batas hewan ternak: UNLIMITED",
      "Multi-user (Admin & Anak Kandang)",
      "Biaya Transaksi POS: 0.7% (MDR Saja)",
      "Laporan Laba Rugi Otomatis",
      "Support Prioritas 24/7"
    ],
    buttonText: "Upgrade ke Grow",
    popular: true
  },
  {
    name: "Industrial",
    price: "Custom",
    description: "Solusi ekosistem lengkap untuk manajemen skala industri.",
    features: [
      "Semua fitur Grow",
      "Manajemen Multi-Lokasi (Banyak Kandang)",
      "Akses Eksklusif Pengajuan Modal",
      "Marketplace Pakan Harga Pabrik",
      "Biaya Transaksi POS: Nego (Volume-based)",
      "Integrasi API & IoT (Timbangan Digital)",
      "Dedicated Account Manager"
    ],
    buttonText: "Hubungi Sales"
  }
];

export const getPriceByPlan = (planName: string, billingCycle: "monthly" | "yearly"): number => {
  if (planName === "Grow") {
    // Diskon 20% jika bayar tahunan
    return billingCycle === "yearly" ? 1430400 : 149000;
  }
  return 0;
};
