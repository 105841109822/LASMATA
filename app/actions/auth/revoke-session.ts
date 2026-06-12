"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function revokeSessionAction(sessionId: string) {
  try {
    const session = await getSession();
    if (!session)
      return {
        success: false,
        error: "Sesi Anda tidak valid atau telah dihapus",
      };

    const target = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!target || target.userId !== session.user.id) {
      return { success: false, error: "Tidak dapat mencabut sesi ini" };
    }

    if (sessionId === session.session.id) {
      return {
        success: false,
        error: "Tidak dapat mencabut sesi aktif saat ini",
      };
    }

    // Delete session - device with this session will fail validation on next request
    await prisma.session.delete({ where: { id: sessionId } });

    revalidatePath("/dashboard/sessions");

    return {
      success: true,
      message:
        "Sesi berhasil dicabut. Perangkat akan otomatis logout pada request berikutnya.",
      sessionId,
    };
  } catch (error) {
    console.error("Revoke session error:", error);
    return { success: false, error: "Gagal mencabut sesi" };
  }
}

export async function revokeAllOtherSessionsAction() {
  try {
    const session = await getSession();
    if (!session)
      return {
        success: false,
        error: "Sesi Anda tidak valid atau telah dihapus",
      };

    // Hapus semua sesi lain milik user ini kecuali sesi saat ini
    const result = await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        id: { not: session.session.id },
      },
    });

    revalidatePath("/dashboard/sessions");

    return {
      success: true,
      message: `${result.count} sesi lain berhasil dicabut. Semua perangkat akan otomatis logout pada request berikutnya.`,
      count: result.count,
    };
  } catch (error) {
    console.error("Revoke all sessions error:", error);
    return { success: false, error: "Gagal mencabut sesi" };
  }
}
