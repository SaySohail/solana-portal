import {Filter} from "bad-words";
import { TokenMetadata } from "./types";

const profanityFilter = new Filter();

// Extend bad-words
profanityFilter.addWords(
  "sex", "sexy", "sexcoin", "porn", "xxx", "nsfw", "nude", "onlyfans",
  "fuck", "fucking", "fuk", "fuking", "pussy", "dick", "cock", "penis", "vagina",
  "cum", "anal", "oral", "boob", "tit", "ass", "kick", "kickstream"
);

// Regex-based blocklist (catches embedded words, URLs, obfuscations)
const explicitPatterns: RegExp[] = [
  /fuck/i,
  /f\W?u\W?k/i,
  /sex/i,
  /porn/i,
  /xxx/i,
  /nsfw/i,
  /nude/i,
  /onlyfans/i,
  /kickstream/i,
  /kick\.trade/i,
  /\bkick\b/i,   // match domain mentions
  /(pussy|dick|cock|penis|vagina|cum|anal|oral|boob|tit|ass)/i
];

const rateLimiter = { lastCall: 0, rateLimitMs: 1000 };
const moderationCache = new Map<string, { result: boolean; ts: number }>();
const CACHE_MS = 60_000;

export const cleanTextForModeration = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[\*_\-@#$!.,/]/g, " ") // strip obfuscators
    .trim();
};

export const localModerationCheck = (text: string): boolean => {
  if (!text) return true;
  const cleaned = cleanTextForModeration(text);

  // 1. bad-words check
  if (profanityFilter.isProfane(cleaned)) {
    return false;
  }

  // 2. regex patterns
  for (const pattern of explicitPatterns) {
    if (pattern.test(cleaned)) {
      return false;
    }
  }

  return true;
};

export const checkContentWithOpenAI = async (text: string): Promise<boolean> => {
  if (!text) return true;

  // Local block first
  if (!localModerationCheck(text)) return false;

  // Cache
  const cached = moderationCache.get(text);
  const now = Date.now();
  if (cached && now - cached.ts < CACHE_MS) return cached.result;

  // Rate limit
  if (now - rateLimiter.lastCall < rateLimiter.rateLimitMs) {
    return localModerationCheck(text);
  }

  try {
    rateLimiter.lastCall = now;
    const res = await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.warn("Moderation API error:", res.status);
      return false; 
    }

    const data = await res.json();
    const result = !data.results?.[0]?.flagged;

    moderationCache.set(text, { result, ts: now });
    return result;
  } catch (err) {
    console.error("Moderation API call failed:", err);
    return false; 
  }
};

export const isTokenContentSafe = async (
  token: { name?: string; symbol?: string; description?: string },
  metadata?: TokenMetadata | null
): Promise<boolean> => {
  // Collect all possible fields to scan
  const text = [
    token?.name,
    token?.symbol,
    token?.description,
    metadata?.description,
    metadata?.website,
    metadata?.createdOn,
  ]
    .filter(Boolean)
    .join(" ");

  if (!text) return true;

  const cleaned = cleanTextForModeration(text);

  // Local block first
  if (!localModerationCheck(cleaned)) {
    console.log("⛔ Local block hit for:", cleaned);
    return false;
  }

  // Remote OpenAI check
  return await checkContentWithOpenAI(cleaned);
};

