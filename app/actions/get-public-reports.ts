"use server";

import { prisma } from "@/lib/db";

export interface PublicReport {
  id: string;
  createdAt: string;
  category: string;
  location: string;
  title: string;
  description: string;
  status: string;
}

export interface GetPublicReportsResult {
  reports: PublicReport[];
  total: number;
  pagination: { page: number; pageSize: number; totalPages: number };
}

export async function getPublicReportsAction(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<GetPublicReportsResult> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 1000;
  const skip = (page - 1) * pageSize;

  const where =
    params?.status && params.status !== "all"
      ? { status: params.status as "DRAFT" | "IN_PROGRESS" | "COMPLETED" }
      : undefined;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      select: {
        id: true,
        createdAt: true,
        category: true,
        location: true,
        title: true,
        description: true,
        status: true,
      },
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
    })),
    total,
    pagination: { page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}
