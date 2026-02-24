"use server";

import { prisma } from "@/lib/db";
import { reportSubmissionSchema } from "@/lib/validations/report-schema";
import { checkSpamLimit } from "@/lib/spam-checker";
import { headers } from "next/headers";
import {
  checkRateLimit,
  getClientIP,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limiter";
import { revalidatePath } from "next/cache";

interface SubmitReportResult {
  success: boolean;
  reportId?: string;
  message?: string;
  error?: string;
  rateLimitMessage?: string;
}

export async function submitReportAction(data: {
  nik: string;
  category: string;
  location: string;
  title: string;
  description: string;
}): Promise<SubmitReportResult> {
  try {
    const headersList = await headers();
    const clientIP = getClientIP(headersList);

    const rateLimitCheck = await checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: "Terlalu banyak percobaan",
        rateLimitMessage: rateLimitCheck.message,
      };
    }

    const validation = reportSubmissionSchema.safeParse(data);
    if (!validation.success) {
      const errors = validation.error.issues.map((e) => e.message).join(", ");
      await recordFailedAttempt(clientIP);
      return { success: false, error: errors };
    }

    const validatedData = validation.data;

    const nikRecord = await prisma.nIKRecord.findUnique({
      where: { nik: validatedData.nik },
      select: { isActive: true },
    });

    if (!nikRecord) {
      await recordFailedAttempt(clientIP);
      return { success: false, error: "NIK tidak ditemukan dalam database" };
    }

    if (!nikRecord.isActive) {
      await recordFailedAttempt(clientIP);
      return {
        success: false,
        error: "NIK tidak aktif. Silakan hubungi administrator.",
      };
    }

    await resetRateLimit(clientIP);

    const spamCheck = await checkSpamLimit(validatedData.nik);
    if (!spamCheck.allowed) {
      return { success: false, error: spamCheck.message };
    }

    const report = await prisma.report.create({
      data: {
        nik: validatedData.nik,
        title: validatedData.title,
        category: validatedData.category,
        location: validatedData.location as import("@prisma/client").Location,
        description: validatedData.description,
        status: "DRAFT",
      },
      select: { id: true },
    });

    revalidatePath("/dashboard/reports");
    revalidatePath("/dashboard");
    revalidatePath("/aspirasi");

    return {
      success: true,
      reportId: report.id,
      message:
        "Laporan berhasil dikirim! Tim kami akan segera menindaklanjuti aspirasi Anda.",
    };
  } catch (error) {
    console.error("Error submitting report:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.",
    };
  }
}
