import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LASMATA - Layanan Aspirasi Desa Tembalae",
    template: "%s | LASMATA",
  },
  description:
    "Platform transparansi publik untuk menyampaikan aspirasi, keluhan, dan saran pembangunan Desa Tembalae yang lebih baik.",
  keywords: ["LASMATA", "Desa Tembalae", "Aspirasi Desa", "Transparansi Publik"],
  authors: [{ name: "Desa Tembalae" }],
  openGraph: {
    title: "LASMATA - Layanan Aspirasi Desa Tembalae",
    description:
      "Platform transparansi publik untuk pembangunan desa yang lebih baik",
    type: "website",
    locale: "id_ID",
  },
};

// Viewport dipisah dari metadata untuk mendukung streaming
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
