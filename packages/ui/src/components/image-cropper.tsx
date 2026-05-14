"use client"

import React, { useState, useCallback } from "react"
import Cropper, { Area, Point } from "react-easy-crop"
import { Slider } from "./slider"
import { Button } from "./button"
import { TypographyP } from "./typography"
import { Maximize2, RotateCcw, Image as ImageIcon } from "lucide-react"
import { cn } from "../lib/utils"

interface ImageCropperProps {
  image: string
  aspect?: number
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
  className?: string
}

export function ImageCropper({ image, aspect: initialAspect = 16 / 9, onCropComplete, className }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(initialAspect)

  const onCropChange = (crop: Point) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-muted/50 border border-border/50 shadow-inner">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant={aspect === 16 / 9 ? "secondary" : "outline"} 
              size="sm" 
              className="h-8 text-[11px] font-medium"
              onClick={() => setAspect(16 / 9)}
            >
              16:9
            </Button>
            <Button 
              variant={aspect === 1 ? "secondary" : "outline"} 
              size="sm" 
              className="h-8 text-[11px] font-medium"
              onClick={() => setAspect(1)}
            >
              1:1
            </Button>
            <Button 
              variant={aspect === 4 / 3 ? "secondary" : "outline"} 
              size="sm" 
              className="h-8 text-[11px] font-medium"
              onClick={() => setAspect(4 / 3)}
            >
              4:3
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-[11px] font-medium"
              onClick={() => setAspect(0)}
            >
              Free
            </Button>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-[200px]">
            <Maximize2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(vals) => setZoom(vals[0])}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-3 text-primary">
            <ImageIcon className="h-4 w-4" />
            <TypographyP className="text-[11px] font-medium m-0 leading-none">
              Adjust the image to fit the selected area.
            </TypographyP>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
