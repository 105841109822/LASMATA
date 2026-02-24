"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-2xl font-bold">Terjadi Kesalahan</h2>
      <p className="text-muted-foreground max-w-md">
        Gagal memuat halaman dashboard. Silakan coba lagi.
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
}
