"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { AIChatOverlay } from "@workspace/ui/components/ai-chat-overlay";
import { FloatingActionButton } from "@workspace/ui/components/floating-action-button";
import { WebMCPTool } from "@workspace/webmcp";
import { Trash2 } from "lucide-react";

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsConfig, setToolsConfig] = useState<Record<string, any>>({});
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Sync tools from window.__WEBMCP_TOOLS__
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      const globalTools = (window as any).__WEBMCP_TOOLS__ || {};
      const newConfig: Record<string, any> = {};

      Object.keys(globalTools).forEach((toolName) => {
        const tool = globalTools[toolName] as WebMCPTool;
        newConfig[toolName] = {
          description: tool.description,
          parameters: tool.inputSchema,
          execute: tool.execute,
        };
      });

      // Simple deep equality check could be here, but for now just update if keys change
      setToolsConfig((prev) => {
        const prevKeys = Object.keys(prev).join(",");
        const newKeys = Object.keys(newConfig).join(",");
        if (prevKeys !== newKeys) {
          return newConfig;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/ai/chat",
    body: {
      webmcpTools: toolsConfig
    },
  });

  // Muat histori dari localStorage saat komponen pertama kali dirender
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai-chat-history');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    } finally {
      setIsHistoryLoaded(true);
    }
  }, [setMessages]);

  // Simpan histori ke localStorage setiap kali ada perubahan pada pesan
  useEffect(() => {
    if (isHistoryLoaded) {
      localStorage.setItem('ai-chat-history', JSON.stringify(messages));
    }
  }, [messages, isHistoryLoaded]);

  return (
    <>
      <FloatingActionButton onClick={() => setIsOpen(!isOpen)} />
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[350px] bg-background border rounded-2xl shadow-xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center font-bold">
            <span>AI Assistant</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMessages([])} 
                className="hover:opacity-75 flex items-center gap-1 text-xs bg-primary-foreground/10 px-2 py-1 rounded"
                title="Hapus Histori"
              >
                <Trash2 size={14} /> Clear
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-75 text-xl leading-none">&times;</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.length === 0 && (
              <div className="text-muted-foreground text-center mt-10">Halo! Saya asisten AI Anda.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                  {m.content}
                  
                  {/* Tool Call Rendering */}
                  {m.toolInvocations?.map((toolInvocation) => (
                    <div key={toolInvocation.toolCallId} className="mt-2 text-xs opacity-75 bg-background p-2 rounded border text-foreground">
                      <span className="font-semibold">Executing {toolInvocation.toolName}...</span>
                      {toolInvocation.state === 'result' ? (
                        <div className="mt-1 text-green-500">✓ Done</div>
                      ) : (
                        <div className="mt-1 animate-pulse">Running...</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-muted-foreground">Berpikir...</div>}
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs">
                <strong>Error:</strong> {error.message}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t bg-muted/30 flex gap-2">
            <input 
              value={input}
              onChange={handleInputChange}
              placeholder="Tanya saya..." 
              className="flex-1 px-3 py-2 rounded-xl bg-background border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" disabled={isLoading || !input} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-50">Kirim</button>
          </form>
        </div>
      )}
    </>
  );
}
