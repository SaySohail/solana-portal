"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, AlertCircle } from "lucide-react";
import TokenCard from "./TokenCard";
import { useTokenWebSocket } from "@/hooks/useTokenWebSocket";

export default function TokenFeed({
  darkMode,
  onCopy,
  copiedId,
}: {
  darkMode: boolean;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  const { tokens, wsStatus } = useTokenWebSocket(true);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2
            className={`text-xl sm:text-3xl font-bold mb-1 sm:mb-2 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Live Token Feed
          </h2>
          <p
            className={`text-sm sm:text-base ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Real-time stream of newly created tokens
          </p>
        </div>
        <Badge
          variant={
            wsStatus === "connected"
              ? "default"
              : wsStatus === "connecting"
              ? "secondary"
              : "destructive"
          }
          className="self-start sm:self-auto"
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              wsStatus === "connected"
                ? "bg-green-400 animate-pulse"
                : wsStatus === "connecting"
                ? "bg-yellow-400 animate-pulse"
                : "bg-red-400"
            }`}
          />
          {wsStatus}
        </Badge>
      </div>

      {wsStatus === "disconnected" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Unable to connect to WebSocket. Make sure the backend is running.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 sm:gap-4">
        {tokens.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
              <RefreshCw
                className={`w-12 h-12 sm:w-16 sm:h-16 mb-4 animate-spin ${
                  darkMode ? "text-slate-600" : "text-slate-400"
                }`}
              />
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Waiting for new tokens...
              </p>
            </CardContent>
          </Card>
        ) : (
          tokens.map((t, i) => (
            <TokenCard
              key={`${t.mint}-${i}`}
              token={t}
              darkMode={darkMode}
              onCopy={onCopy}
              copiedId={copiedId ?? undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
