import { prisma } from "@/lib/prisma";

export const USAGE_LIMIT = 2;

export async function checkUsageLimit(userId?: string, ip?: string) {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const resetTime = tomorrow.getTime() - now.getTime();

  if (userId) {
    // Check if user has an active subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (subscription && subscription.status === 1 && subscription.expiresAt && subscription.expiresAt > new Date()) {
      return { allowed: true, remaining: Infinity, isSubscribed: true, resetTime: 0 };
    }

    // Check user daily limits
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { dailyConversions: true, lastConversionDate: true },
      });

      if (!user) return { allowed: false, remaining: 0, isSubscribed: false, resetTime };

      const lastDate = new Date(user.lastConversionDate);
      lastDate.setHours(0, 0, 0, 0);

      const count = lastDate.getTime() === today.getTime() ? user.dailyConversions : 0;

      if (count >= USAGE_LIMIT) {
        return { allowed: false, remaining: 0, isSubscribed: false, resetTime };
      }

      return { allowed: true, remaining: USAGE_LIMIT - count, isSubscribed: false, resetTime };
    } catch (e) {
      console.warn("User usage tracking error:", e);
      return { allowed: true, remaining: 1, isSubscribed: false, resetTime };
    }
  } else if (ip) {
    // Guest usage
    const guestUsage = await prisma.guestUsage.findUnique({
      where: { ip },
    });

    if (!guestUsage) {
      return { allowed: true, remaining: USAGE_LIMIT, isSubscribed: false, resetTime };
    }

    const lastDate = new Date(guestUsage.lastConversionDate);
    lastDate.setHours(0, 0, 0, 0);

    const count = lastDate.getTime() === today.getTime() ? guestUsage.count : 0;

    if (count >= USAGE_LIMIT) {
      return { allowed: false, remaining: 0, isSubscribed: false, resetTime };
    }

    return { allowed: true, remaining: USAGE_LIMIT - count, isSubscribed: false, resetTime };
  }

  return { allowed: false, remaining: 0, isSubscribed: false, resetTime };
}

export async function incrementUsage(userId?: string, ip?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (userId) {
    const id = parseInt(userId);
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { dailyConversions: true, lastConversionDate: true },
      });

      if (!user) return;

      const lastDate = new Date(user.lastConversionDate);
      lastDate.setHours(0, 0, 0, 0);

      const newCount = lastDate.getTime() === today.getTime() ? user.dailyConversions + 1 : 1;

      await prisma.user.update({
        where: { id },
        data: {
          dailyConversions: newCount,
          lastConversionDate: new Date(),
        },
      });
    } catch (e) {
      console.warn("Failed to increment user usage:", e);
    }
  } else if (ip) {
    const guestUsage = await prisma.guestUsage.findUnique({
      where: { ip },
    });

    if (!guestUsage) {
      await prisma.guestUsage.create({
        data: {
          ip,
          count: 1,
          lastConversionDate: new Date(),
        },
      });
    } else {
      const lastDate = new Date(guestUsage.lastConversionDate);
      lastDate.setHours(0, 0, 0, 0);

      const newCount = lastDate.getTime() === today.getTime() ? guestUsage.count + 1 : 1;

      await prisma.guestUsage.update({
        where: { ip },
        data: {
          count: newCount,
          lastConversionDate: new Date(),
        },
      });
    }
  }
}
