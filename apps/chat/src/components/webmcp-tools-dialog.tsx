"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@workspace/ui/components/dialog";
import { Cpu, Terminal, ShieldAlert } from "lucide-react";

interface WebMcpToolsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tools: Record<string, any>;
}

export function WebMcpToolsDialog({ isOpen, onClose, tools }: WebMcpToolsDialogProps) {
  const toolList = Object.entries(tools);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border border-border text-foreground max-h-[80vh] flex flex-col p-6">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Cpu className="w-5 h-5 text-primary" /> WebMCP Tools Aktif
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Daftar peralatan (client-side tools) yang saat ini terdeteksi dari browser Anda dan dapat digunakan oleh AI.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
          {toolList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-2xl bg-muted/20">
              <ShieldAlert className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">Tidak Ada Tools Terdeteksi</p>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                Gunakan ekstensi WebMCP browser atau jalankan komponen yang mendaftarkan tools client-side.
              </p>
            </div>
          ) : (
            toolList.map(([name, def]) => (
              <div
                key={name}
                className="p-4 border border-border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-primary mb-1.5">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span>{name}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {def.description || "Tidak ada deskripsi."}
                </p>

                {def.parameters && def.parameters.properties && Object.keys(def.parameters.properties).length > 0 && (
                  <div className="mt-2 text-[11px] bg-background/50 rounded-lg p-2.5 border border-border">
                    <span className="font-semibold text-foreground/80 block mb-1 text-[10px]">Parameter:</span>
                    <div className="space-y-1.5 pl-1.5">
                      {Object.entries(def.parameters.properties).map(([propName, propDef]: [string, any]) => {
                        const isRequired = def.parameters.required?.includes(propName);
                        return (
                          <div key={propName} className="flex flex-wrap items-baseline gap-1">
                            <code className="text-primary font-semibold text-[10px] bg-primary/10 px-1 py-0.5 rounded">
                              {propName}
                            </code>
                            <span className="text-muted-foreground font-mono text-[9px] uppercase">
                              ({propDef.type || "any"})
                            </span>
                            {isRequired && (
                              <span className="text-destructive font-semibold text-[9px]">*wajib</span>
                            )}
                            {propDef.description && (
                              <span className="text-muted-foreground block w-full pl-2 mt-0.5 border-l border-muted text-[10px]">
                                {propDef.description}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
