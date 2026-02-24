"use server";

import { prisma } from "@/lib/db";

interface ValidateNIKResult {
  success: boolean;
  isValid: boolean;
  name?: string;
  error?: string;
}

export async function validateNIKAction(
  nik: string,
): Promise<ValidateNIKResult> {
  try {
    if (!nik || nik.length !== 16 || !/^\d{16}$/.test(nik)) {
      return {
        success: false,
        isValid: false,
        error: "NIK harus 16 digit angka",
      };
    }

    const nikRecord = await prisma.nIKRecord.findUnique({
      where: { nik },
      select: { nik: true, name: true, isActive: true },
    });

    if (!nikRecord) {
      return {
        success: true,
        isValid: false,
        error: "NIK tidak ditemukan dalam database",
      };
    }

    if (!nikRecord.isActive) {
      return { success: true, isValid: false, error: "NIK tidak aktif" };
    }

    return { success: true, isValid: true, name: nikRecord.name };
  } catch (error) {
    console.error("Error validating NIK:", error);
    return {
      success: false,
      isValid: false,
      error: "Terjadi kesalahan saat memvalidasi NIK",
    };
  }
}
