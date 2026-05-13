"use client"

import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position,
  NodeProps,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Zap, Plus, Save, ArrowLeft, MoreVertical, X, Settings, Trash2, Globe, Link2 } from 'lucide-react';
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { toast } from "sonner";
import { pieces as registryPieces, piecesMap } from "../pieces/registry";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@workspace/ui/components/sheet";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@workspace/ui/components/select";

const N8nNode = ({ data, selected, type }: NodeProps) => {
  const piece = piecesMap[data.id];
  const Icon = piece?.icon || data.icon || Zap;
  const isTrigger = type === 'trigger';
  const isWebhook = data.id === 'webhook_incoming';

  return (
    <div className={`
      flex flex-col bg-card border-2 rounded-xl min-w-[240px] shadow-sm transition-all
      ${selected ? 'border-primary shadow-lg ring-4 ring-primary/5 scale-105' : 'border-border hover:border-primary/40'}
    `}>
      <div className="flex items-center">
        {!isTrigger && <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary border-2 border-background -left-1" />}
        <div className={`p-3 rounded-tl-lg ${isTrigger ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'} border-r`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="px-4 py-2 flex-1 text-left">
          <p className={`text-[9px] font-bold uppercase tracking-widest ${isTrigger ? 'text-orange-500' : 'text-primary'}`}>
            {isTrigger ? 'Trigger' : 'Action'}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold truncate max-w-[140px]">{data.label}</p>
          </div>
        </div>
        <Handle type="source" position={Position.Right} className={`w-2 h-2 border-2 border-background -right-1 ${isTrigger ? '!bg-orange-500' : '!bg-primary'}`} />
      </div>

      {isWebhook && (
        <div className="p-3 pt-0">
          <div className="bg-muted/50 rounded-lg p-2 border border-dashed text-[9px] font-mono break-all text-muted-foreground flex items-center gap-2">
            <Link2 className="h-3 w-3" />
            <span>{data.config?.webhookUrl || "/api/webhooks/incoming/[id]"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  action: N8nNode,
  trigger: N8nNode,
};

interface WorkflowCanvasProps {
  initialData?: any;
  onSave: (nodes: any[], edges: any[]) => void;
  onBack: () => void;
  availableWebhooks?: any[];
}

export function WorkflowCanvas({ initialData, onSave, onBack, availableWebhooks = [] }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.flow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.flow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const pieces = useMemo(() => [...registryPieces], []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'var(--primary)', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const onNodeClick = (_: any, node: any) => setSelectedNode(node);

  const updateNodeData = (id: string, config: any) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === id) {
          if (node.data.id === 'webhook_incoming' && config.webhookId) {
             const wh = availableWebhooks.find(w => w.id === config.webhookId);
             return { 
               ...node, 
               data: { 
                 ...node.data, 
                 config: { 
                   ...config, 
                   webhookName: wh?.name, 
                   webhookUrl: `/api/webhooks/incoming/${wh?.id}` 
                 } 
               } 
             };
          }
          return { ...node, data: { ...node.data, config } };
        }
        return node;
      })
    );
  };

  const addPiece = (piece: any) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: (piece.id === 'manual' || piece.id === 'webhook_incoming') ? 'trigger' : 'action',
      position: { x: 200, y: 200 },
      data: { 
        ...piece, 
        label: piece.displayName, 
        icon: piece.icon,
        props: piece.id === 'webhook_incoming' ? [
          { name: "webhookId", label: "Select Endpoint", type: "select", options: availableWebhooks.map(w => ({ label: w.name, value: w.id })) }
        ] : piece.props
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="flex h-full w-full border-t bg-background relative overflow-hidden text-foreground">
      <style>{`
        .react-flow__background { background-color: var(--background); }
        .react-flow__controls { background: var(--card); border: 1px solid var(--border); box-shadow: none; border-radius: 12px; }
        .react-flow__minimap { background: var(--card) !important; border: 1px solid var(--border) !important; border-radius: 16px !important; }
        .react-flow__edge-path { stroke-dasharray: 5; animation: dash 1s linear infinite; }
        @keyframes dash { from { stroke-dashoffset: 10; } to { stroke-dashoffset: 0; } }
      `}</style>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Button variant="outline" size="sm" onClick={onBack} className="bg-background/80 backdrop-blur shadow-lg">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-xl border shadow-lg flex items-center gap-3">
            <h3 className="font-bold text-sm">{initialData?.name || "New Visual Flow"}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
           <Button variant="outline" size="sm" onClick={() => onSave(nodes, edges)}>
             <Save className="h-4 w-4 mr-2" /> Save Flow
           </Button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="var(--border)" gap={24} size={1.5} />
        <Controls position="bottom-left" />
        <MiniMap position="bottom-right" />
        
        <Panel position="bottom-center" className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur border rounded-2xl shadow-2xl mb-4">
           <Button variant="ghost" size="sm" onClick={() => addPiece({ id: 'manual', displayName: 'Manual Trigger', icon: Zap })}>
             <Zap className="h-4 w-4 mr-1 text-orange-500" /> Manual
           </Button>
           <Button variant="ghost" size="sm" onClick={() => addPiece({ id: 'webhook_incoming', displayName: 'Webhook Trigger', icon: Globe })}>
             <Globe className="h-4 w-4 mr-1 text-orange-500" /> Webhook
           </Button>
           <div className="w-[1px] h-4 bg-border mx-2" />
           {pieces.map(p => (
             <Button key={p.id} variant="ghost" size="sm" onClick={() => addPiece(p)}>
               <p.icon className={`h-4 w-4 mr-2 ${p.color}`} /> {p.displayName.split(' ')[0]}
             </Button>
           ))}
        </Panel>
      </ReactFlow>

      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
             <SheetTitle>{selectedNode?.data.label}</SheetTitle>
             <SheetDescription>Configure parameters for this node.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 overflow-y-auto max-h-[60vh]">
            {selectedNode?.data.props?.map((prop: any) => (
              <div key={prop.name} className="grid gap-2">
                <Label className="text-[11px] font-bold uppercase">{prop.label}</Label>
                {prop.type === 'select' ? (
                  <Select 
                    value={selectedNode.data.config?.[prop.name] || ''}
                    onValueChange={(val) => updateNodeData(selectedNode.id, { ...selectedNode.data.config, [prop.name]: val })}
                  >
                    <SelectTrigger><SelectValue placeholder={`Select ${prop.label}`} /></SelectTrigger>
                    <SelectContent>
                      {prop.options?.map((opt: any) => (
                        <SelectItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                          {typeof opt === 'string' ? opt : opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    value={selectedNode.data.config?.[prop.name] || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, { ...selectedNode.data.config, [prop.name]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
             <Button className="flex-1" onClick={() => setSelectedNode(null)}>Update Node</Button>
             <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setNodes(nds => nds.filter(n => n.id !== selectedNode.id)); setSelectedNode(null); }}>
               <Trash2 className="h-4 w-4" />
             </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
