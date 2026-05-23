"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Plus, Edit2, Trash2, Check, X, PanelLeftClose } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: any[];
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
  isOpen,
  setIsOpen,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditValue(session.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editValue.trim()) {
      onRenameSession(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteSession(id);
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-card border-r border-border text-foreground transition-transform duration-300 md:relative md:translate-x-0 md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border h-[65px] shrink-0">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>Riwayat Obrolan</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="md:flex hidden text-muted-foreground hover:text-foreground w-8 h-8 cursor-pointer"
            title="Sembunyikan Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Button */}
        <div className="p-3 shrink-0">
          <Button
            onClick={() => {
              onCreateSession();
              // On mobile, close sidebar automatically after creating chat
              if (window.innerWidth < 768) {
                setIsOpen(false);
              }
            }}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-dashed border-input hover:bg-muted text-foreground text-xs font-semibold h-10 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Obrolan Baru</span>
          </Button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1 no-scrollbar">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              Tidak ada riwayat obrolan.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = session.id === editingId;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectSession(session.id);
                      if (window.innerWidth < 768) {
                        setIsOpen(false);
                      }
                    }
                  }}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all hover:bg-muted select-none",
                    isActive
                      ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                      : "text-foreground/90"
                  )}
                  onDoubleClick={(e) => {
                    if (!isEditing) handleStartRename(session, e);
                  }}
                >
                  <MessageSquare className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />

                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleSaveRename(session.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center gap-1"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSaveRename(session.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 bg-background border border-input rounded-sm px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="p-0.5 text-primary hover:bg-primary/10 rounded-sm cursor-pointer"
                        title="Simpan"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="p-0.5 text-destructive hover:bg-destructive/10 rounded-sm cursor-pointer"
                        title="Batal"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex-1 truncate pr-12 text-left">
                      {session.title}
                    </div>
                  )}

                  {/* Actions (visible on hover) */}
                  {!isEditing && (
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-transparent">
                      <button
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 rounded-sm cursor-pointer"
                        title="Ubah Nama"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => handleDelete(session.id, e)}
                          className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm cursor-pointer"
                          title="Hapus Obrolan"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
