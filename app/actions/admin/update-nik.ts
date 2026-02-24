"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nikSchema } from "@/lib/validations/nik-schema";
import { z } from "zod";

export async function updateNIKAction(nik: string, name: string) {
  try {
    const session = await getSession();
    if (!session?.user) redirect("/login");

    const validatedData = nikSchema.parse({ nik, name });

    const updated = await prisma.nIKRecord.update({
      where: { nik: validatedData.nik },
      data: { name: validatedData.name },
    });

    revalidatePath("/dashboard/nik");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "NIK berhasil diperbarui",
      nikRecord: updated,
    };
  } catch (error) {
    if (error instanceof z.ZodError)
      return { success: false, error: error.issues[0].message };
    console.error("Update NIK error:", error);
    return { success: false, error: "Terjadi kesalahan saat memperbarui NIK" };
  }
}
