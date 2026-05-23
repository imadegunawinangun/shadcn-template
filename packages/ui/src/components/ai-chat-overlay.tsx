"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  // Menambahkan context agar AI tahu di mana dia berada
  context?: Record<string, any>;
  // Mengarahkan ke model yang bisa menggunakan WebMCP tools
  onSendMessage: (message: string, context: Record<string, any>) => Promise<string>;
}

export function AIChatOverlay({ isOpen, onClose, context, onSendMessage }: AIChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Saya Copilot Anda. Apa yang bisa saya bantu di halaman ini?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input?.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await onSendMessage(userMessage, context || {});
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, terjadi kendala teknis." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 z-[100] w-[350px]"
        >
          <Card className="shadow-2xl border-none overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary text-primary-foreground p-4">
              <CardTitle className="flex items-center justify-between text-lg font-black">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Copilot
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/20" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-background border rounded-tl-none"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-muted-foreground p-2 flex items-center gap-2"><Sparkles className="h-3 w-3 animate-pulse" /> Berpikir...</div>}
            </CardContent>
            <CardFooter className="p-4 border-t bg-background">
              <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik perintah..."
                  className="flex-1 bg-muted/50 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="icon" className="rounded-xl h-10 w-10" disabled={loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

