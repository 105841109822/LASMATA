"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type SessionItem = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  isCurrent: boolean;
};

export async function getSessionsAction(): Promise<{
  success: boolean;
  sessions: SessionItem[];
  error?: string;
}> {
  try {
    const session = await getSession();
    if (!session)
      return { success: false, error: "Tidak ada sesi aktif", sessions: [] };

    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        token: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      sessions: sessions.map((s) => ({
        id: s.id,
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        expiresAt: s.expiresAt.toISOString(),
        isCurrent: s.id === session.session.id,
      })),
    };
  } catch (error) {
    console.error("Get sessions error:", error);
    return { success: false, error: "Gagal mengambil data sesi", sessions: [] };
  }
}
