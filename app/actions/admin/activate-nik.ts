"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function activateNIKAction(nik: string) {
  try {
    const session = await getSession();
    if (!session?.user) redirect("/login");

    const activated = await prisma.nIKRecord.update({
      where: { nik },
      data: { isActive: true },
    });

    revalidatePath("/dashboard/nik");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "NIK berhasil diaktifkan",
      nikRecord: activated,
    };
  } catch (error) {
    console.error("Activate NIK error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengaktifkan NIK",
    };
  }
}
