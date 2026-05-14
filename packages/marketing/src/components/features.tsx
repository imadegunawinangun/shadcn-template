import { motion } from "framer-motion"
import { Check, Shield, Zap, Globe, Smartphone, Heart } from "lucide-react"

const features = [
  {
    title: "Multi-Tenant Architecture",
    description: "Satu codebase untuk ribuan organisasi dengan isolasi data tingkat tinggi.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Real-time POS",
    description: "Transaksi kasir yang super cepat dan tersinkronisasi secara otomatis.",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: "Global Search",
    description: "Cari data apa pun di seluruh organisasi dengan satu kali shortcut (⌘K).",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "Mobile Ready",
    description: "Dashboard responsif yang terlihat cantik di desktop maupun smartphone.",
    icon: <Smartphone className="h-6 w-6" />,
  },
  {
    title: "Dynamic Customizer",
    description: "Ubah warna, font, dan branding aplikasi secara real-time dari dashboard.",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    title: "Context-Aware UI",
    description: "Interface yang beradaptasi secara cerdas berdasarkan aplikasi yang dibuka.",
    icon: <Check className="h-6 w-6" />,
  },
]

export function Features() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Fitur Utama <span className="text-primary italic">Antigravity</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Segala yang Anda butuhkan untuk membangun dan menskalakan bisnis SaaS Anda dengan kecepatan cahaya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-card rounded-3xl border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group"
            >
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
