"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma";

export interface GetNIKRecordsResult {
  nikRecords: Array<{
    nik: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count: { reports: number };
  }>;
  total: number;
  totalActive: number;
  hasMore: boolean;
}

interface GetNIKRecordsParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
}

export async function getNIKRecordsAction(
  params: GetNIKRecordsParams = {},
): Promise<GetNIKRecordsResult> {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { page = 1, limit = 50, searchQuery = "" } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.NIKRecordWhereInput = searchQuery
    ? {
        OR: [
          { nik: { contains: searchQuery } },
          { name: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  const [nikRecords, total, totalActive] = await Promise.all([
    prisma.nIKRecord.findMany({
      where,
      include: { _count: { select: { reports: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.nIKRecord.count(),
    prisma.nIKRecord.count({ where: { isActive: true } }),
  ]);

  const actualTotal = searchQuery ? nikRecords.length + skip : total;

  return {
    nikRecords: nikRecords.map((r) => ({
      nik: r.nik,
      name: r.name,
      isActive: r.isActive,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      _count: { reports: r._count.reports },
    })),
    total,
    totalActive,
    hasMore: page * limit < actualTotal,
  };
}
