"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UsageResult {
  allowed: boolean;
  remaining: number;
  isSubscribed: boolean;
  resetTime: number;
}

export function useUsageLimit() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageInfo, setUsageInfo] = useState<UsageResult | null>(null);

  const checkLimit = useCallback(async () => {
    // 1. Client-side check (fast path)
    if (typeof window !== "undefined") {
      const cookieVal = document.cookie
        .split("; ")
        .find(row => row.startsWith("pdf_limit_hit="));
      
      if (cookieVal) {
        // We know we hit it already today (could be old though, but backend will confirm)
        // If we want to be strict, we'd store the expiration date in cookie too
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/usage/check");
      if (!res.ok) throw new Error("Failed to check usage");
      
      const data: UsageResult = await res.json();
      setUsageInfo(data);

      if (!data.allowed && !data.isSubscribed) {
        setShowLimitModal(true);
        // Set cookie to remember for today (optional but follows user request)
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);
        document.cookie = `pdf_limit_hit=1; expires=${tomorrow.toUTCString()}; path=/`;
        return false;
      }
      return true;
    } catch (error) {
      console.error("Usage limit check error:", error);
      return true; // Fail open
    } finally {
      setLoading(false);
    }
  }, []);

  const incrementUsage = useCallback(async () => {
    try {
      await fetch("/api/usage/increment", { method: "POST" });
    } catch (e) {
      console.error("Failed to increment usage:", e);
    }
  }, []);

  return {
    checkLimit,
    incrementUsage,
    showLimitModal,
    setShowLimitModal,
    usageInfo,
    loading,
    isLoggedIn: !!session?.user
  };
}
