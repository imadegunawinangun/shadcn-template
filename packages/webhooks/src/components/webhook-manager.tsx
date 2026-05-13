"use client"

import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { createWebhook, deleteWebhook, rotateWebhookSecret, updateWebhook, getAvailableEvents } from "../actions"
import { RefreshCw, Globe, Shield, Plus, Trash2, Edit2, Copy, Check, HelpCircle } from "lucide-react"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@workspace/ui/components/tooltip"

interface WebhookManagerProps {
  webhooks: any[]
  workspaceId: string
  deliveries: any[]
  customEvents?: any[]
}

const EMPTY_ARRAY: any[] = [];

export function WebhookManager({ 
  webhooks: initialWebhooks, 
  workspaceId, 
  deliveries = EMPTY_ARRAY, 
  customEvents = EMPTY_ARRAY 
}: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<any[]>(initialWebhooks)
  const [availableEvents, setAvailableEvents] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<any | null>(null)
  
  // Form state
  const [newUrl, setNewUrl] = useState("")
  const [newName, setNewName] = useState("")
  const [webhookType, setWebhookType] = useState<"incoming" | "outgoing">("outgoing")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  // Sinkronisasi webhooks hanya jika initialWebhooks berubah secara substansial
  useEffect(() => { 
    setWebhooks(initialWebhooks);
  }, [initialWebhooks]);

  // Fetch events hanya sekali saat mount atau jika customEvents berubah
  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        const events = await getAvailableEvents();
        if (isMounted) {
          setAvailableEvents([...events, ...customEvents]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
    return () => { isMounted = false; };
  }, [customEvents]);

  const handleOpenAdd = (type: "incoming" | "outgoing") => {
    const tempId = Math.random().toString(36).substring(7);
    // Hanya auto-generate secret untuk INCOMING
    const tempSecret = type === "incoming" ? `whsec_${Math.random().toString(36).substring(2, 15)}` : "";
    
    setEditingSub({ id: tempId, secret: tempSecret, isNew: true }); 
    setWebhookType(type); 
    setNewUrl(""); 
    setNewName(type === "incoming" ? "My App" : "My Hook"); 
    setSelectedEvents([]);
    setIsDialogOpen(true);
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        if (editingSub && !editingSub.isNew) {
          const updated = await updateWebhook(editingSub.id, { name: newName, url: newUrl, events: selectedEvents.join(',') });
          setWebhooks(webhooks.map(w => w.id === editingSub.id ? updated : w));
          setIsDialogOpen(false); 
        } else {
          const newWb = await createWebhook(workspaceId, { 
            id: editingSub?.id,
            secret: editingSub?.secret || "", // Bisa kosong untuk outgoing
            name: newName, 
            url: newUrl, 
            type: webhookType, 
            events: selectedEvents.join(',') 
          });
          setWebhooks([newWb as any, ...webhooks]);
          setEditingSub(newWb);
        }
        toast.success("Webhook saved");
      } catch (err) { toast.error("Failed to save"); }
    })
  }

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH3>Webhooks</TypographyH3>
          <TypographyP className="text-muted-foreground">Manage your incoming and outgoing webhooks.</TypographyP>
        </div>
        <div className="flex gap-2">
           <Button size="sm" variant="outline" onClick={() => handleOpenAdd("incoming")}><Plus className="mr-2 h-4 w-4" /> Incoming</Button>
           <Button size="sm" onClick={() => handleOpenAdd("outgoing")}><Plus className="mr-2 h-4 w-4" /> Outgoing</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {webhooks.map(wh => (
          <Card key={wh.id} className="border-primary/5 hover:border-primary/20 transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary"><Globe className="h-4 w-4" /></div>
                  <div>
                    <h4 className="font-semibold text-sm">{wh.name || wh.url}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter font-mono">{wh.type} • {wh.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{wh.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSub(wh); setNewUrl(wh.url); setNewName(wh.name); setWebhookType(wh.type); setSelectedEvents(wh.events?.split(',') || []); setIsDialogOpen(true); }}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteWebhook(wh.id); setWebhooks(webhooks.filter(w => w.id !== wh.id)); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-muted/30 border-t flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                  <Shield className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    Signing Secret: <span className="text-foreground bg-background px-1.5 py-0.5 rounded border ml-1">
                      {wh.secret ? `${wh.secret.substring(0, 10)}...` : 'Not generated'}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-[10px] gap-1"
                    onClick={() => { navigator.clipboard.writeText(wh.secret); toast.success("Secret copied"); }}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-[10px] gap-1 text-primary"
                    onClick={() => { 
                      startTransition(async () => {
                        const newSec = await rotateWebhookSecret(wh.id);
                        setWebhooks(webhooks.map(w => w.id === wh.id ? { ...w, secret: newSec } : w));
                        toast.success("Secret rotated");
                      });
                    }}
                  >
                    <RefreshCw className={`h-3 w-3 ${isPending ? 'animate-spin' : ''}`} /> Rotate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configure Webhook</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-3 mb-2">
               <div className="space-y-1">
                 <Label className="text-[10px] uppercase text-muted-foreground">Webhook Endpoint URL</Label>
                 <div className="flex gap-2">
                   <Input 
                     readOnly 
                     value={webhookType === 'incoming' ? `${window.location.origin}/api/webhooks/incoming/${editingSub?.id}` : newUrl} 
                     className="h-8 text-xs bg-background font-mono"
                   />
                   <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => { 
                     const url = webhookType === 'incoming' ? `${window.location.origin}/api/webhooks/incoming/${editingSub?.id}` : newUrl;
                     navigator.clipboard.writeText(url);
                     toast.success("URL copied");
                   }}><Copy className="h-3 w-3" /></Button>
                 </div>
                 <p className="text-[9px] text-muted-foreground italic">
                   {editingSub?.isNew ? "URL ini akan aktif segera setelah Anda klik Create." : "Gunakan URL ini sebagai target di layanan eksternal Anda."}
                 </p>
               </div>

               {editingSub?.secret && (
                 <div className="space-y-1">
                   <div className="flex items-center justify-between">
                     <Label className="text-[10px] uppercase text-muted-foreground">
                       {webhookType === 'incoming' ? 'Incoming Key (Revocable)' : 'Signing Secret'}
                     </Label>
                   </div>
                   <div className="flex gap-2">
                     <Input readOnly value={editingSub?.secret} className="h-8 text-xs bg-background font-mono" />
                     <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => { 
                       navigator.clipboard.writeText(editingSub?.secret || "");
                       toast.success("Key copied");
                     }}><Copy className="h-3 w-3" /></Button>
                     {webhookType === 'incoming' && (
                       <Button size="icon" variant="outline" className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => {
                         if (editingSub.isNew) {
                           // Jika baru, cukup generate ulang di client (belum ada di DB)
                           const newSec = `whsec_${Math.random().toString(36).substring(2, 15)}`;
                           setEditingSub({ ...editingSub, secret: newSec });
                           toast.success("Key regenerated");
                         } else {
                           // Jika sudah ada, baru panggil server untuk rotasi
                           startTransition(async () => {
                             try {
                               const newSec = await rotateWebhookSecret(editingSub.id);
                               setEditingSub({ ...editingSub, secret: newSec });
                               setWebhooks(webhooks.map(w => w.id === editingSub.id ? { ...w, secret: newSec } : w));
                               toast.success("Key revoked and rotated");
                             } catch (err) {
                               toast.error("Failed to rotate key");
                             }
                           });
                         }
                       }}><RefreshCw className={`h-3 w-3 ${isPending ? 'animate-spin' : ''}`} /></Button>
                     )}
                   </div>
                   <p className="text-[9px] text-muted-foreground italic">
                     {webhookType === 'incoming' 
                       ? "Berikan kunci ini kepada pengirim. Klik ikon merah untuk membatalkan (revoke) kunci lama." 
                       : "Gunakan kunci ini di server tujuan untuk memverifikasi data dari kami."}
                   </p>
                 </div>
               )}
             </div>

             <div className="grid gap-2">
                <Label>Webhook Name</Label>
                <Input placeholder="e.g. GitHub Repository Hook" value={newName} onChange={e => setNewName(e.target.value)} />
             </div>
             
             {webhookType === "outgoing" && (
               <div className="grid gap-2">
                  <Label>Target URL</Label>
                  <Input placeholder="https://your-api.com/webhook" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
               </div>
             )}

             <div className="grid gap-2">
                <Label>Events to Trigger</Label>
                <div className="grid grid-cols-2 gap-2 border rounded-xl p-3 bg-muted/20 max-h-[150px] overflow-y-auto">
                   {availableEvents.map(e => (
                     <div key={e.id} className="flex items-center gap-2">
                        <Checkbox id={e.id} checked={selectedEvents.includes(e.id)} onCheckedChange={() => setSelectedEvents(cur => cur.includes(e.id) ? cur.filter(x => x !== e.id) : [...cur, e.id])} />
                        <label htmlFor={e.id} className="text-xs cursor-pointer">{e.label}</label>
                     </div>
                   ))}
                </div>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {editingSub ? 'Update Configuration' : 'Create Webhook'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
