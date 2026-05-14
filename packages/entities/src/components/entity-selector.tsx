import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { LayoutGrid, ArrowRight, MapPin, Building2, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { getEntities } from "@workspace/database"

interface EntitySelectorProps {
  type: string
  title: string
  description: string
  nextPath: string // e.g. "/pos/terminal"
  settingsPath: string // e.g. "/dashboard/settings/entities"
  icon?: React.ReactNode
}

export async function EntitySelector({ 
  type, 
  title, 
  description, 
  nextPath, 
  settingsPath,
  icon = <LayoutGrid className="h-8 w-8 text-primary-foreground" />
}: EntitySelectorProps) {
  const { orgId } = await auth()
  const user = await currentUser()

  if (!user) redirect("/sign-in")
  if (!orgId) redirect("/select-workspace")

  const entities = await getEntities(orgId, type)

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 rotate-3">
            {icon}
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="h-3 w-3" />
            Selection Required
          </div>
          <h1 className="text-3xl font-black tracking-tighter">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="grid gap-4">
          {entities.length > 0 ? (
            entities.map((e: any) => (
              <Link key={e.id} href={`${nextPath}?entityId=${e.id}`}>
                <Card className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden relative shadow-sm hover:shadow-md">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Building2 className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">{e.name}</CardTitle>
                        <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold tracking-widest">{e.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {e.location || "No location set"}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-muted/20">
              <p className="text-muted-foreground mb-4">Belum ada {title} di organisasi ini.</p>
              <Link href={settingsPath}>
                <button className="text-primary font-bold hover:underline">Kelola di Settings</button>
              </Link>
            </div>
          )}

          <Link href={settingsPath}>
            <button className="w-full h-16 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl text-muted-foreground hover:text-primary flex items-center justify-center gap-2 transition-all">
              <Plus className="h-5 w-5" />
              <span className="font-bold">Tambah Unit Baru</span>
            </button>
          </Link>
        </div>

        <div className="text-center pt-8">
           <Link href="/dashboard" className="text-muted-foreground text-sm hover:text-primary transition-colors">
             Kembali ke Dashboard Utama
           </Link>
        </div>
      </div>
    </div>
  )
}
