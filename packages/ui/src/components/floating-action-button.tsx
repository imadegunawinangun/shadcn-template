import React from "react";
import { Button } from "./button";
import { Sparkles } from "lucide-react";

export interface FABProps {
  onClick: () => void;
  label?: string;
}

export function FloatingActionButton({ onClick, label = "Bantuan AI" }: FABProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[99]">
      <Button
        onClick={onClick}
        size="lg"
        className="h-16 w-16 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        aria-label={label}
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    </div>
  );
}
