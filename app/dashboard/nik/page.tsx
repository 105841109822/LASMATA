import type { Metadata } from "next";
import { NIKManagementContent } from "./_components/nik-client";

export const metadata: Metadata = {
  title: "Kelola NIK",
};

export default function NIKManagementPage() {
  return <NIKManagementContent />;
}
