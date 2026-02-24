import type { Metadata } from "next";
import { AspirasiContent } from "./_components/aspirasi-client";

export const metadata: Metadata = {
  title: "Daftar Aspirasi",
};

export default function AspirasiPage() {
  return <AspirasiContent />;
}
