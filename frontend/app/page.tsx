"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SolanaApp from "@/components/SolanaApp";


const queryClient = new QueryClient({
defaultOptions: {
queries: { refetchOnWindowFocus: false, retry: 1 },
},
});


export default function Page() {
return (
<QueryClientProvider client={queryClient}>
<SolanaApp />
</QueryClientProvider>
);
}