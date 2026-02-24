"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deactivateNIKAction(nik: string) {
  try {
    const session = await getSession();
    if (!session?.user) redirect("/login");

    const deactivated = await prisma.nIKRecord.update({
      where: { nik },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/nik");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "NIK berhasil dinonaktifkan",
      nikRecord: deactivated,
    };
  } catch (error) {
    console.error("Deactivate NIK error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menonaktifkan NIK",
    };
  }
}
