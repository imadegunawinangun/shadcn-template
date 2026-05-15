import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"

interface UsageItemProps {
  label: string
  value: number
  max: number
  unit?: string
}

function UsageItem({ label, value, max, unit = "" }: UsageItemProps) {
  const percentage = Math.min(100, (value / max) * 100)
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}{unit} / {max}{unit}</span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  )
}

export function UsageOverview() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Kapasitas Paket Starter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageItem label="Jumlah Hewan Ternak" value={45} max={50} />
        <UsageItem label="Data Pakan (feednstok)" value={12} max={20} unit=" Entri" />
        <UsageItem label="Transaksi (posnstok)" value={8} max={10} unit=" Transaksi" />
        
        <div className="pt-2 border-t">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Anda hampir mencapai batas paket **Starter**. Upgrade ke **Grow** untuk kuota tidak terbatas dan analisis FCR.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
