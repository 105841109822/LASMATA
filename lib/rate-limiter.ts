import { prisma } from "@/lib/db";

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_HOURS = 5;

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
  message?: string;
}

export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const realIP = headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP.trim();
  return "unknown";
}

export async function checkRateLimit(
  ipAddress: string,
): Promise<RateLimitResult> {
  try {
    const now = new Date();
    const record = await prisma.rateLimitRecord.findUnique({
      where: { ip: ipAddress },
    });

    if (!record) return { allowed: true, remainingAttempts: MAX_ATTEMPTS };

    if (record.blockedUntil && record.blockedUntil > now) {
      const hoursLeft = Math.ceil(
        (record.blockedUntil.getTime() - now.getTime()) / (1000 * 60 * 60),
      );
      return {
        allowed: false,
        blockedUntil: record.blockedUntil,
        message: `Terlalu banyak percobaan gagal. Coba lagi dalam ${hoursLeft} jam.`,
      };
    }

    if (record.blockedUntil && record.blockedUntil <= now) {
      await prisma.rateLimitRecord.update({
        where: { ip: ipAddress },
        data: { attempts: 0, blockedUntil: null, lastAttempt: now },
      });
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      const blockUntil = new Date(
        now.getTime() + BLOCK_DURATION_HOURS * 60 * 60 * 1000,
      );
      await prisma.rateLimitRecord.update({
        where: { ip: ipAddress },
        data: { blockedUntil: blockUntil, lastAttempt: now },
      });
      return {
        allowed: false,
        blockedUntil: blockUntil,
        message: `Terlalu banyak percobaan gagal. Coba lagi dalam ${BLOCK_DURATION_HOURS} jam.`,
      };
    }

    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.attempts };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }
}

export async function recordFailedAttempt(ipAddress: string): Promise<void> {
  try {
    await prisma.rateLimitRecord.upsert({
      where: { ip: ipAddress },
      update: { attempts: { increment: 1 }, lastAttempt: new Date() },
      create: { ip: ipAddress, attempts: 1, lastAttempt: new Date() },
    });
  } catch (error) {
    console.error("Error recording failed attempt:", error);
  }
}

export async function resetRateLimit(ipAddress: string): Promise<void> {
  try {
    await prisma.rateLimitRecord.updateMany({
      where: { ip: ipAddress },
      data: { attempts: 0, blockedUntil: null, lastAttempt: new Date() },
    });
  } catch {
    /* ignore */
  }
}
