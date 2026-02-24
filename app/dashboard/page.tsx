import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle2, Settings } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  unstable_noStore();
  await headers();

  const [totalReports, inProgress, completed] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: "IN_PROGRESS" } }),
    prisma.report.count({ where: { status: "COMPLETED" } }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Dashboard Administrator</h1>
        <p className="text-muted-foreground">
          Kelola laporan aspirasi dan data NIK masyarakat
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{totalReports}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Total Laporan</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{inProgress}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Diproses</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{completed}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Diselesaikan</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/reports">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Kelola Laporan</CardTitle>
                  <CardDescription>Lihat, filter, dan ubah status laporan aspirasi</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Akses halaman manajemen laporan untuk mengubah status, mencari, dan memfilter laporan berdasarkan status atau tanggal.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/nik">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Kelola NIK</CardTitle>
                  <CardDescription>Tambah, edit, dan kelola data NIK warga</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Kelola database NIK untuk validasi pengajuan aspirasi. Tambah NIK baru atau nonaktifkan NIK yang tidak valid.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
