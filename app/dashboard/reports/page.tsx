import type { Metadata } from "next";
import { ReportsManagementContent } from "./_components/reports-client";

export const metadata: Metadata = {
  title: "Kelola Laporan",
};

export default function ReportsManagementPage() {
  return <ReportsManagementContent />;
}
