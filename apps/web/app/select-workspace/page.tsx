import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { OrganizationList } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"

export default async function SelectWorkspacePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3 w-3" />
            Welcome back, {user.firstName}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Pilih <span className="text-primary italic">Organisasi</span></h1>
          <p className="text-muted-foreground text-lg">Silakan pilih organisasi Anda untuk melanjutkan ke dashboard.</p>
        </div>

        <div className="flex justify-center py-8">
          <OrganizationList 
            hidePersonal={true}
            afterSelectOrganizationUrl="/dashboard"
            afterCreateOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full shadow-2xl rounded-3xl overflow-hidden border",
                card: "border-none shadow-none",
                organizationListTitle: "hidden",
                organizationPreviewMainIdentifier: "font-bold text-lg",
              }
            }}
          />
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          Logged in as <span className="font-bold text-foreground">{user.emailAddresses[0].emailAddress}</span>
        </div>
      </div>
    </div>
  )
}
