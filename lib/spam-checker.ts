import { prisma } from "@/lib/db";

const MAX_REPORTS_PER_WEEK = 3;
const DAYS_IN_WEEK = 7;

interface SpamCheckResult {
  allowed: boolean;
  reportCount?: number;
  message?: string;
  nextAllowedDate?: Date;
}

export async function checkSpamLimit(nik: string): Promise<SpamCheckResult> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - DAYS_IN_WEEK);

    const reportCount = await prisma.report.count({
      where: { nik, createdAt: { gte: sevenDaysAgo } },
    });

    if (reportCount >= MAX_REPORTS_PER_WEEK) {
      const oldestReport = await prisma.report.findFirst({
        where: { nik, createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });

      const nextAllowedDate = oldestReport
        ? new Date(
            oldestReport.createdAt.getTime() +
              DAYS_IN_WEEK * 24 * 60 * 60 * 1000,
          )
        : new Date();

      return {
        allowed: false,
        reportCount,
        nextAllowedDate,
        message: `Anda telah mencapai batas maksimal ${MAX_REPORTS_PER_WEEK} laporan dalam 7 hari. Silakan coba lagi setelah ${nextAllowedDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}.`,
      };
    }

    return { allowed: true, reportCount };
  } catch (error) {
    console.error("Error checking spam limit:", error);
    return { allowed: true, reportCount: 0 };
  }
}

export async function getSpamStats(nik: string) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - DAYS_IN_WEEK);

    const { data: reportsInLastWeek, error } = await db
      .from("Report")
      .select("id, title, createdAt")
      .eq("nik", nik)
      .gte("createdAt", sevenDaysAgo.toISOString())
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error getting spam stats:", error);
      return {
        count: 0,
        remaining: MAX_REPORTS_PER_WEEK,
        reports: [],
      };
    }

    return {
      count: reportsInLastWeek?.length || 0,
      remaining: Math.max(
        0,
        MAX_REPORTS_PER_WEEK - (reportsInLastWeek?.length || 0),
      ),
      reports: reportsInLastWeek || [],
    };
  } catch (error) {
    console.error("Error getting spam stats:", error);
    return {
      count: 0,
      remaining: MAX_REPORTS_PER_WEEK,
      reports: [],
    };
  }
}
