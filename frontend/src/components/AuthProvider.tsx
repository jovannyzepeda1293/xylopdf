"use client";

import { SessionProvider } from "next-auth/react";
import { useSubscriptionWebSocket } from "@/hooks/useSubscriptionWebSocket";
import { useSessionExpiration } from "@/hooks/useSessionExpiration";

// Sub-component that handles session-related background tasks
function SessionHandlers() {
  useSubscriptionWebSocket();
  useSessionExpiration();
  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionHandlers />
      {children}
    </SessionProvider>
  );
}
