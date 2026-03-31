"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Hook to proactively monitor session expiration.
 * If the current time passes the 'expiresAt' date from the session,
 * it triggers a session update to refresh the 'subscriptionActive' flag.
 */
export const useSessionExpiration = () => {
  const { data: session, update } = useSession();
  
  useEffect(() => {
    if (!session?.user?.expiresAt || !session?.user?.subscriptionActive) {
      return;
    }

    const checkExpiration = () => {
      const expiresAtStr = session?.user?.expiresAt;
      if (!expiresAtStr) return;

      const expiresAt = new Date(expiresAtStr);
      const now = new Date();

      if (now >= expiresAt) {
        console.log("[useSessionExpiration] Subscription has expired according to local time. Updating session...");
        update();
      }
    };

    // Run check every hour (3,600,000 ms)
    const interval = setInterval(checkExpiration, 3600000);
    
    // Immediate check
    checkExpiration();

    return () => clearInterval(interval);
  }, [session, update]);
};
