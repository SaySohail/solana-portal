export const fetchSolPrice = async (): Promise<number> => {
const response = await fetch(
"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
);
if (!response.ok) throw new Error("Failed to fetch SOL price");
const data = await response.json();
return data.solana.usd;
};


export const fetchTokenMetadata = async (uri: string) => {
try {
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
const res = await fetch(uri, { signal: controller.signal, mode: "cors" });
clearTimeout(timeoutId);
if (!res.ok) return null;
return await res.json();
} catch (e) {
return null;
}
};