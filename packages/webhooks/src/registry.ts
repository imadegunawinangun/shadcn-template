export interface WebhookEvent {
  id: string;
  label: string;
  description: string;
  category: string;
}

// Registry internal untuk menyimpan event sistem
const systemEvents: WebhookEvent[] = [
  { id: "webhook.test", label: "Test Webhook", description: "Event untuk mengetes koneksi webhook.", category: "System" }
];

// Koleksi dinamis yang bisa diisi dari berbagai paket
let registeredEvents: WebhookEvent[] = [...systemEvents];

/**
 * Fungsi untuk menyuntikkan event baru dari paket lain
 */
export function registerWebhookEvents(events: WebhookEvent[]) {
  // Filter untuk menghindari duplikasi ID
  const newEvents = events.filter(e => !registeredEvents.find(existing => existing.id === e.id));
  registeredEvents = [...registeredEvents, ...newEvents];
}

/**
 * Mengambil semua event yang terdaftar untuk ditampilkan di UI
 */
export function getAllRegisteredEvents(): WebhookEvent[] {
  return registeredEvents;
}
