"use client";
import { useEffect, useState } from "react";
import { TokenData } from "@/lib/types";
import { fetchTokenMetadata } from "@/lib/api";
import { isTokenContentSafe } from "@/lib/moderation";

export type WSStatus = "connecting" | "connected" | "disconnected";

export function useTokenWebSocket(enabled: boolean) {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [wsStatus, setWsStatus] = useState<WSStatus>("disconnected");

  useEffect(() => {
    if (!enabled) return;
    let ws: WebSocket | null = null;
    let reconnect: NodeJS.Timeout | null = null;

    const connect = () => {
      setWsStatus("connecting");
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const host = window.location.hostname;
      ws = new WebSocket(`${protocol}://${host}:8080/connect`);

      ws.onopen = () => setWsStatus("connected");

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          const token: TokenData = { ...data, timestamp: Date.now() };
          if (data?.uri) {
            const metadata = await fetchTokenMetadata(data.uri);
            if (metadata) {
              token.metadata = metadata;
              const safe = await isTokenContentSafe(
                { ...data, description: metadata.description },
                metadata
              );
              console.log(
                "Moderation check:",
                data.name,
                safe ? "✅ allowed" : "⛔ blocked"
              );

              if (safe) {
                token.logo = metadata.image;
              } else {
                token.logo = undefined;
                if (token.metadata) {
                  token.metadata.description = "[Blocked for unsafe content]";
                  token.metadata.image = undefined;
                }
              }
            }
          }
          setTokens((prev) => [token, ...prev].slice(0, 50));
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onerror = () => setWsStatus("disconnected");

      ws.onclose = () => {
        setWsStatus("disconnected");
        reconnect = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnect) clearTimeout(reconnect);
    };
  }, [enabled]);

  return { tokens, wsStatus };
}
