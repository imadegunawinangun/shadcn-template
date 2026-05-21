"use client"

import React, { useState } from "react"
import { ImageIcon, X, ImagePlus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@workspace/ui/components/dialog"
import { ImageKitMediaLibrary } from "@workspace/assets"

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImagePicker({ value, onChange, label = "Pilih Gambar" }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Gunakan variabel lingkungan dari Next.js jika tersedia
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""

  const handleSelect = (url: string) => {
    onChange(url)
    setIsOpen(false)
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/20 group">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="rounded-xl font-bold">
                  Ganti
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 overflow-hidden border-none rounded-[3rem]">
                <DialogHeader className="p-8 border-b bg-background">
                  <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">Media Library</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-4">
                  <ImageKitMediaLibrary 
                    publicKey={publicKey}
                    urlEndpoint={urlEndpoint}
                    onSelect={handleSelect}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="destructive" 
              size="sm" 
              className="rounded-xl font-bold"
              onClick={() => onChange("")}
            >
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-32 rounded-[2rem] border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col gap-2"
            >
              <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <ImagePlus className="size-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 overflow-hidden border-none rounded-[3rem]">
            <DialogHeader className="p-8 border-b bg-background">
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">Media Library</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <ImageKitMediaLibrary 
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                onSelect={handleSelect}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
