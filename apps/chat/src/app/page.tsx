"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { WebMCPTool, useWebMCP } from "@workspace/webmcp";
import { Trash2, Send, Settings, Loader2, Check, PanelLeftOpen, Menu, Cpu } from "lucide-react";
import { SettingsDialog } from "../components/settings-dialog";
import { ChatSidebar } from "../components/chat-sidebar";
import { WebMcpToolsDialog } from "../components/webmcp-tools-dialog";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: any[];
}

export default function ChatPage() {
  const { setTheme } = useTheme();
  const [toolsConfig, setToolsConfig] = useState<Record<string, any>>({});
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMcpToolsOpen, setIsMcpToolsOpen] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [loadedSessionId, setLoadedSessionId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pendingActionsRef = React.useRef<(() => void)[]>([]);

  // Helper to generate session ID
  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

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

  // Memoize body object to prevent useChat from recreating it on every render, which triggers infinite loops
  const chatBody = React.useMemo(() => ({
    webmcpTools: toolsConfig
  }), [toolsConfig]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/ai/chat",
    body: chatBody,
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      const toolDef = toolsConfig[toolCall.toolName];
      if (toolDef && typeof toolDef.execute === "function") {
        try {
          const result = await toolDef.execute(toolCall.args);
          return result;
        } catch (err: any) {
          console.error(`Error executing tool ${toolCall.toolName}:`, err);
          return `Error: ${err.message || String(err)}`;
        }
      }
      return `Error: Tool ${toolCall.toolName} not found or not executable.`;
    }
  });

  // Execute deferred actions when the AI is completely done loading/speaking (isLoading becomes false)
  useEffect(() => {
    if (!isLoading && pendingActionsRef.current.length > 0) {
      const actions = [...pendingActionsRef.current];
      pendingActionsRef.current = [];
      setTimeout(() => {
        actions.forEach((action) => {
          try {
            action();
          } catch (e) {
            console.error("Failed to run deferred action:", e);
          }
        });
      }, 50);
    }
  }, [isLoading]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('ai-chat-sessions-v1');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (parsed && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setIsHistoryLoaded(true);
          return;
        }
      }

      // Migrate old history if present
      const oldHistory = localStorage.getItem('ai-chat-fullscreen-history');
      if (oldHistory) {
        const parsedHistory = JSON.parse(oldHistory);
        if (parsedHistory && parsedHistory.length > 0) {
          const migratedSession: ChatSession = {
            id: 'migrated-' + generateId(),
            title: 'Obrolan Migrasi',
            createdAt: Date.now(),
            messages: parsedHistory,
          };
          setSessions([migratedSession]);
          setActiveSessionId(migratedSession.id);
          localStorage.removeItem('ai-chat-fullscreen-history');
          setIsHistoryLoaded(true);
          return;
        }
      }

      // Default fallback if completely empty
      const defaultSession: ChatSession = {
        id: 'default-' + generateId(),
        title: 'Obrolan Baru',
        createdAt: Date.now(),
        messages: [],
      };
      setSessions([defaultSession]);
      setActiveSessionId(defaultSession.id);
    } catch (e) {
      console.error('Failed to load sessions', e);
    } finally {
      setIsHistoryLoaded(true);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (isHistoryLoaded && sessions.length > 0) {
      localStorage.setItem('ai-chat-sessions-v1', JSON.stringify(sessions));
    }
  }, [sessions, isHistoryLoaded]);

  // Whenever the active session changes, load its messages into useChat
  useEffect(() => {
    if (!activeSessionId || !isHistoryLoaded) return;
    const session = sessions.find((s) => s.id === activeSessionId);
    if (session) {
      setMessages(session.messages);
      setLoadedSessionId(activeSessionId);
    }
  }, [activeSessionId, isHistoryLoaded]);

  // Sync useChat messages to the sessions state and auto-update title from first user message
  useEffect(() => {
    if (!activeSessionId || activeSessionId !== loadedSessionId) return;

    setSessions((prev) => {
      const activeSession = prev.find((s) => s.id === activeSessionId);
      if (!activeSession) return prev;

      // Calculate auto-updated title if it's the default and we have a user message
      let newTitle = activeSession.title;
      if (activeSession.title === "Obrolan Baru" && messages.length > 0) {
        const firstUserMessage = messages.find((m) => m.role === "user");
        if (firstUserMessage) {
          newTitle = firstUserMessage.content.trim().slice(0, 30);
          if (firstUserMessage.content.length > 30) {
            newTitle += "...";
          }
        }
      }

      // Check if messages or title actually changed to prevent infinite loops / unnecessary re-renders
      const messagesIdentical = activeSession.messages.length === messages.length &&
        activeSession.messages.every((m, idx) => {
          const currentMsg = messages[idx];
          return m.id === currentMsg.id &&
                 m.content === currentMsg.content &&
                 m.role === currentMsg.role &&
                 JSON.stringify(m.toolInvocations) === JSON.stringify(currentMsg.toolInvocations);
        });

      if (messagesIdentical && activeSession.title === newTitle) {
        return prev;
      }

      return prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        return { ...s, messages, title: newTitle };
      });
    });
  }, [messages, activeSessionId, loadedSessionId]);

  // Create a new session
  const handleCreateSession = React.useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: "Obrolan Baru",
      createdAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  // Delete a session
  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) return; // Prevent deleting if it's the last one

    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      
      // If we are deleting the active session, switch to the first remaining one
      if (id === activeSessionId) {
        const nextActive = filtered[0]?.id || "";
        setActiveSessionId(nextActive);
      }
      return filtered;
    });
  };

  // Rename a session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  // Register client-side WebMCP tools dynamically
  const webmcpToolsList = React.useMemo<WebMCPTool[]>(() => [
    {
      name: "ubahTemaObrolan",
      description: "Mengubah tema tampilan visual aplikasi chat. Pilihan tema: light, dark, theme-nova, theme-vega, theme-maia.",
      inputSchema: {
        type: "object",
        properties: {
          tema: { 
            type: "string", 
            enum: ["light", "dark", "theme-nova", "theme-vega", "theme-maia"],
            description: "Nama tema visual yang ingin diterapkan" 
          }
        },
        required: ["tema"]
      },
      execute: async (args: any) => {
        setTheme(args.tema);
        return `Tema obrolan berhasil diubah menjadi ${args.tema}`;
      }
    },
    {
      name: "buatObrolanBaru",
      description: "Membuat sesi obrolan (chat session) baru yang kosong.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: async () => {
        pendingActionsRef.current.push(() => {
          handleCreateSession();
        });
        return "Sesi obrolan baru berhasil dibuat.";
      }
    },
    {
      name: "bersihkanPesanObrolan",
      description: "Menghapus seluruh riwayat pesan obrolan pada sesi obrolan aktif saat ini.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: async () => {
        pendingActionsRef.current.push(() => {
          setMessages([]);
        });
        return "Seluruh pesan obrolan aktif berhasil dibersihkan.";
      }
    }
  ], [setTheme, handleCreateSession, setMessages]);

  useWebMCP({ tools: webmcpToolsList });

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onCreateSession={handleCreateSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b h-[65px] shrink-0 bg-background">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground cursor-pointer mr-2 md:flex hidden"
                title="Tampilkan Sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}
            {/* Hamburger menu for mobile, only visible if sidebar is closed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground cursor-pointer md:hidden mr-2 flex"
                title="Menu"
              >
                <Menu size={18} />
              </button>
            )}
            <h1 className="text-base font-bold truncate">AI Chat Fullscreen</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setIsMcpToolsOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors font-medium cursor-pointer"
              title="WebMCP Tools"
            >
              <Cpu size={14} /> WebMCP Tools
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors font-medium cursor-pointer"
              title="Pengaturan AI"
            >
              <Settings size={14} /> Settings
            </button>
            <button 
              onClick={() => setMessages([])} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors text-destructive hover:text-destructive hover:bg-destructive/10 font-medium cursor-pointer"
              title="Hapus Obrolan Aktif"
            >
              <Trash2 size={14} /> Clear Chat
            </button>
            <UserButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6 no-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="text-2xl font-medium mb-2">Apa yang bisa saya bantu hari ini?</p>
              <p className="text-sm">Ketik pesan di bawah untuk memulai obrolan.</p>
            </div>
          )}
          
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm animate-none' : 'bg-muted rounded-tl-sm'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                
                {/* Tool Call Rendering */}
                {m.toolInvocations?.map((toolInvocation) => (
                  <div key={toolInvocation.toolCallId} className="mt-3 text-sm bg-background/50 p-3 rounded-lg border text-foreground">
                    <div className="font-semibold flex items-center gap-2 text-primary">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      Executing {toolInvocation.toolName}...
                    </div>
                    {toolInvocation.state === 'result' ? (
                      <div className="mt-2 text-muted-foreground flex items-center gap-1.5 font-medium">
                        <Check className="w-3.5 h-3.5 text-muted-foreground" /> Selesai
                      </div>
                    ) : (
                      <div className="mt-2 text-muted-foreground animate-pulse pl-5">Menjalankan aksi...</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-4 rounded-2xl rounded-tl-sm animate-pulse text-muted-foreground">
                Memproses balasan...
              </div>
            </div>
          )}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-xl">
              <strong>Error:</strong> {error.message}
            </div>
          )}
        </main>

        <footer className="p-4 border-t bg-background shrink-0">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full flex gap-3 relative">
            <input 
              value={input}
              onChange={handleInputChange}
              placeholder="Tulis pesan Anda di sini..." 
              className="flex-1 px-4 py-4 pr-12 rounded-2xl bg-muted/50 border focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input} 
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-primary text-primary-foreground rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Send size={18} />
            </button>
          </form>
        </footer>
      </div>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <WebMcpToolsDialog isOpen={isMcpToolsOpen} onClose={() => setIsMcpToolsOpen(false)} tools={toolsConfig} />
    </div>
  );
}
