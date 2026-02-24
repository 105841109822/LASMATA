"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateStatusSchema } from "@/lib/validations/admin-schema";
import { z } from "zod";

type ReportStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";

export async function updateReportStatusAction(
  reportId: string,
  status: ReportStatus,
) {
  try {
    const session = await getSession();
    if (!session?.user) redirect("/login");

    const validatedData = updateStatusSchema.parse({
      reportId: reportId.trim(),
      status,
    });

    const updated = await prisma.report.update({
      where: { id: validatedData.reportId },
      data: { status: validatedData.status },
      include: { nikRecord: { select: { name: true } } },
    });

    revalidatePath("/dashboard/reports");
    revalidatePath("/dashboard");
    revalidatePath("/aspirasi");

    return {
      success: true,
      message: "Status laporan berhasil diperbarui",
      report: updated,
    };
  } catch (error) {
    if (error instanceof z.ZodError)
      return { success: false, error: error.issues[0].message };
    console.error("Update report status error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat memperbarui status laporan",
    };
  }
}
