import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, multiSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { prisma } from "./db";

export const auth = betterAuth({
  appName: "Layanan Aspirasi Desa Kita",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignUp: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async () => {
      throw new Error("Password reset not configured");
    },
  },
  session: {
    storeSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    },
    expiresIn: 60 * 60 * 24 * 30, // 30 hari
    updateAge: 60 * 60 * 24, // refresh tiap hari
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "bad",
  },
  plugins: [
    multiSession({ maximumSessions: 5 }),
    admin({ defaultRole: "user" }),
    nextCookies(), 
  ],
});

// Helper: ambil sesi aktif di server (Next.js)
export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}
