"use client"

import { Zap, ArrowRight, Trash2, Settings2, Plus, X, GripVertical, Maximize2, Activity } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Badge } from "@workspace/ui/components/badge"
import { useState, useEffect, useTransition } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { WorkflowCanvas } from "./workflow-canvas"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { Workflow } from "../types"
import { createWorkflow, updateWorkflow, deleteWorkflow } from "../actions"
import { getWebhooks } from "@workspace/webhooks/actions"

interface WorkflowManagerProps {
  workflows: Workflow[]
  workspaceId: string
}

export function WorkflowManager({ workflows: initialWorkflows, workspaceId }: WorkflowManagerProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [isPending, startTransition] = useTransition()
  const [showVisualEditor, setShowVisualEditor] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [availableWebhooks, setAvailableWebhooks] = useState<any[]>([])

  useEffect(() => {
    setWorkflows(initialWorkflows)
  }, [initialWorkflows])

  const handleEdit = async (wf: Workflow) => {
    setEditingWorkflow(wf)
    // Ambil webhooks dulu agar saat canvas muncul data sudah ada
    try {
      const whs = await getWebhooks(workspaceId);
      setAvailableWebhooks(whs);
    } catch (e) {
      console.error(e);
    }
    setShowVisualEditor(true)
  }

  const handleQuickCreate = async () => {
    const defaultName = `New Flow ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    try {
      const newWf = await createWorkflow({
        workspaceId,
        name: defaultName,
        triggerId: "manual",
        actions: [],
        flow: { nodes: [], edges: [] }
      })

      if (newWf) {
        // Set data dulu
        setEditingWorkflow(newWf as any);
        
        // Ambil webhooks secara async
        getWebhooks(workspaceId).then(setAvailableWebhooks).catch(console.error);
        
        // Update list
        setWorkflows(prev => [newWf as any, ...prev]);
        
        // BARU BUKA EDITOR (Tanpa transition agar prioritas tinggi)
        setTimeout(() => {
          setShowVisualEditor(true);
        }, 100);
        
        toast.success("Workflow created successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create workflow");
    }
  }

  const handleSaveFromCanvas = async (rawNodes: any[], rawEdges: any[]) => {
    const cleanNodes = rawNodes.map(node => ({
      ...node,
      data: {
        id: node.data.id,
        label: node.data.label,
        config: node.data.config || {},
      }
    }))

    if (editingWorkflow) {
      startTransition(async () => {
        try {
          const updated = await updateWorkflow(editingWorkflow.id, {
            flow: { nodes: cleanNodes, edges: rawEdges },
            actions: cleanNodes.filter(n => n.type === 'action').map(n => ({ id: n.data.id, config: n.data.config }))
          })
          setWorkflows(workflows.map(w => w.id === updated.id ? updated as any : w))
          toast.success("Workflow structure saved")
        } catch (error) {
          toast.error("Failed to save workflow")
        }
      })
    }
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteWorkflow(id)
        setWorkflows(workflows.filter(w => w.id !== id))
        toast.success("Workflow deleted")
      } catch (error) {
        toast.error("Failed to delete workflow")
      }
    })
  }

  const handleStatusToggle = (wf: Workflow) => {
    const newStatus = wf.status === "active" ? "paused" : "active"
    startTransition(async () => {
      try {
        await updateWorkflow(wf.id, { status: newStatus })
        setWorkflows(workflows.map(w => w.id === wf.id ? { ...w, status: newStatus } : w))
      } catch (error) {
        toast.error("Failed to update status")
      }
    })
  }

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH3>Workflows</TypographyH3>
          <TypographyP className="text-muted-foreground">Automate everything with visual nodes.</TypographyP>
        </div>
        <Button onClick={handleQuickCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Flow
        </Button>
      </div>

      <Dialog open={showVisualEditor} onOpenChange={setShowVisualEditor}>
        <DialogContent className="max-w-[98vw] w-[98vw] sm:max-w-none h-[96vh] p-0 overflow-hidden border-none shadow-none rounded-none outline-none">
           <DialogTitle className="sr-only">Workflow Editor</DialogTitle>
           <DialogDescription className="sr-only">Visual canvas for editing automation flows.</DialogDescription>
           {editingWorkflow && (
             <WorkflowCanvas 
               initialData={editingWorkflow} 
               onSave={handleSaveFromCanvas}
               onBack={() => setShowVisualEditor(false)}
               availableWebhooks={availableWebhooks}
             />
           )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {workflows.map((wf) => (
          <Card key={wf.id} className="hover:shadow-md transition-all group border-primary/5 bg-card">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{wf.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{wf.runs} runs • Created: {new Date(wf.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-4 bg-muted/50 px-3 py-1.5 rounded-xl border">
                  <span className={`h-2 w-2 rounded-full ${wf.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{wf.status}</span>
                </div>
                <Switch checked={wf.status === "active"} onCheckedChange={() => handleStatusToggle(wf)} />
                <Button variant="secondary" size="sm" className="rounded-xl h-8 px-4" onClick={() => handleEdit(wf)}>
                  <Maximize2 className="h-3.5 w-3.5 mr-2" /> Editor
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" onClick={() => handleDelete(wf.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
