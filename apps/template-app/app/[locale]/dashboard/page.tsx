import React from "react";
import { 
  DashboardShell, 
  DashboardHeader, 
  DashboardStats, 
  Overview, 
  RecentSales 
} from "@workspace/dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard Overview"
        text="Selamat datang kembali! Berikut ringkasan aktivitas aplikasi Anda."
      />
      
      <div className="space-y-8">
        {/* Quick Stats */}
        <DashboardStats />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Statistik Pengunjung</CardTitle>
              <CardDescription>
                Visualisasi trafik harian dari landing page Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Daftar transaksi atau interaksi terbaru.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>

        {/* Additional Sections inspired by web-slo */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg px-6">Konten Utama</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg px-6">Analitik Detail</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-lg px-6">Laporan</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6 border-none bg-primary/5">
                   <h3 className="font-bold text-lg mb-2">Manajemen Konten</h3>
                   <p className="text-sm text-muted-foreground mb-4">Edit teks, gambar, dan urutan section pada landing page Anda.</p>
                   <button className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg">Buka Editor</button>
                </Card>
                <Card className="p-6 border-none bg-accent/5">
                   <h3 className="font-bold text-lg mb-2">Konfigurasi SEO</h3>
                   <p className="text-sm text-muted-foreground mb-4">Optimalkan pencarian di Google dengan meta tags yang tepat.</p>
                   <button className="bg-accent text-accent-foreground text-xs font-bold px-4 py-2 rounded-lg">Atur Meta Tags</button>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
