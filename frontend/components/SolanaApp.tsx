"use client";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Send, RefreshCw } from "lucide-react";
import Header from "./Header";
import Toast from "./Toast";
import TokenFeed from "./TokenFeed";
import TransferForm from "./TransferForm";
import { connectPhantom, disconnectPhantom } from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";
import { copyToClipboard } from "@/utils/format";

export default function SolanaApp() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [page, setPage] = React.useState<"cosmo" | "transfer">("cosmo");
  const [wallet, setWallet] = React.useState<PublicKey | null>(null);
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  // Theme effect
  React.useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Toast helper
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Clipboard helper
  const onCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // Phantom wallet connect
  const connectWallet = async () => {
    try {
      const pk = await connectPhantom();
      if (!pk) {
        showToast("Please install Phantom wallet", "error");
        return;
      }
      setWallet(pk);
      showToast("Wallet connected successfully", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to connect wallet", "error");
    }
  };

  // Phantom wallet disconnect
  const disconnectWallet = async () => {
    try {
      await disconnectPhantom();
      setWallet(null);
      showToast("Wallet disconnected", "success");
    } catch (e) {
      console.error(e);
    }
  };

  const walletLabel = wallet ? `${wallet.toString().slice(0, 4)}...` : null;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50"
      }`}
    >
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        walletLabel={walletLabel}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />

      {/* Toast */}
      <Toast
        open={!!toast}
        message={toast?.message || ""}
        type={toast?.type || "success"}
      />

      {/* Main Tabs */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs
          value={page}
          onValueChange={(v) => setPage(v as "cosmo" | "transfer")}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger
              value="cosmo"
              className="gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Cosmo Feed</span>
              <span className="xs:hidden">Feed</span>
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              Transfer
            </TabsTrigger>
          </TabsList>

          {/* Token Feed */}
          <TabsContent value="cosmo" className="space-y-4 sm:space-y-6">
            <TokenFeed
              darkMode={darkMode}
              onCopy={onCopy}
              copiedId={copied}
            />
          </TabsContent>

          {/* Transfer Form */}
          <TabsContent value="transfer" className="space-y-4 sm:space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <h2
                  className={`text-xl sm:text-3xl font-bold mb-1 sm:mb-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Send SOL
                </h2>
                <p
                  className={`text-sm sm:text-base ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Transfer SOL from your Phantom wallet
                </p>
              </div>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <TransferForm
                    wallet={wallet}
                    darkMode={darkMode}
                    showToast={showToast}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
