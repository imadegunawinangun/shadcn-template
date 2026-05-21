"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { 
  Card, 
  CardContent, 
} from "@workspace/ui/components/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Layers, 
  TrendingUp, 
  CheckCircle2,
  ExternalLink,
  Home,
  Settings2,
  FileText,
  Eye,
  Globe,
  Send,
  Loader2,
  Sparkles,
  Briefcase,
  Video,
  Palette
} from "lucide-react";
import { ThemeCustomizer } from "@workspace/ui/components/theme-customizer";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@workspace/ui/components/dropdown-menu";
import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { deleteLandingPage, setHomePage, updateLandingPage, createLandingPage } from "./actions";
import { DashboardShell, DashboardHeader } from "@workspace/dashboard";
import { PuckRenderClient } from "@workspace/landing-page";
import { TEMPLATES_CONTENT } from "./template-data";

// Live Puck preview component
// Uses CSS `zoom` (not transform:scale) so the layout height is respected
// and the user can scroll through the full template inside the preview panel.
function LiveTemplatePreview({ templateId, theme }: { templateId: string; theme?: any }) {
  const { resolvedTheme } = useTheme();
  const data = TEMPLATES_CONTENT[templateId] ?? TEMPLATES_CONTENT.blank;
  const isDark = resolvedTheme === "dark";

  const brandingStyle: React.CSSProperties = {
    ...(theme?.color === "Custom" && theme?.customColor
      ? { "--primary": theme.customColor, "--ring": theme.customColor } as any
      : {}),
    ...(theme?.secondaryColor === "Custom" && theme?.customSecondaryColor
      ? { "--secondary": theme.customSecondaryColor } as any
      : {}),
    ...(theme?.radius
      ? { "--radius": theme.radius.includes("rem") ? theme.radius : `${theme.radius}rem` } as any
      : {}),
  };

  return (
    // Outer: scrollable container that fills the right panel
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      {/* Inner: zoomed-down to 30% so 1280px page fits ~384px panel width */}
      <div
        className={cn(
          "pointer-events-none font-sans bg-background text-foreground min-h-screen",
          isDark && "dark"
        )}
        style={{
          zoom: 0.30,
          width: "100%",
          ...brandingStyle,
        }}
        data-style={theme?.style?.toLowerCase()}
        data-base-color={theme?.baseColor?.toLowerCase()}
        data-theme={theme?.color === "Custom" ? "custom" : theme?.color?.toLowerCase()}
        data-font-heading={theme?.fontHeading?.toLowerCase()}
        data-font-body={theme?.fontBody?.toLowerCase()}
        data-radius={theme?.radius}
      >
        <PuckRenderClient data={data} />
      </div>
    </div>
  );
}


const TEMPLATE_THEMES: Record<string, any> = {
  blank: {
    style: "Nova",
    baseColor: "Zinc",
    color: "Slate",
    customColor: "#64748b",
    chartColor: "Auto",
    customChartColor: "#64748b",
    fontHeading: "Inter",
    fontBody: "Roboto",
    radius: "0.5",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  },
  saas: {
    style: "Nova",
    baseColor: "Zinc",
    color: "Blue",
    customColor: "#3b82f6",
    chartColor: "Auto",
    customChartColor: "#3b82f6",
    fontHeading: "Geist",
    fontBody: "Inter",
    radius: "0.5",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  },
  agency: {
    style: "Maia",
    baseColor: "Neutral",
    color: "Slate",
    customColor: "#0f172a",
    chartColor: "Auto",
    customChartColor: "#0f172a",
    fontHeading: "Space Grotesk",
    fontBody: "IBM Plex Sans",
    radius: "0",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  },
  sales: {
    style: "Vega",
    baseColor: "Stone",
    color: "Emerald",
    customColor: "#10b981",
    chartColor: "Auto",
    customChartColor: "#10b981",
    fontHeading: "Outfit",
    fontBody: "Outfit",
    radius: "0.75",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  },
  portfolio: {
    style: "Mira",
    baseColor: "Zinc",
    color: "Purple",
    customColor: "#a855f7",
    chartColor: "Auto",
    customChartColor: "#a855f7",
    fontHeading: "Outfit",
    fontBody: "Outfit",
    radius: "1.5",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  },
  webinar: {
    style: "Nova",
    baseColor: "Mauve",
    color: "Rose",
    customColor: "#f43f5e",
    chartColor: "Auto",
    customChartColor: "#f43f5e",
    fontHeading: "Inter",
    fontBody: "Roboto",
    radius: "0.375",
    secondaryColor: "Slate",
    customSecondaryColor: "#64748b",
    menu: "Default",
    menuAppearance: "Solid",
    menuAccent: "Subtle",
  }
};

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  isHome: number;
  updatedAt: Date;
}

export function WebsitePagesClient({ 
  initialPages, 
  workspaceId, 
  workspaceTheme 
}: { 
  initialPages: Page[], 
  workspaceId: string, 
  workspaceTheme?: any 
}) {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [activeTab, setActiveTab] = useState("all");

  // Create Page Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("saas");
  const [isCreating, setIsCreating] = useState(false);
  const [customTheme, setCustomTheme] = useState<any>(workspaceTheme || TEMPLATE_THEMES.saas);

  const totalViews = pages.reduce((acc, p) => acc + (p.views || 0), 0);
  
  const filteredPages = pages.filter(p => {
    if (activeTab === "all") return true;
    return p.status === activeTab;
  });

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Real-time beautiful slug generator
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove symbols
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-") // Collapse consecutive hyphens
      .trim();
    setSlug(generatedSlug);
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      toast.error("Judul dan slug wajib diisi!");
      return;
    }
    setIsCreating(true);
    try {
      const { id } = await createLandingPage({ 
        title, 
        slug, 
        templateId: selectedTemplate,
        theme: customTheme
      });
      toast.success("Landing page berhasil dibuat dari template!");
      setIsCreateOpen(false);
      window.location.href = `/dashboard/website/${id}`;
    } catch (error) {
      toast.error("Gagal membuat landing page");
      setIsCreating(false);
    }
  };

  const handleSetHome = async (id: string) => {
    try {
      await setHomePage(id);
      setPages(pages.map(p => ({
        ...p,
        isHome: p.id === id ? 1 : 0
      })));
      toast.success("Halaman Beranda berhasil diubah!");
    } catch (error) {
      toast.error("Gagal mengubah halaman beranda");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await updateLandingPage(id, { status: newStatus });
      setPages(pages.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast.success(`Status halaman berhasil diubah menjadi ${newStatus === "published" ? "Terbit" : "Draft"}!`);
    } catch (error) {
      toast.error("Gagal mengubah status halaman");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus halaman ini?")) return;
    
    try {
      await deleteLandingPage(id);
      setPages(pages.filter(p => p.id !== id));
      toast.error("Halaman berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus halaman");
    }
  };

  const templates = [
    {
      id: "blank",
      name: "Canvas Kosong (Blank)",
      description: "Mulai dari nol dengan kanvas bersih untuk merancang landing page kustom Anda.",
      icon: FileText,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
      borderColor: "border-muted-foreground/25"
    },
    {
      id: "saas",
      name: "SaaS & Produk Software",
      description: "Lengkap dengan Hero, Trust Bar, Fitur Unggulan, Stats, Pricing, FAQ, dan Call-to-Action.",
      icon: Layers,
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20",
      badge: "Populer"
    },
    {
      id: "agency",
      name: "Agensi & Jasa Profesional",
      description: "Didesain khusus untuk agensi dengan portofolio, alur proses tahapan kerja, tim, dan CTA.",
      icon: Globe,
      color: "text-blue-500",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/20"
    },
    {
      id: "sales",
      name: "Sales Page / E-commerce",
      description: "Strategi urgensi tinggi dengan Masalah & Solusi, Testimonial, Scarcity, Pricing, dan CTA.",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/5",
      borderColor: "border-emerald-500/20"
    },
    {
      id: "portfolio",
      name: "Portfolio & Resume",
      description: "Sempurna untuk personal brand, CV digital, portofolio desainer/developer, dan kontak.",
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/20"
    },
    {
      id: "webinar",
      name: "Webinar / Event Register",
      description: "Halaman pendaftaran seminar/kelas online dengan Scarcity, detail Agenda, FAQ, dan form.",
      icon: Video,
      color: "text-rose-500",
      bgColor: "bg-rose-500/5",
      borderColor: "border-rose-500/20"
    }
  ];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manajemen Halaman"
        text="Kelola semua landing page dan monitor performanya secara real-time."
      >
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="shadow-md hover:shadow-lg transition-all rounded-xl">
              <Plus className="size-4 mr-2 animate-pulse" /> Buat Laman Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl w-[92vw] h-[85vh] p-0 flex flex-col md:flex-row overflow-hidden rounded-3xl border-none shadow-2xl">
            {/* Left Panel: Form & Template Selection */}
            <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto p-6 bg-card justify-between">
              <div>
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    Buat Landing Page Baru
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Masukkan identitas halaman dan pilih template visual premium untuk mempercepat pembuatan.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreatePage} className="space-y-4 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Judul Halaman</Label>
                      <Input 
                        id="title" 
                        placeholder="Promo Ramadhan / Kelas Premium" 
                        value={title} 
                        onChange={(e) => handleTitleChange(e.target.value)} 
                        required 
                        className="rounded-xl border bg-muted/20 h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Slug URL</Label>
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1 flex items-center">
                          <span className="absolute left-3 text-[10px] text-muted-foreground font-mono font-medium">/</span>
                          <Input 
                            id="slug" 
                            placeholder="promo-ramadhan" 
                            value={slug} 
                            onChange={(e) => setSlug(e.target.value)} 
                            required 
                            className="pl-6 rounded-xl border bg-muted/20 font-mono text-[10px] h-9 w-full"
                          />
                        </div>
                        {/* Theme Customizer Icon Button next to slug */}
                        <ThemeCustomizer 
                          workspaceId={workspaceId}
                          appId="website"
                          fallbackConfig={workspaceTheme}
                          previewOnly={true}
                          initialConfig={customTheme}
                          onChange={(newTheme) => {
                            setCustomTheme(newTheme);
                          }}
                          trigger={
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon" 
                              className="size-9 rounded-xl border bg-muted/20 hover:bg-muted/30 hover:text-primary hover:border-primary shrink-0 transition-all shadow-sm"
                              title="Kustomisasi Tema Landing Page"
                            >
                              <Palette className="size-4" />
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pilih Template Landing Page</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1">
                      {templates.map((tpl) => {
                        const IconComp = tpl.icon;
                        const isSelected = selectedTemplate === tpl.id;
                        return (
                          <div
                            key={tpl.id}
                            onClick={() => {
                              setSelectedTemplate(tpl.id);
                            }}
                            className={cn(
                              "cursor-pointer relative overflow-hidden rounded-xl border p-3 flex flex-col justify-between h-[96px] transition-all hover:scale-[1.01] hover:shadow-sm",
                              isSelected 
                                ? "bg-card border-primary shadow-sm ring-1 ring-primary/30" 
                                : "bg-muted/10 border-muted/50 hover:bg-muted/20"
                            )}
                          >
                            {tpl.badge && (
                              <span className="absolute top-2 right-2 text-[8px] font-extrabold uppercase px-1 py-0.2 rounded-full bg-primary text-primary-foreground tracking-wider scale-90">
                                {tpl.badge}
                              </span>
                            )}
                            <div className="flex gap-2">
                              <div className={cn("size-6 rounded-md flex items-center justify-center shadow-inner", tpl.bgColor, tpl.color)}>
                                <IconComp className="size-3.5" />
                              </div>
                              <div className="flex-1 pr-4">
                                <h4 className="text-[11px] font-bold leading-none">{tpl.name}</h4>
                                <p className="text-[9px] text-muted-foreground mt-1 leading-normal line-clamp-2">{tpl.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-2 mt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isCreating}
                  className="rounded-xl h-9 text-xs"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleCreatePage} 
                  disabled={isCreating}
                  className="rounded-xl h-9 text-xs shadow-lg shadow-primary/20"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="size-3.5 mr-2 animate-spin" /> Sedang Membuat...
                    </>
                  ) : (
                    <>
                      <Plus className="size-3.5 mr-2" /> Buat Landing Page
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Panel: Sleek Live Visual Mockup Preview */}
            <div className="hidden md:flex md:w-1/2 flex-col h-full bg-foreground/[0.03] border-l border-border overflow-hidden relative">
              <div className="flex items-center justify-between px-4 py-3 bg-foreground/5 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-destructive/60 shadow-sm" />
                  <div className="size-2.5 rounded-full bg-yellow-500/60 shadow-sm" />
                  <div className="size-2.5 rounded-full bg-emerald-500/60 shadow-sm" />
                </div>
                <div className="flex-1 max-w-[260px] mx-4 h-6 rounded-md bg-background border border-border flex items-center px-3 text-[9px] text-muted-foreground font-mono select-none overflow-hidden truncate shadow-inner">
                  <Globe className="size-3 text-muted-foreground/50 mr-1.5 flex-shrink-0" />
                  <span>localhost:3000/id/{slug || "promo-page"}</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md shadow-sm">
                  LIVE PREVIEW
                </span>
              </div>

              {/* Live Puck Preview Canvas — flex-1 + overflow-hidden so LiveTemplatePreview can manage its own scroll */}
              <div className="flex-1 overflow-hidden bg-background text-foreground select-none" style={{ minHeight: 0 }}>
                <LiveTemplatePreview templateId={selectedTemplate} theme={customTheme} />
              </div>

            </div>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-none bg-primary/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Layers className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Halaman</p>
                <h3 className="text-2xl font-bold leading-none mt-1">{pages.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-blue-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Eye className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Kunjungan</p>
                <h3 className="text-2xl font-bold leading-none mt-1">{totalViews.toLocaleString()}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-emerald-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status Sistem</p>
                <h3 className="text-sm font-bold leading-none mt-1 text-emerald-600 uppercase tracking-tighter">Production Ready</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Table */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="published">Terbit</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[40%] font-bold pl-6">Informasi Halaman</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold text-center">Statistik</TableHead>
                      <TableHead className="font-bold text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-48 text-center text-muted-foreground italic">
                          Belum ada halaman dalam kategori ini.
                        </TableCell>
                      </TableRow>
                    ) : filteredPages.map((page) => (
                      <TableRow key={page.id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <FileText className="size-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{page.title}</span>
                                {page.isHome === 1 && (
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                                    <Home className="size-2.5 mr-1" /> Home
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                <span>/{page.slug}</span>
                                <span>•</span>
                                <span suppressHydrationWarning>Update: {new Date(page.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] font-bold uppercase px-2 py-0.5",
                              page.status === "published" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-orange-50 text-orange-700 border-orange-200"
                            )}
                          >
                            {page.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-xs font-bold">{(page.views || 0).toLocaleString()}</div>
                            <div className="text-[10px] text-muted-foreground">Kunjungan</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/dashboard/website/${page.id}`}>
                              <Button size="icon" variant="ghost" className="size-8 rounded-full">
                                <Edit2 className="size-3.5" />
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="size-8 rounded-full">
                                  <MoreHorizontal className="size-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl">
                                <DropdownMenuLabel>Opsi Halaman</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/website/${page.id}`} className="cursor-pointer">
                                    <Settings2 className="size-4 mr-2" /> Edit Konten
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer" 
                                  onClick={() => handleSetHome(page.id)} 
                                  disabled={page.isHome === 1}
                                >
                                  <CheckCircle2 className="size-4 mr-2" /> Jadikan Beranda
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center w-full">
                                    <ExternalLink className="size-4 mr-2" /> Lihat Laman
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer" 
                                  onClick={() => handleToggleStatus(page.id, page.status)}
                                >
                                  {page.status === "published" ? (
                                    <>
                                      <Send className="size-4 mr-2" /> Ubah ke Draft
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="size-4 mr-2" /> Terbitkan Halaman
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                  onClick={() => handleDelete(page.id)}
                                >
                                  <Trash2 className="size-4 mr-2" /> Hapus Laman
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}
