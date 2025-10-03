import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PhantomProvider } from "./types";


// Use env var in Next.js: define NEXT_PUBLIC_SOLANA_RPC in .env.local
export const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";


export const connectPhantom = async (): Promise<PublicKey | null> => {
if (!window?.solana?.isPhantom) return null;
const { publicKey } = await window.solana.connect();
return publicKey;
};


export const disconnectPhantom = async (): Promise<void> => {
if (window?.solana) await window.solana.disconnect();
};


export const sendSolTransaction = async ({
wallet,
toAddress,
amount,
phantomProvider,
}: {
wallet: PublicKey;
toAddress: string;
amount: string;
phantomProvider: PhantomProvider;
}): Promise<string> => {
const connection = new Connection(RPC_URL, "confirmed");
const toPublicKey = new PublicKey(toAddress);
const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);


const transaction = new Transaction().add(
SystemProgram.transfer({ fromPubkey: wallet, toPubkey: toPublicKey, lamports })
);


const { blockhash } = await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhash;
transaction.feePayer = wallet;


const { signature } = await phantomProvider.signAndSendTransaction(transaction);
await connection.confirmTransaction(signature);
return signature;
};