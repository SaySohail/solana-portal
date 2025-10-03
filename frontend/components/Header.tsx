"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Sun, Moon } from "lucide-react";

export default function Header({
  darkMode,
  setDarkMode,
  walletLabel,
  onConnect,
  onDisconnect,
}: {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  walletLabel: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <header
      className={`border-b backdrop-blur-lg sticky top-0 z-50 ${
        darkMode
          ? "bg-slate-950/80 border-slate-800"
          : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                darkMode ? "bg-purple-600" : "bg-purple-500"
              }`}
            >
              <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1
                className={`text-base sm:text-xl font-bold truncate ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Solana Portal
              </h1>
              <p
                className={`text-xs hidden sm:block ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Devnet Explorer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
            >
              {darkMode ? (
                <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>

            {walletLabel ? (
              <Button
                onClick={onDisconnect}
                variant="default"
                className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="hidden xs:inline">{walletLabel}</span>
              </Button>
            ) : (
              <Button
                onClick={onConnect}
                className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
              >
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Connect</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
