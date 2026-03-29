"use client";

import { SessionProvider } from "next-auth/react";
import { useSubscriptionWebSocket } from "@/hooks/useSubscriptionWebSocket";

// Sub-component that uses the hook inside the SessionProvider context
function WebSocketHandler() {
  useSubscriptionWebSocket();
  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WebSocketHandler />
      {children}
    </SessionProvider>
  );
}
