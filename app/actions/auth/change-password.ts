"use server";

import { redirect } from "next/navigation";
import { auth, getSession } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations/auth-schema";
import { headers } from "next/headers";

export async function changePasswordAction(formData: unknown) {
  const session = await getSession();
  if (!session?.user)
    return { success: false, error: "Anda harus login terlebih dahulu" };

  const parsed = changePasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Gagal mengubah password.",
    };
  }

  redirect("/dashboard");
}
