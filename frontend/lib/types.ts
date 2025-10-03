import { PublicKey, Transaction } from "@solana/web3.js";


export interface TokenMetadata {
name?: string;
symbol?: string;
description?: string;
image?: string;
showName?: boolean;
createdOn?: string;
twitter?: string;
website?: string;
}


export interface TokenData {
mint: string;
name: string;
symbol: string;
uri: string;
logo?: string;
timestamp?: number;
metadata?: TokenMetadata;
}


export interface PhantomProvider {
isPhantom?: boolean;
publicKey?: PublicKey;
connect: () => Promise<{ publicKey: PublicKey }>;
disconnect: () => Promise<void>;
signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
isConnected: boolean;
}


declare global {
interface Window {
solana?: PhantomProvider;
}
}