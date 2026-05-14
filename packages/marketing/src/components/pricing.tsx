import { Button } from "@workspace/ui/components/button"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: "0",
    description: "Ideal untuk bisnis baru yang ingin mulai digitalisasi.",
    features: ["1 Unit Bisnis / Toko", "3 Anggota Tim", "Laporan Dasar", "Global Search (⌘K)"],
  },
  {
    name: "Pro",
    price: "299k",
    description: "Paling populer untuk bisnis yang sedang berkembang.",
    features: ["Hingga 5 Unit Bisnis", "Tim Tidak Terbatas", "Manajemen Stok Lanjutan", "Kustomisasi Tema"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "999k",
    description: "Untuk perusahaan besar dengan kebutuhan khusus.",
    features: ["Unit Bisnis Tidak Terbatas", "Admin Console Lanjutan", "Security Audit Logs", "Support Prioritas"],
  },
]

export function Pricing() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Pilihan <span className="text-primary italic">Investasi</span></h2>
          <p className="text-muted-foreground text-lg">Skalakan bisnis Anda sesuai kebutuhan tanpa biaya tersembunyi.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div 
              key={index}
              className={`p-10 rounded-[2.5rem] border transition-all flex flex-col ${
                tier.featured ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-105 z-10 border-primary" : "bg-card border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-8">
                <h3 className={`text-xl font-bold uppercase tracking-widest ${tier.featured ? "text-primary-foreground/80" : "text-primary"}`}>{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">IDR {tier.price}</span>
                  <span className={`text-sm ${tier.featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}>/bln</span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${tier.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 font-medium">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${tier.featured ? "bg-white/20" : "bg-primary/10"}`}>
                      <Check className={`h-3 w-3 ${tier.featured ? "text-white" : "text-primary"}`} />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.featured ? "secondary" : "default"} 
                className={`w-full h-14 rounded-2xl font-bold text-lg ${tier.featured ? "bg-white text-primary hover:bg-white/90" : ""}`}
              >
                Get Started Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
