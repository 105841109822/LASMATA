"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nikSchema } from "@/lib/validations/nik-schema";
import { z } from "zod";

export async function addNIKAction(nik: string, name: string) {
  try {
    const session = await getSession();
    if (!session?.user) redirect("/login");

    const validatedData = nikSchema.parse({ nik, name });

    const existing = await prisma.nIKRecord.findUnique({
      where: { nik: validatedData.nik },
      select: { nik: true },
    });
    if (existing)
      return { success: false, error: "NIK sudah terdaftar dalam sistem" };

    const newNIK = await prisma.nIKRecord.create({
      data: {
        nik: validatedData.nik,
        name: validatedData.name,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/nik");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "NIK berhasil ditambahkan",
      nikRecord: newNIK,
    };
  } catch (error) {
    if (error instanceof z.ZodError)
      return { success: false, error: error.issues[0].message };
    console.error("Add NIK error:", error);
    return { success: false, error: "Terjadi kesalahan saat menambahkan NIK" };
  }
}
