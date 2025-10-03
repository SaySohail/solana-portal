"use client";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Toast({
  open,
  message,
  type = "success",
}: {
  open: boolean;
  message: string;
  type?: "success" | "error";
}) {
  if (!open) return null;
  return (
    <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50 animate-in slide-in-from-right max-w-[calc(100vw-1rem)] sm:max-w-md">
      <Alert
        className={
          type === "success"
            ? "border-green-500 bg-green-950"
            : "border-red-500 bg-red-950"
        }
      >
        <AlertDescription className="text-white text-sm">
          {message}
        </AlertDescription>
      </Alert>
    </div>
  );
}
