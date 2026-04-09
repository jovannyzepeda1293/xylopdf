import { prisma } from "@/lib/prisma";

export const DEFAULT_LIMIT = 2;

interface UsageResult {
  allowed: boolean;
  remaining: number;
  isSubscribed: boolean;
  isExpired: boolean;
  resetTime: number;
}

export async function checkUsageLimit(userId?: string, ip?: string, needed: number = 1, maxLimit: number = DEFAULT_LIMIT): Promise<UsageResult> {
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

    const isSubscribed = subscription && 
      subscription.status === 1 && 
      subscription.expiresAt && 
      subscription.expiresAt > now;

    const isExpired = !!(subscription && 
      (subscription.status === 0 || (subscription.expiresAt && subscription.expiresAt <= now)));

    if (isSubscribed) {
      return { allowed: true, remaining: Infinity, isSubscribed: true, isExpired: false, resetTime: 0 };
    }

    // Check user daily limits
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { dailyConversions: true, lastConversionDate: true },
      });

      if (!user) return { allowed: false, remaining: 0, isSubscribed: false, isExpired: false, resetTime };

      const lastDate = new Date(user.lastConversionDate);
      lastDate.setHours(0, 0, 0, 0);

      const count = lastDate.getTime() === today.getTime() ? user.dailyConversions : 0;

      if (count + (needed - 1) >= maxLimit) {
        return { allowed: false, remaining: 0, isSubscribed: false, isExpired, resetTime };
      }

      return { allowed: true, remaining: maxLimit - count, isSubscribed: false, isExpired, resetTime };
    } catch (e) {
      console.warn("User usage tracking error:", e);
      return { allowed: true, remaining: 1, isSubscribed: false, isExpired, resetTime };
    }
  } else if (ip) {
    // Guest usage
    const guestUsage = await prisma.guestUsage.findUnique({
      where: { ip },
    });

    if (!guestUsage) {
      if (needed > maxLimit) {
        return { allowed: false, remaining: 0, isSubscribed: false, isExpired: false, resetTime };
      }
      return { allowed: true, remaining: maxLimit, isSubscribed: false, isExpired: false, resetTime };
    }

    const lastDate = new Date(guestUsage.lastConversionDate);
    lastDate.setHours(0, 0, 0, 0);

    const count = lastDate.getTime() === today.getTime() ? guestUsage.count : 0;

    if (count + (needed - 1) >= maxLimit) {
      return { allowed: false, remaining: 0, isSubscribed: false, isExpired: false, resetTime };
    }

    return { allowed: true, remaining: maxLimit - count, isSubscribed: false, isExpired: false, resetTime };
  }

  return { allowed: false, remaining: 0, isSubscribed: false, isExpired: false, resetTime };
}

export async function incrementUsage(userId?: string, ip?: string, amount: number = 1) {
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

      const newCount = lastDate.getTime() === today.getTime() ? user.dailyConversions + amount : amount;

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
          count: amount,
          lastConversionDate: new Date(),
        },
      });
    } else {
      const lastDate = new Date(guestUsage.lastConversionDate);
      lastDate.setHours(0, 0, 0, 0);

      const newCount = lastDate.getTime() === today.getTime() ? guestUsage.count + amount : amount;

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
