"use client";

import { useState, useCallback } from "react";
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
    setLoading(true);
    try {
      // Si ya sabemos por la sesión que es premium, permitimos directo
      if (session?.user?.subscriptionActive) {
        const info = { allowed: true, remaining: Infinity, isSubscribed: true, resetTime: 0 };
        setUsageInfo(info);
        return true;
      }

      // Consultar al API para validación robusta (DB + IP)
      const res = await fetch("/api/usage/check");
      if (!res.ok) throw new Error("Failed to check limit");
      
      const data: UsageResult = await res.json();
      setUsageInfo(data);

      if (!data.allowed) {
        setShowLimitModal(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Usage limit check failed:", error);
      // Fallback: permitir en caso de error de red para no bloquear al usuario injustamente
      return true;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const incrementUsage = useCallback(async () => {
    if (session?.user?.subscriptionActive) return;

    try {
      await fetch("/api/usage/increment", { method: "POST" });
    } catch (error) {
      console.error("Failed to increment usage:", error);
    }
  }, [session]);

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

