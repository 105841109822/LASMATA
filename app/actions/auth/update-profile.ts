"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
});

export async function updateProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  let validatedData: z.infer<typeof updateProfileSchema>;
  try {
    validatedData = updateProfileSchema.parse({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    });
  } catch (error) {
    if (error instanceof z.ZodError) return { error: error.issues[0].message };
    return { error: "Data tidak valid" };
  }

  try {
    if (validatedData.email !== session.user.email) {
      const existing = await prisma.user.findFirst({
        where: { email: validatedData.email, NOT: { id: session.user.id } },
        select: { id: true },
      });
      if (existing)
        return { error: "Email sudah digunakan oleh pengguna lain" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validatedData.name, email: validatedData.email },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Profil berhasil diperbarui" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Terjadi kesalahan saat memperbarui profil" };
  }
}
