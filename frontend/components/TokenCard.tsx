"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Copy, Check } from "lucide-react";
type TokenMetadata = {
  image?: string;
  description?: string;
  twitter?: string;
  website?: string;
};

type Token = {
  logo?: string;
  metadata?: TokenMetadata;
  name: string;
  symbol?: string;
  timestamp?: number | string;
  mint: string;
  uri?: string;
};

type TokenCardProps = {
  token: Token;
  darkMode?: boolean;
  copiedId?: string;
  onCopy: (mint: string, id: string) => void;
};

export default function TokenCard({ token, darkMode, copiedId, onCopy }: TokenCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl shrink-0">
            <AvatarImage src={token.logo} alt={token.name} />
            <AvatarFallback className="rounded-lg sm:rounded-xl text-sm sm:text-lg font-bold">
              {token.symbol?.slice(0, 2) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <h3 className={`text-base sm:text-xl font-bold mb-1 truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {token.name}
                </h3>
                <Badge variant="secondary" className="font-mono text-xs">
                  {token.symbol}
                </Badge>
              </div>
              {token.timestamp && (
                <span className={`text-xs whitespace-nowrap ${darkMode ? "text-slate-500" : "text-slate-600"}`}>
                  {new Date(token.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>

            {token.metadata?.description && (
              <p className={`text-xs sm:text-sm line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {token.metadata.description}
              </p>
            )}

            <div className={`flex items-center gap-2 text-xs sm:text-sm font-mono ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              <span className="truncate">Mint: {token.mint.slice(0, 8)}...{token.mint.slice(-6)}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onCopy(token.mint, token.mint)}>
                {copiedId === token.mint ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {token.uri && (
                <Button variant="link" size="sm" className="h-auto p-0 gap-1 text-xs sm:text-sm" asChild>
                  <a href={token.uri} target="_blank" rel="noopener noreferrer">
                    View Metadata <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
              {token.metadata?.twitter && (
                <Button variant="link" size="sm" className="h-auto p-0 gap-1 text-xs sm:text-sm" asChild>
                  <a href={token.metadata.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
              {token.metadata?.website && (
                <Button variant="link" size="sm" className="h-auto p-0 gap-1 text-xs sm:text-sm" asChild>
                  <a href={token.metadata.website} target="_blank" rel="noopener noreferrer">
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
