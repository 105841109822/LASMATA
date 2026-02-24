"use server";

import { auth } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth-schema";

export async function loginAction(formData: unknown) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Email atau password tidak valid" };
  }

  const { email, password } = parsed.data;

  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
    });

    if (response && response.user) {
      return { success: true, user: response.user };
    } else {
      return { success: false, error: "Email atau password tidak valid" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Email atau password tidak valid" };
  }
}
