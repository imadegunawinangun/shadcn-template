"use client";

import React, { useState } from "react";
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
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Layers, 
  TrendingUp, 
  ExternalLink,
  Settings2,
  FileText,
  Eye,
  PenTool
} from "lucide-react";
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
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { deletePost } from "@workspace/database";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  updatedAt: Date;
  categories?: string[];
}

export function BlogClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState("all");

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  
  const filteredPosts = posts.filter(p => {
    if (activeTab === "all") return true;
    return p.status === activeTab;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      toast.error("Artikel berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus artikel");
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none bg-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <PenTool className="size-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Artikel</p>
              <h3 className="text-2xl font-bold leading-none mt-1">{posts.length}</h3>
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
              <h3 className="text-sm font-bold leading-none mt-1 text-emerald-600 uppercase tracking-tighter">CMS Active</h3>
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
                    <TableHead className="w-[40%] font-bold pl-6">Judul Artikel</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-center">Statistik</TableHead>
                    <TableHead className="font-bold text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center text-muted-foreground italic">
                        Belum ada artikel dalam kategori ini.
                      </TableCell>
                    </TableRow>
                  ) : filteredPosts.map((post) => (
                    <TableRow key={post.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FileText className="size-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{post.title}</span>
                              {post.categories && post.categories.length > 0 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {post.categories[0]}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                              <span>/{post.slug}</span>
                              <span>•</span>
                              <span suppressHydrationWarning>Update: {new Date(post.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5",
                            post.status === "published" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          )}
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-xs font-bold">{(post.views || 0).toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground">Kunjungan</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/blog/editor/${post.id}`}>
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
                              <DropdownMenuLabel>Opsi Artikel</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/blog/editor/${post.id}`} className="cursor-pointer">
                                  <Settings2 className="size-4 mr-2" /> Edit Konten
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <ExternalLink className="size-4 mr-2" /> Lihat Laman
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => handleDelete(post.id)}
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
  );
}
