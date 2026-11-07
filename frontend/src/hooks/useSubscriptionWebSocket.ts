"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

/**
 * Hook to connect to the backend WebSocket and listen for subscription updates.
 * When an update is received, it refreshes the NextAuth session.
 */
export const useSubscriptionWebSocket = () => {
  const { data: session, update } = useSession();
  const userId = session?.user?.id;
  
  // Use a ref for update to keep the effect stable
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    // Only connect if the user is logged in
    if (!userId) {
      console.log("[WebSocket] No userId present, skipping connection.");
      return;
    }

    // Determine the WebSocket URL from the API URL environment variable
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3501";
    
    // Convert http/https to ws/wss
    const wsProtocol = API_URL.startsWith("https") ? "wss" : "ws";
    // Remove protocol part to get host
    const wsHost = API_URL.replace(/^https?:\/\//, "");
    const wsUrl = `${wsProtocol}://${wsHost}/ws/${userId}`;

    console.log(`[WebSocket] [%cMAC-CONN%c] Iniciando conexión para usuario ${userId} a ${wsUrl}`, "color: blue; font-weight: bold", "");
    
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;
      
      console.log(`[WebSocket] Intentando conectar @ ${new Date().toISOString()}`);
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("[WebSocket] Conectado exitosamente.");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "subscription_updated") {
            console.log("[WebSocket] ¡Suscripción actualizada detectada! Refrescando sesión local...");
            updateRef.current();
          }
        } catch (error) {
          console.error("[WebSocket] Error al procesar mensaje:", error);
        }
      };

      socket.onclose = (event) => {
        if (!isMounted) return;
        console.log(`[WebSocket] Desconectado (código: ${event.code}, razón: ${event.reason || 'N/A'}). Reintentando en 5s...`);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      socket.onerror = (error) => {
        console.error("[WebSocket] Error en el socket:", error);
      };
    };

    connect();

    // Cleanup on unmount or when userId changes
    return () => {
      console.log(`[WebSocket] [%cMAC-CLEAN%c] Limpiando conexión para usuario ${userId}`, "color: orange; font-weight: bold", "");
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }, [userId]); // Only depend on userId
};
