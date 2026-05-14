"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card } from "@workspace/ui/components/card"
import { Check, ArrowRight, Building2, Users, Rocket, Sparkles } from "lucide-react"

type Step = {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const steps: Step[] = [
  { id: 1, title: "Welcome", description: "Selamat datang di platform masa depan.", icon: <Rocket className="h-6 w-6" /> },
  { id: 2, title: "Business", description: "Beri tahu kami tentang bisnis Anda.", icon: <Building2 className="h-6 w-6" /> },
  { id: 3, title: "Team", description: "Undang tim Anda untuk berkolaborasi.", icon: <Users className="h-6 w-6" /> },
]

export function OnboardingFlow({ onComplete }: { onComplete: (data: any) => void }) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    businessName: "",
    businessType: "",
    teamSize: "",
  })

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Step Indicator */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10" />
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              currentStep >= step.id ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background border-muted text-muted-foreground"
            }`}
          >
            {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 border-none shadow-2xl bg-card/50 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-4">
                {steps[currentStep - 1].icon}
              </div>
              <h2 className="text-2xl font-black tracking-tight">{steps[currentStep - 1].title}</h2>
              <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>

            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="text-center space-y-4 py-4">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" />
                    New Account
                  </div>
                  <p className="text-sm leading-relaxed">
                    Kami akan membantu Anda menyiapkan workspace dalam waktu kurang dari 2 menit. 
                    Siap untuk membangun sesuatu yang hebat?
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nama Bisnis</label>
                    <Input 
                      placeholder="Contoh: Toko Kopi Maju" 
                      className="h-12 rounded-xl"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tipe Bisnis</label>
                    <select 
                      className="w-full h-12 rounded-xl bg-background border border-input px-3 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    >
                      <option value="">Pilih Tipe...</option>
                      <option value="retail">Retail / Toko</option>
                      <option value="service">Jasa / Service</option>
                      <option value="f&b">Food & Beverage</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-2xl bg-muted/30 border-dashed text-center">
                    <p className="text-sm text-muted-foreground italic">Anda dapat mengundang anggota tim nanti melalui dashboard.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimasi Jumlah Tim</label>
                    <Input 
                      type="number" 
                      placeholder="1-10" 
                      className="h-12 rounded-xl"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <Button onClick={nextStep} className="w-full h-12 rounded-xl font-bold group">
                {currentStep === steps.length ? "Finish Setup" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
