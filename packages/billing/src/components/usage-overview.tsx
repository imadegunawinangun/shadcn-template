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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Usage Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageItem label="Projects" value={2} max={3} />
        <UsageItem label="Storage" value={0.8} max={1} unit="GB" />
        <UsageItem label="Monthly Bandwidth" value={45} max={100} unit="GB" />
        
        <p className="text-[10px] text-muted-foreground pt-2 border-t">
          Your free plan includes limited resources. Upgrade to Pro for unlimited access.
        </p>
      </CardContent>
    </Card>
  )
}
