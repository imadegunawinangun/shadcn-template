"use client"

import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  Video, 
  Eye, 
  Download, 
  Trash2, 
  Grid2X2, 
  List,
  Plus,
  Upload,
  FileSearch,
  CheckCircle2,
  X,
  Loader2,
  ExternalLink,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"
import { IKImage, IKVideo } from "imagekitio-next"

import { useRef } from "react"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { ImageEditor, ImageEditorResult } from "@workspace/ui/components/image-editor"
// import { Area } from "react-easy-crop" // Removed unused import causing error
import { Input } from "@workspace/ui/components/input"
import { Card } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@workspace/ui/components/dropdown-menu"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

export interface Asset {
  id: string
  name: string
  type: "image" | "video" | "document"
  size: string
  url: string
  path: string
  createdAt: string
}

interface MediaGalleryProps {
  assets: Asset[]
  onAction?: (asset: Asset, action: string) => void
  onUpload?: (source: string, name: string) => Promise<Asset>
  onRename?: (id: string, newName: string, oldName: string) => Promise<void>
  onCopy?: (newUrl: string, originalName: string) => Promise<Asset>
}
export function MediaGallery({ assets: initialAssets, onAction, onUpload, onRename, onCopy }: MediaGalleryProps) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [croppingAsset, setCroppingAsset] = useState<Asset | null>(null)

  const handleEditorSave = (result: ImageEditorResult) => {
    if (!croppingAsset) return
    
    // Stage 1: Orientation (Rotation and Flips must come first)
    const orientation: string[] = []
    if (result.rotation !== 0) orientation.push(`r-${result.rotation}`)
    if (result.flipH) orientation.push('flip-h')
    if (result.flipV) orientation.push('flip-v')
    
    // Stage 2: Crop (Extracted from the oriented image)
    const crop: string[] = []
    if (result.pixels.width && result.pixels.height) {
      crop.push(`cm-extract,x-${Math.round(result.pixels.x)},y-${Math.round(result.pixels.y)},w-${Math.round(result.pixels.width)},h-${Math.round(result.pixels.height)}`)
    }
    
    // Stage 3: Filters & Adjustments
    const effects: string[] = []
    if (result.filters.brightness !== 0) effects.push(`b-${100 + result.filters.brightness}`)
    if (result.filters.contrast !== 0) effects.push(`con-${100 + result.filters.contrast}`)
    if (result.filters.saturation !== 0) effects.push(`s-${100 + result.filters.saturation}`)

    // Mapping filters
    const af = (result.filters as any).activeFilter
    if (af === 'vivid') effects.push('s-150,con-110')
    else if (af === 'retro') effects.push('sepia-20,con-110,b-105')
    else if (af === 'mono') effects.push('e-grayscale,con-130')
    else if (af === 'cool') effects.push('b-105,con-105')
    else if (af === 'warm') effects.push('sepia-10,b-105')
    else if (af === 'grayscale') effects.push('e-grayscale')
    else if (af === 'sepia') effects.push('e-sepia')

    // Construct final transformation string with stages (:)
    const stages = [
      orientation.join(','),
      crop.join(','),
      effects.join(',')
    ].filter(Boolean)
    
    const trPath = stages.length > 0 ? `tr:${stages.join(':')}` : ''
    
    // Fallback URL based transformation
    const urlParts = croppingAsset.url.split('/')
    const hostIndex = urlParts.findIndex(part => part.includes('ik.imagekit.io'))
    const idIndex = hostIndex + 1
    
    let fallbackUrl = croppingAsset.url.split('?')[0]
    if (trPath && hostIndex !== -1 && idIndex < urlParts.length) {
      const parts = [...urlParts]
      parts.splice(idIndex + 1, 0, trPath)
      fallbackUrl = parts.join('/').split('?')[0]
    }

    // USE BAKED BASE64 IF AVAILABLE (More reliable for filters/flips)
    const finalSource = (result as any).base64 || fallbackUrl
      
    if (onCopy) {
      toast.promise(onCopy(finalSource, croppingAsset.name), {
        loading: 'Saving edited version to database...',
        success: 'Copy created successfully!',
        error: 'Failed to create copy'
      })
    } else {
      setAssets(prev => prev.map(a => 
        a.id === croppingAsset.id ? { ...a, url: finalSource } : a
      ))
      toast.success("Image preview updated")
    }
    
    setIsCropOpen(false)
    setCroppingAsset(null)
  }

  // Sinkronisasi state internal saat prop assets dari parent berubah
  useEffect(() => {
    setAssets(initialAssets)
  }, [initialAssets])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [renamingAsset, setRenamingAsset] = useState<Asset | null>(null)
  const [newName, setNewName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = activeFilter === "all" || asset.type === activeFilter
      return matchesSearch && matchesFilter
    })
  }, [assets, searchQuery, activeFilter])

  const handleDelete = (asset: Asset) => {
    setAssets(prev => prev.filter(a => a.id !== asset.id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(asset.id)
      return next
    })
    toast.success(`Deleted ${asset.name}`)
  }

  const handleBulkDelete = () => {
    setAssets(prev => prev.filter(a => !selectedIds.has(a.id)))
    toast.success(`Deleted ${selectedIds.size} assets`)
    setSelectedIds(new Set())
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      
      try {
        let newAsset: Asset;
        
        if (onUpload) {
          // Use external upload (Cloudinary)
          newAsset = await onUpload(base64, file.name)
        } else {
          // Use mock local upload
          const type = file.type.startsWith('image/') ? 'image' : 
                       file.type.startsWith('video/') ? 'video' : 'document'
          
          newAsset = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: type as Asset['type'],
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            url: base64,
            path: `mock/${file.name}`,
            createdAt: new Date().toISOString()
          }
        }
        
        setAssets(prev => [newAsset, ...prev])
        toast.success("Upload successful", {
          description: `${file.name} has been added to your media library.`
        })
      } catch (error) {
        console.error("Upload error:", error)
        toast.error("Upload failed", {
          description: "There was an error uploading your file."
        })
      } finally {
        setIsUploading(false)
        setIsUploadOpen(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDownload = (asset: Asset) => {
    if (asset.url === "#") {
      toast.error("Download not available for this mock asset")
      return
    }
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloading ${asset.name}`)
  }

  const [isRenaming, setIsRenaming] = useState(false)
  const handleRename = async () => {
    if (!renamingAsset || !newName.trim() || isRenaming) return
    
    setIsRenaming(true)
    try {
      if (onRename) {
        await onRename(renamingAsset.path, newName.trim(), renamingAsset.name)
      }
      
      setAssets(prev => prev.map(a => a.id === renamingAsset.id ? { ...a, name: newName.trim() } : a))
      toast.success("Asset renamed")
      setRenamingAsset(null)
      setNewName("")
    } catch (error) {
      console.error("Rename error:", error)
      toast.error("Failed to rename asset")
    } finally {
      setIsRenaming(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAssets.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAssets.map(a => a.id)))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(new Date(dateStr))
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20 p-2 rounded-xl border border-border/50 shadow-sm">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <Input 
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            placeholder="Search assets..." 
            className="bg-background border-none shadow-none focus-visible:ring-0 w-full h-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline capitalize">{activeFilter === 'all' ? 'All Types' : activeFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setActiveFilter("all")}>All Types</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveFilter("image")}>Images</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("video")}>Videos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("document")}>Documents</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center border rounded-lg p-0.5 bg-background shadow-sm">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7 rounded-md"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7 rounded-md"
              onClick={() => setViewMode("list")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="h-4 w-[1px] bg-border mx-1" />

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 px-4 gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Assets</DialogTitle>
                <DialogDescription>
                  Choose a file to upload to your media library.
                </DialogDescription>
              </DialogHeader>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-colors border-primary/20",
                  isUploading ? "bg-muted/30 cursor-not-allowed" : "bg-muted/10 hover:bg-muted/20 cursor-pointer"
                )}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {isUploading ? "Uploading files..." : "Click to select a file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Images, Videos, or Documents</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" disabled={isUploading} onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-2.5 h-6">
              {selectedIds.size} Selected
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
            <Button variant="destructive" size="sm" className="h-8 gap-2" onClick={handleBulkDelete}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-2xl bg-muted/5">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileSearch className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No assets found</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-[300px]">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button variant="link" className="mt-2" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}>
            Clear all filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className={cn(
              "relative overflow-hidden group border-border/50 hover:border-primary/50 flex flex-col h-full bg-card shadow-sm transition-all hover:shadow-md",
              selectedIds.has(asset.id) && "ring-2 ring-primary border-primary"
            )}>
              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Checkbox 
                  checked={selectedIds.has(asset.id)} 
                  onCheckedChange={() => toggleSelect(asset.id)}
                  className="bg-background border-primary/50"
                />
              </div>

              <div className="relative aspect-square w-full">
                {asset.type === "image" ? (
                  <div className="w-full h-full overflow-hidden bg-muted cursor-pointer" onClick={() => setPreviewAsset(asset)}>
                    {asset.url.includes("ik.imagekit.io") ? (
                      <IKImage
                        src={asset.url}
                        transformation={[{ width: "300", height: "300", cropMode: "extract" }]}
                        loading="lazy"
                        alt={asset.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <img 
                        src={asset.url} 
                        alt={asset.name} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-muted/50 flex flex-col items-center justify-center gap-3 cursor-pointer" onClick={() => setPreviewAsset(asset)}>
                    <div className="p-4 rounded-2xl bg-background shadow-sm">
                      {asset.type === "video" ? (
                        <Video className="h-8 w-8 text-primary" />
                      ) : (
                        <FileText className="h-8 w-8 text-blue-500" />
                      )}
                    </div>
                    <Badge variant="outline" className="bg-background/80 text-[10px] uppercase tracking-wider">
                      {asset.type}
                    </Badge>
                  </div>
                )}
                
                {/* Action Overlay */}
                <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto backdrop-blur-[2px]">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border-none text-white transition-transform hover:scale-110"
                    onClick={() => setPreviewAsset(asset)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border-none text-white transition-transform hover:scale-110"
                    onClick={() => handleDownload(asset)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border-none text-white transition-transform hover:scale-110"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setRenamingAsset(asset); setNewName(asset.name); }}>
                        Rename
                      </DropdownMenuItem>
                      {asset.type === "image" && (
                        <DropdownMenuItem onClick={() => { setCroppingAsset(asset); setIsCropOpen(true); }}>
                          Edit Image
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(asset)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3 bg-card border-t border-border/50 mt-auto">
                <p className="text-[11px] font-semibold truncate text-foreground/90 group-hover:text-primary transition-colors">
                  {asset.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-tight">
                    {asset.size}
                  </p>
                  <Badge variant="ghost" className="h-4 px-1 text-[8px]">
                    {asset.type}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                <TableHead className="w-[40px] px-4">
                  <Checkbox 
                    checked={selectedIds.size === filteredAssets.length && filteredAssets.length > 0} 
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="px-2 h-12 min-w-[200px]">Name</TableHead>
                <TableHead className="px-6 h-12 hidden md:table-cell">Type</TableHead>
                <TableHead className="px-6 h-12 hidden md:table-cell">Size</TableHead>
                <TableHead className="px-6 h-12 hidden lg:table-cell">Date Added</TableHead>
                <TableHead className="px-6 h-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} className={cn(
                  "group transition-colors hover:bg-muted/20 border-border/50",
                  selectedIds.has(asset.id) && "bg-primary/5"
                )}>
                  <TableCell className="px-4 py-3">
                    <Checkbox 
                      checked={selectedIds.has(asset.id)} 
                      onCheckedChange={() => toggleSelect(asset.id)}
                    />
                  </TableCell>
                  <TableCell className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50 shadow-sm cursor-pointer" onClick={() => setPreviewAsset(asset)}>
                        {asset.type === "image" ? (
                          <img src={asset.url} alt="" className="h-full w-full object-cover" />
                        ) : asset.type === "video" ? (
                          <Video className="h-5 w-5 text-primary" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[150px] sm:max-w-[250px] group-hover:text-primary transition-colors cursor-pointer" onClick={() => setPreviewAsset(asset)}>
                        {asset.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-3 hidden md:table-cell">
                    <Badge variant="secondary" className="text-[10px] uppercase bg-muted/50 border-none">
                      {asset.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-xs text-muted-foreground hidden md:table-cell">
                    {asset.size}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                    {formatDate(asset.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="hidden sm:flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setPreviewAsset(asset)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleDownload(asset)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="sm:hidden" onClick={() => setPreviewAsset(asset)}>
                            <Eye className="mr-2 h-4 w-4" /> Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="sm:hidden" onClick={() => handleDownload(asset)}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setRenamingAsset(asset); setNewName(asset.name); }}>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive cursor-pointer focus:text-destructive" 
                            onClick={() => handleDelete(asset)}
                          >
                            Delete Asset
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Preview Dialog */}
      <Dialog open={!!previewAsset} onOpenChange={(open) => !open && setPreviewAsset(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none" showCloseButton={false}>
          {previewAsset && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{previewAsset.name}</DialogTitle>
                <DialogDescription>Asset preview for {previewAsset.name}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col h-[80vh] relative">
                <div className="flex items-center justify-between p-4 bg-background/20 backdrop-blur-md z-10 border-b border-white/10">
                <div className="flex flex-col">
                  <h3 className="text-white font-medium">{previewAsset.name}</h3>
                  <p className="text-white/60 text-xs">{previewAsset.size} • {formatDate(previewAsset.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="h-8 bg-white/10 hover:bg-white/20 text-white border-none" onClick={() => handleDownload(previewAsset)}>
                    <Download className="h-3.5 w-3.5 mr-2" /> Download
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => setPreviewAsset(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                {previewAsset.type === "image" ? (
                  previewAsset.url.includes("ik.imagekit.io") ? (
                    <IKImage
                      src={previewAsset.url}
                      transformation={[{ width: "1200" }]}
                      alt={previewAsset.name}
                      className="max-h-full max-w-full object-contain shadow-2xl"
                    />
                  ) : (
                    <img src={previewAsset.url} alt="" className="max-h-full max-w-full object-contain shadow-2xl" />
                  )
                ) : previewAsset.type === "video" ? (
                  previewAsset.url.includes("ik.imagekit.io") ? (
                    <IKVideo
                      src={previewAsset.url}
                      controls={true}
                      className="max-h-full max-w-full"
                    />
                  ) : (
                    <video src={previewAsset.url} controls className="max-h-full max-w-full" />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-4 text-white">
                    <FileText className="h-24 w-24 opacity-20" />
                    <p>Preview not available for documents</p>
                    <Button variant="secondary" onClick={() => handleDownload(previewAsset)}>Download to View</Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={!!renamingAsset} onOpenChange={(open) => !open && setRenamingAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Asset</DialogTitle>
            <DialogDescription>
              Enter a new name for your asset.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Asset name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenamingAsset(null)} disabled={isRenaming}>Cancel</Button>
            <Button onClick={handleRename} disabled={isRenaming}>
              {isRenaming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Renaming...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editor Dialog */}
      <Dialog open={isCropOpen} onOpenChange={(open) => !open && setIsCropOpen(false)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
          <div className="bg-background rounded-lg overflow-hidden border shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between bg-muted/30">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">Image Editor</DialogTitle>
                <DialogDescription className="text-xs">
                  Apply filters, adjustments and crops to your asset.
                </DialogDescription>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              {croppingAsset && (
                <ImageEditor 
                  image={croppingAsset.url.split('?')[0] || ""} 
                  onSave={handleEditorSave}
                  saveLabel="Make a copy on database"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
