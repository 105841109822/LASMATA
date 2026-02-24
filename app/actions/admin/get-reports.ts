"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma";

type ReportStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";

export interface GetReportsParams {
  search?: string;
  status?: ReportStatus | "ALL";
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  pageSize?: number;
}

export interface GetReportsResult {
  reports: Array<{
    id: string;
    nik: string;
    title: string;
    category: string;
    location: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    nikRecord: { name: string } | null;
  }>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export async function getReportsAction(
  params: GetReportsParams = {},
): Promise<GetReportsResult> {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const {
    search = "",
    status = "ALL",
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 10,
  } = params;
  const skip = (page - 1) * pageSize;

  const where: Prisma.ReportWhereInput = {};

  if (status !== "ALL") where.status = status;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = dateFrom;
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }
  if (search.trim()) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { nik: { contains: search } },
    ];
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: { nikRecord: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports: reports.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
