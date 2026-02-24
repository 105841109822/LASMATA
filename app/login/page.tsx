import React from "react";
import LoginForm from "@/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 lg:px-8">
      {/* Emerald Mist Background - Base */}
      <div className="absolute inset-0 bg-background -z-10" />

      {/* Light Mode Mist */}
      <div
        className="absolute inset-0 -z-10 opacity-100 dark:opacity-0 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(5, 150, 105, 0.10) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(6, 78, 59, 0.06) 0%, transparent 80%)
          `,
        }}
      />

      {/* Dark Mode Mist */}
      <div
        className="absolute inset-0 -z-10 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.25) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(5, 150, 105, 0.18) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(6, 78, 59, 0.12) 0%, transparent 80%)
          `,
        }}
      />

      <section className="w-full max-w-3xl relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">LASMATA PORTAL</h1>
          <p className="text-muted-foreground mt-2">
            Layanan Aspirasi Masyarakat Desa Tembalae
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
