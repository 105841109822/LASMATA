import { Suspense } from "react";
import { ChangePasswordContent } from "@/components/change-password-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubah Kata Sandi",
};

export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ChangePasswordContent />
    </Suspense>
  );
}
