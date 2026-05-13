"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { CheckCircle2, XCircle, Clock, Zap } from "lucide-react"

interface ExecutionLog {
  id: string
  status: string
  executedAt: Date
  logs: string // JSON string
  error?: string
}

export function ExecutionLogViewer({ logs }: { logs: ExecutionLog[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-xl">
        <p className="text-sm text-muted-foreground">No execution logs found for this workflow.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-foreground">
      {logs.map((log) => {
        let steps = [];
        try {
          steps = JSON.parse(log.logs || "[]");
        } catch (e) {
          console.error("Failed to parse logs for", log.id);
        }

        return (
          <Card key={log.id} className="overflow-hidden border-primary/5 bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="p-4 pb-2 bg-muted/20 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{new Date(log.executedAt).toLocaleString()}</span>
                  <Badge variant={log.status === "success" ? "default" : "destructive"} className="text-[10px]">
                    {log.status.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground">{log.id}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {steps.map((step: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-background border shadow-sm">
                  <div className="mt-0.5">
                    {step.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold">{step.step}</p>
                      <Badge variant="secondary" className="text-[8px] h-3.5 px-1 bg-primary/5 text-primary border-primary/10">STEP {idx + 1}</Badge>
                    </div>
                    {step.error ? (
                      <p className="text-[10px] text-destructive bg-destructive/5 p-2 rounded-lg border border-destructive/10 font-mono">
                        {step.error}
                      </p>
                    ) : (
                      <pre className="text-[9px] text-muted-foreground bg-muted/30 p-2 rounded-lg overflow-x-auto font-mono max-h-[150px]">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
              {log.error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 mt-2">
                   <p className="text-xs font-bold flex items-center gap-2">
                     <XCircle className="h-4 w-4" /> System Failure
                   </p>
                   <p className="text-[10px] mt-1 font-mono opacity-80">{log.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
