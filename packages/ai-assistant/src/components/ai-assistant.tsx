"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo! Saya asisten AI Anda. Ada yang bisa saya bantu terkait template ini?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    
    // Mock response
    setTimeout(() => {
      setMessages([...newMessages, { role: "assistant", content: "Tentu! Template ini dirancang untuk kecepatan dan estetika tinggi menggunakan Next.js 15 dan Tailwind CSS v4." }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            <Card className="w-[350px] shadow-2xl border-none overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-primary text-primary-foreground p-4">
                <CardTitle className="flex items-center justify-between text-lg font-black">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Assistant
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/20" onClick={() => setIsOpen(false)}>
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
              </CardContent>
              <CardFooter className="p-4 border-t bg-background">
                <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya sesuatu..."
                    className="flex-1 bg-muted/50 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button size="icon" className="rounded-xl h-10 w-10">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className={`h-16 w-16 rounded-full shadow-2xl transition-transform active:scale-90 ${isOpen ? "rotate-90" : "hover:scale-110"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
