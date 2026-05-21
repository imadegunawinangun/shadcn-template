"use client";

import React, { useState } from "react";
import { 
  DashboardShell, 
  DashboardHeader 
} from "@workspace/dashboard";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { 
  Save,
  CheckCircle2,
  ChevronLeft,
  Settings2,
  Globe,
  Lock,
  Tags,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { updatePost } from "@workspace/database";
import { RichTextEditor } from "./rich-text-editor";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";

interface PostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  status: string;
  metaTitle: string;
  metaDescription: string;
}

export function EditorClient({ postData }: { postData: PostData }) {
  const [formData, setFormData] = useState<PostData>({
    ...postData,
    content: postData.content || "",
    excerpt: postData.excerpt || "",
    featuredImage: postData.featuredImage || "",
    categories: postData.categories || [],
    tags: postData.tags || [],
    metaTitle: postData.metaTitle || "",
    metaDescription: postData.metaDescription || "",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [catInput, setCatInput] = useState("");

  const handleSave = async (autoSave = false) => {
    if (!autoSave) setIsSaving(true);
    try {
      await updatePost(postData.id, formData);
      if (!autoSave) toast.success("Artikel berhasil disimpan!");
    } catch (error) {
      if (!autoSave) toast.error("Gagal menyimpan artikel");
    } finally {
      if (!autoSave) setIsSaving(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const handleAddCat = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && catInput.trim()) {
      e.preventDefault();
      if (!formData.categories.includes(catInput.trim())) {
        setFormData(prev => ({ ...prev, categories: [...prev.categories, catInput.trim()] }));
      }
      setCatInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const removeCat = (cat: string) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/blog">
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronLeft className="size-4" />
              </Button>
            </Link>
            <div className="text-sm font-semibold truncate max-w-[200px] md:max-w-[400px]">
              {formData.title || "Untitled Article"}
            </div>
            <Badge variant={formData.status === 'published' ? 'default' : 'secondary'} className="hidden sm:flex">
              {formData.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={isSaving}>
              <Save className="size-4 mr-2" />
              Simpan Draft
            </Button>
            <Button size="sm" onClick={() => {
              setFormData(prev => ({ ...prev, status: 'published' }));
              handleSave(false);
            }} disabled={isSaving || formData.status === 'published'}>
              <Globe className="size-4 mr-2" />
              {formData.status === 'published' ? "Telah Terbit" : "Terbitkan"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-2xl flex-1 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Editor Column (75%) */}
          <div className="flex-1 space-y-6 max-w-4xl">
            {/* Title Input */}
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Tambahkan Judul..."
              className="w-full text-4xl lg:text-5xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/50 py-4"
            />
            
            {/* WYSIWYG Editor */}
            <div className="min-h-[500px]">
              <RichTextEditor 
                content={formData.content} 
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} 
              />
            </div>
          </div>

          {/* Sidebar Settings (25%) */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            
            {/* Status & Visibility Card */}
            <Card className="shadow-sm">
              <CardHeader className="py-4 border-b bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <Settings2 className="size-4 mr-2 text-primary" />
                  Pengaturan Halaman
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-sm">
                <div className="space-y-2">
                  <Label>Status Publikasi</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Terbit (Published)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="shadow-sm">
              <CardHeader className="py-4 border-b bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <ImageIcon className="size-4 mr-2 text-primary" />
                  Gambar Unggulan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {formData.featuredImage ? (
                  <div className="space-y-3">
                    <img src={formData.featuredImage} alt="Featured" className="w-full h-32 object-cover rounded-md border" />
                    <Button variant="outline" size="sm" className="w-full text-xs text-destructive" onClick={() => setFormData(prev => ({ ...prev, featuredImage: "" }))}>
                      Hapus Gambar
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full border-dashed h-24 text-muted-foreground" onClick={() => {
                     const url = window.prompt("URL Gambar:");
                     if (url) setFormData(prev => ({ ...prev, featuredImage: url }));
                  }}>
                    + Setel Gambar
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Categories & Tags */}
            <Card className="shadow-sm">
              <CardHeader className="py-4 border-b bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <Tags className="size-4 mr-2 text-primary" />
                  Kategori & Tag
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div className="space-y-2 text-sm">
                  <Label>Kategori</Label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.categories.map(cat => (
                      <Badge key={cat} variant="secondary" className="px-2 py-0.5 text-xs font-normal">
                        {cat}
                        <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeCat(cat)}>×</button>
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    placeholder="Tambah kategori lalu tekan Enter..." 
                    value={catInput}
                    onChange={(e) => setCatInput(e.target.value)}
                    onKeyDown={handleAddCat}
                    className="h-8 text-xs"
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <Label>Tag</Label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="px-2 py-0.5 text-xs font-normal bg-muted/50">
                        {tag}
                        <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeTag(tag)}>×</button>
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    placeholder="Tambah tag lalu tekan Enter..." 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="h-8 text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Excerpt & SEO */}
            <Card className="shadow-sm">
              <CardHeader className="py-4 border-b bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <Globe className="size-4 mr-2 text-primary" />
                  Kutipan & SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-sm">
                <div className="space-y-2">
                  <Label>Kutipan (Excerpt)</Label>
                  <Textarea 
                    rows={3} 
                    placeholder="Tulis ringkasan singkat artikel ini..." 
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="resize-none text-xs"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <Label>SEO Meta Title</Label>
                  <Input 
                    placeholder="Judul untuk mesin pencari" 
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label>SEO Meta Description</Label>
                  <Textarea 
                    rows={2} 
                    placeholder="Deskripsi untuk mesin pencari" 
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="resize-none text-xs"
                  />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
