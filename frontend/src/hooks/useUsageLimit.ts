"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UsageResult {
  allowed: boolean;
  remaining: number;
  isSubscribed: boolean;
  isExpired: boolean;
  resetTime: number;
}

export function useUsageLimit() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageInfo, setUsageInfo] = useState<UsageResult | null>(null);

  const checkLimit = useCallback(async () => {
    setLoading(true);
    try {
      // Consultar al API para validación robusta (DB + IP)
      // Eliminamos el check optimista de la sesión para asegurar que se evalúe 
      // la suscripción en el momento exacto de la acción como solicitó el usuario.
      const res = await fetch("/api/usage/check");
      if (!res.ok) throw new Error("Failed to check limit");
      
      const data: UsageResult = await res.json();
      setUsageInfo(data);

      // Si detectamos que la sesión dice que es premium pero el API dice que no,
      // actualizamos la sesión de NextAuth para sincronizar el UI (Navbar, etc)
      if (data.isExpired && session?.user?.subscriptionActive) {
        console.log("Subscription expired detected, refreshing session...");
        await update();
      }

      if (!data.allowed) {
        setShowLimitModal(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Usage limit check failed:", error);
      // Fallback: permitir en caso de error de red para no bloquear al usuario injustamente
      // Pero si tenemos sesión premium, confiamos en ella como último recurso
      if (session?.user?.subscriptionActive) return true;
      return true;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const incrementUsage = useCallback(async () => {
    // Si la info de uso dice que está suscrito, no incrementamos
    if (usageInfo?.isSubscribed || session?.user?.subscriptionActive) return;

    try {
      await fetch("/api/usage/increment", { method: "POST" });
    } catch (error) {
      console.error("Failed to increment usage:", error);
    }
  }, [session, usageInfo]);

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

