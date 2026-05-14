"use client"

import React, { useState, useRef, useEffect } from "react"
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

import { Slider } from "./slider"
import { Button } from "./button"
import { TypographyP } from "./typography"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { 
  Maximize2, 
  RotateCcw, 
  SlidersHorizontal, 
  Palette, 
  RotateCw,
  Sun,
  Contrast as ContrastIcon,
  FlipHorizontal,
  FlipVertical,
  Droplets
} from "lucide-react"
import { cn } from "../lib/utils"

export interface ImageEditorResult {
  pixels: Crop // Use percentages
  filters: {
    brightness: number
    contrast: number
    grayscale: boolean
    sepia: boolean
    vivid: boolean
  }
  rotation: number
}

interface ImageEditorProps {
  image: string
  aspect?: number
  onSave: (result: ImageEditorResult) => void
  className?: string
  saveLabel?: string
}

const PRESET_FILTERS = [
  { name: "Original", id: "none" },
  { name: "Vivid", id: "vivid" },
  { name: "Retro", id: "retro" },
  { name: "Mono", id: "mono" },
  { name: "Cool", id: "cool" },
  { name: "Warm", id: "warm" },
  { name: "B&W", id: "grayscale" },
  { name: "Sepia", id: "sepia" },
  { name: "Bright", id: "bright" },
]

export function ImageEditor({ 
  image, 
  aspect: initialAspect = 16 / 9, 
  onSave, 
  className,
  saveLabel = "Apply Changes" 
}: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState<number | undefined>(initialAspect)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Filters State
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [activeFilter, setActiveFilter] = useState("none")

  // Smart Focus: Scroll to crop area when zoom changes
  useEffect(() => {
    if (previewRef.current && crop && zoom > 1) {
      const timer = setTimeout(() => {
        const container = previewRef.current
        const img = imgRef.current
        if (!container || !img) return

        // Calculate center of crop in percentages
        const centerX = (crop.x + crop.width / 2) / 100
        const centerY = (crop.y + crop.height / 2) / 100

        // Use scrollWidth/Height of the container's content
        const scrollX = (container.scrollWidth * centerX) - (container.clientWidth / 2)
        const scrollY = (container.scrollHeight * centerY) - (container.clientHeight / 2)

        container.scrollTo({
          left: scrollX,
          top: scrollY,
          behavior: 'smooth'
        })
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [zoom])

  // Handle initial crop if image is already loaded (from cache)
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && !crop) {
      const { width, height, naturalWidth, naturalHeight } = imgRef.current
      setupInitialCrop(width, height, naturalWidth, naturalHeight)
    }
  }, [image])

  function setupInitialCrop(width: number, height: number, naturalWidth: number, naturalHeight: number) {
    if (aspect) {
      const initialCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          aspect,
          width,
          height
        ),
        width,
        height
      )
      setCrop(initialCrop)
      
      // Calculate pixel crop BASED ON NATURAL DIMENSIONS
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: (initialCrop.x * naturalWidth) / 100,
        y: (initialCrop.y * naturalHeight) / 100,
        width: (initialCrop.width * naturalWidth) / 100,
        height: (initialCrop.height * naturalHeight) / 100
      }
      setCompletedCrop(pixelCrop)
    } else {
      const initialCrop: Crop = {
        unit: '%',
        x: 5,
        y: 5,
        width: 90,
        height: 90
      }
      setCrop(initialCrop)
      
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: (5 * naturalWidth) / 100,
        y: (5 * naturalHeight) / 100,
        width: (90 * naturalWidth) / 100,
        height: (90 * naturalHeight) / 100
      }
      setCompletedCrop(pixelCrop)
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget
    setupInitialCrop(width, height, naturalWidth, naturalHeight)
  }

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
      console.error("No crop data or image ref available")
      return
    }

    const image = imgRef.current
    
    // Step 1: Create a canvas for the FULL transformed image
    const fullCanvas = document.createElement("canvas")
    const fullCtx = fullCanvas.getContext("2d")
    if (!fullCtx) return

    // Calculate dimensions for full canvas (account for rotation)
    // For 90/270 deg, swap width/height
    const isVerticalRotation = rotation % 180 !== 0
    fullCanvas.width = isVerticalRotation ? image.naturalHeight : image.naturalWidth
    fullCanvas.height = isVerticalRotation ? image.naturalWidth : image.naturalHeight

    fullCtx.save()
    fullCtx.translate(fullCanvas.width / 2, fullCanvas.height / 2)
    fullCtx.rotate((rotation * Math.PI) / 180)
    fullCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    
    // Apply Filters
    let filterString = ""
    if (brightness !== 0) filterString += `brightness(${100 + brightness}%) `
    if (contrast !== 0) filterString += `contrast(${100 + contrast}%) `
    if (saturation !== 0) filterString += `saturate(${100 + saturation}%) `
    
    const af = activeFilter
    if (af === "grayscale" || af === "mono") filterString += "grayscale(100%) "
    if (af === "sepia" || af === "retro") filterString += "sepia(100%) "
    if (af === "vivid") filterString += "saturate(150%) contrast(110%) "
    if (af === "cool") filterString += "hue-rotate(30deg) brightness(105%) "
    if (af === "warm") filterString += "sepia(30%) brightness(105%) "
    fullCtx.filter = filterString.trim() || "none"

    fullCtx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)
    fullCtx.restore()

    // Step 2: Create a second canvas for the CROP
    const cropCanvas = document.createElement("canvas")
    const cropCtx = cropCanvas.getContext("2d")
    if (!cropCtx) return

    cropCanvas.width = completedCrop.width
    cropCanvas.height = completedCrop.height

    // Draw the cropped area from the FULL transformed canvas
    // Note: completedCrop coordinates are already relative to the NATURAL dimensions
    // but they are relative to the PREVIEW state.
    // If the preview is already rotated, we need to make sure the coordinates match.
    cropCtx.drawImage(
      fullCanvas,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    const base64 = cropCanvas.toDataURL("image/jpeg", 0.9)

    onSave({
      pixels: completedCrop,
      filters: {
        brightness,
        contrast,
        saturation,
        activeFilter,
        grayscale: activeFilter === "grayscale" || activeFilter === "mono",
        sepia: activeFilter === "sepia" || activeFilter === "retro",
        vivid: activeFilter === "vivid"
      },
      rotation,
      flipH,
      flipV,
      base64 // Send the baked image!
    })
  }

  // Update crop when aspect changes
  useEffect(() => {
    if (imgRef.current && aspect) {
      const { width, height } = imgRef.current
      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          aspect,
          width,
          height
        ),
        width,
        height
      )
      setCrop(newCrop)
    } else if (!aspect) {
      setCrop(undefined)
    }
  }, [aspect])

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <style>{`
        .ReactCrop__crop-selection {
          border: 2px solid white !important;
          box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.5) !important;
        }
        .ReactCrop__drag-handle {
          width: 10px !important;
          height: 10px !important;
          background-color: white !important;
          border: 1px solid black !important;
          border-radius: 50% !important;
        }
        /* Custom Scrollbar */
        .preview-container::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .preview-container::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .preview-container::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .preview-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>

      {/* Preview Area */}
      <div ref={previewRef} className="preview-container relative min-h-[350px] max-h-[500px] w-full overflow-auto rounded-lg bg-black border border-border/50 shadow-2xl p-8">
        <div 
          style={{ 
            width: `${zoom * 100}%`, 
            margin: '0 auto',
          }}
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => {
              if (imgRef.current) {
                const { naturalWidth, naturalHeight, width, height } = imgRef.current
                const scaleX = naturalWidth / width
                const scaleY = naturalHeight / height
                
                const pixelCrop: PixelCrop = {
                  unit: 'px',
                  x: c.x * scaleX,
                  y: c.y * scaleY,
                  width: c.width * scaleX,
                  height: c.height * scaleY
                }
                setCompletedCrop(pixelCrop)
              }
            }}
            aspect={aspect}
            className="w-full"
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={image}
              onLoad={onImageLoad}
              crossOrigin="anonymous"
              style={{ 
                width: '100%',
                height: 'auto',
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                filter: `
                  brightness(${100 + brightness}%) 
                  contrast(${100 + contrast}%) 
                  saturate(${100 + saturation}%)
                  ${activeFilter === 'grayscale' ? 'grayscale(1)' : ''} 
                  ${activeFilter === 'sepia' ? 'sepia(1)' : ''} 
                  ${activeFilter === 'vivid' ? 'saturate(1.5) contrast(1.1)' : ''} 
                  ${activeFilter === 'bright' ? 'brightness(1.3)' : ''}
                  ${activeFilter === 'retro' ? 'sepia(0.3) contrast(1.1) brightness(1.1)' : ''}
                  ${activeFilter === 'mono' ? 'grayscale(1) contrast(1.3)' : ''}
                  ${activeFilter === 'cool' ? 'hue-rotate(180deg) brightness(1.05)' : ''}
                  ${activeFilter === 'warm' ? 'sepia(0.2) brightness(1.05)' : ''}
                `
              }}
              onLoad={onImageLoad}
              className="block rounded-sm transition-all duration-300"
            />
          </ReactCrop>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto px-1 scrollbar-hide">
        <Tabs defaultValue="crop" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-11 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="crop" className="rounded-md text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Maximize2 className="h-4 w-4" />
              Crop
            </TabsTrigger>
            <TabsTrigger value="filters" className="rounded-md text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Palette className="h-4 w-4" />
              Filters
            </TabsTrigger>
            <TabsTrigger value="adjust" className="rounded-md text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <SlidersHorizontal className="h-4 w-4" />
              Adjust
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crop" className="space-y-5 pt-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Aspect Ratio</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 min-h-[40px]">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "16:9", val: 16 / 9 },
                    { label: "1:1", val: 1 },
                    { label: "4:3", val: 4 / 3 },
                    { label: "Free", val: undefined }
                  ].map((r) => (
                    <Button 
                      key={r.label}
                      variant={aspect === r.val ? "secondary" : "outline"} 
                      size="sm" 
                      className={cn(
                        "h-8 text-[10px] font-bold px-3 transition-all",
                        aspect === r.val && "bg-secondary ring-1 ring-primary/20"
                      )}
                      onClick={() => setAspect(r.val)}
                    >
                      {r.label}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 flex-1 max-w-xs">
                  {/* Top Row: Actions */}
                    <div className="flex items-center gap-1.5">
                      <Button 
                        variant={flipH ? "secondary" : "outline"} 
                        size="icon" 
                        className={cn("h-8 w-8 transition-all", flipH && "ring-1 ring-primary/20")} 
                        onClick={() => setFlipH(!flipH)}
                      >
                        <FlipHorizontal className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={flipV ? "secondary" : "outline"} 
                        size="icon" 
                        className={cn("h-8 w-8 transition-all", flipV && "ring-1 ring-primary/20")} 
                        onClick={() => setFlipV(!flipV)}
                      >
                        <FlipVertical className="h-4 w-4" />
                      </Button>
                      <div className="h-4 w-[1px] bg-border mx-1" />
                      <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors shrink-0" onClick={() => setRotation(r => (r - 90 + 360) % 360)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors shrink-0" onClick={() => setRotation(r => (r + 90) % 360)}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>

                  {/* Bottom Row: Zoom */}
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[zoom]} 
                      min={1} 
                      max={3} 
                      step={0.1} 
                      onValueChange={(v) => setZoom(v[0])}
                      className="flex-1"
                    />
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground w-10 text-center">{zoom.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="pt-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {PRESET_FILTERS.map((f) => (
                <Button
                  key={f.id}
                  variant={activeFilter === f.id ? "secondary" : "outline"}
                  className={cn(
                    "flex-col h-20 w-24 min-w-[96px] gap-2 rounded-lg border transition-all hover:border-primary/50",
                    activeFilter === f.id && "ring-2 ring-primary/20 border-primary"
                  )}
                  onClick={() => setActiveFilter(f.id)}
                >
                  <div className={cn(
                    "w-full h-8 rounded-md bg-gradient-to-br from-primary/10 to-primary/30",
                    f.id === 'grayscale' && "grayscale",
                    f.id === 'sepia' && "sepia",
                    f.id === 'vivid' && "saturate-150 contrast-125",
                    f.id === 'bright' && "brightness-125 shadow-inner"
                  )} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{f.name}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adjust" className="space-y-8 pt-5 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight">
                    <Sun className="h-3.5 w-3.5 text-primary" />
                    Brightness
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded",
                    brightness !== 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>{brightness}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="h-3 w-3 text-muted-foreground/50" />
                  <Slider value={[brightness]} min={-50} max={50} step={1} onValueChange={(v) => setBrightness(v[0])} className="flex-1" />
                  <Sun className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight">
                    <ContrastIcon className="h-3.5 w-3.5 text-primary" />
                    Contrast
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded",
                    contrast !== 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>{contrast}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <ContrastIcon className="h-3 w-3 text-muted-foreground/50" />
                  <Slider value={[contrast]} min={-50} max={50} step={1} onValueChange={(v) => setContrast(v[0])} className="flex-1" />
                  <ContrastIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight">
                    <Droplets className="h-3.5 w-3.5 text-primary" />
                    Saturation
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded",
                    saturation !== 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>{saturation}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-3 w-3 text-muted-foreground/50" />
                  <Slider value={[saturation]} min={-100} max={100} step={1} onValueChange={(v) => setSaturation(v[0])} className="flex-1" />
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex items-center justify-end p-4 rounded-xl bg-muted/30 border border-border mt-auto shadow-inner">
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="h-9 px-4 text-xs font-medium hover:bg-background/80" onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); setZoom(1); setBrightness(0); setContrast(0); setSaturation(0); setActiveFilter("none"); }}>
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            Reset All
          </Button>
          <Button size="sm" className="h-9 px-8 text-xs font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={handleSave}>
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
