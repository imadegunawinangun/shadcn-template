import { EntitySelector } from "@workspace/entities"
import { Store } from "lucide-react"

export default function SelectStorePage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center">
      <EntitySelector 
        type="store"
        title="Point of Sale"
        description="Pilih Unit Bisnis / Toko untuk mulai berjualan."
        nextPath="/pos/terminal"
        settingsPath="/dashboard/settings/entities"
        icon={<Store className="h-8 w-8 text-primary-foreground" />}
      />
    </div>
  )
}
