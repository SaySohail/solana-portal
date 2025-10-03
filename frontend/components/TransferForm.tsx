"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Send, RefreshCw, AlertCircle, Wallet } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSolPrice } from "@/lib/api";
import { sendSolTransaction } from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";

const transferFormSchema = z.object({
  toAddress: z
    .string()
    .min(1, "Address is required")
    .refine((val) => {
      try {
        new PublicKey(val);
        return true;
      } catch {
        return false;
      }
    }, "Invalid Solana address"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0"),
});

type TransferFormData = z.infer<typeof transferFormSchema>;

export default function TransferForm({
  wallet,
  darkMode,
  showToast,
}: {
  wallet: PublicKey | null;
  darkMode: boolean;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  // RHF setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema),
    mode: "onChange",
  });

  const [showUSD, setShowUSD] = React.useState(false);
  const amount = watch("amount");

  // Fetch SOL price
  const { data: solPrice } = useQuery({
    queryKey: ["solPrice"],
    queryFn: fetchSolPrice,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  // Mutation for transfer
  const transferMutation = useMutation({
    mutationFn: sendSolTransaction,
    onSuccess: () => {
      showToast("Transaction sent successfully!", "success");
      reset();
    },
    onError: (error: any) => {
      showToast(`Transfer failed: ${error.message}`, "error");
    },
  });

  const onSubmit = (data: TransferFormData) => {
    if (!wallet || !window.solana) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    transferMutation.mutate({
      wallet,
      toAddress: data.toAddress,
      amount: data.amount,
      phantomProvider: window.solana,
    });
  };

  const estimatedUSD =
    amount && solPrice ? (parseFloat(amount) * solPrice).toFixed(2) : "0.00";

  // If no wallet connected
  if (!wallet) {
    return (
      <div className="text-center py-8 sm:py-12 space-y-4">
        <div
          className={`${
            darkMode ? "bg-slate-800" : "bg-slate-100"
          } w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center`}
        >
          <Wallet
            className={`${
              darkMode ? "text-slate-400" : "text-slate-600"
            } w-8 h-8 sm:w-10 sm:h-10`}
          />
        </div>
        <div className="space-y-2">
          <p
            className={`${
              darkMode ? "text-white" : "text-slate-900"
            } font-medium text-sm sm:text-base`}
          >
            Connect Your Wallet
          </p>
          <p
            className={`${
              darkMode ? "text-slate-400" : "text-slate-600"
            } text-xs sm:text-sm`}
          >
            Connect your Phantom wallet to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Recipient Address */}
      <div className="space-y-2">
        <Label htmlFor="toAddress" className="text-sm">
          Recipient Address
        </Label>
        <Input
          id="toAddress"
          type="text"
          {...register("toAddress")}
          placeholder="Enter Solana wallet address"
          className={`text-sm ${errors.toAddress ? "border-red-500" : ""}`}
        />
        {errors.toAddress && (
          <p className="text-xs sm:text-sm text-red-500">
            {errors.toAddress.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="amount" className="text-sm">
            Amount
          </Label>
          {solPrice && (
            <div className="flex items-center gap-2">
              <Label
                htmlFor="usd-toggle"
                className="text-xs sm:text-sm font-normal"
              >
                Show USD
              </Label>
              <Switch
                id="usd-toggle"
                checked={showUSD}
                onCheckedChange={setShowUSD}
              />
            </div>
          )}
        </div>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            step="0.001"
            {...register("amount")}
            placeholder="0.00"
            className={`pr-16 text-sm ${errors.amount ? "border-red-500" : ""}`}
          />
          <span
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            SOL
          </span>
        </div>
        {errors.amount && (
          <p className="text-xs sm:text-sm text-red-500">
            {errors.amount.message}
          </p>
        )}
        {showUSD && amount && solPrice && (
          <p
            className={`${
              darkMode ? "text-slate-400" : "text-slate-600"
            } text-xs sm:text-sm`}
          >
            ≈ ${estimatedUSD} USD
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={transferMutation.isPending}
        className="w-full gap-2"
        size="lg"
      >
        {transferMutation.isPending ? (
          <>
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span className="text-sm sm:text-base">Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Send SOL</span>
          </>
        )}
      </Button>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs sm:text-sm">
          This transaction uses Solana Devnet. Ensure your Phantom wallet is set
          to Devnet mode.
        </AlertDescription>
      </Alert>
    </div>
  );
}
