
---

# Solana Portal

A Next.js + TypeScript frontend with a Go backend that demonstrates:

* Real-time Solana token feed over **WebSockets**
* **Phantom wallet** connection & SOL transfers on Devnet
* **Content moderation** for token metadata (local + OpenAI fallback)
* SOL → USD estimation using **CoinGecko**

---

## 📦 Tech Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind, ShadCN UI
* **Backend:** Go (trialtask repo)
* **Solana:** `@solana/web3.js` + Phantom Wallet
* **APIs:**

  * Helius Devnet RPC
  * CoinGecko Price API
  * OpenAI Moderation API (via proxy route)

---

## 🚀 Setup

### Backend (Go)

```bash
git clone https://github.com/u289-bit/trialtask
cd trialtask
go run .
```

This starts a WebSocket server at **ws://127.0.0.1:8080/connect**

### Frontend (Next.js)

```bash
git clone https://github.com/SaySohail/solana-portal.git
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8080/connect
NEXT_PUBLIC_SOLANA_RPC=https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY
OPENAI_API_KEY=sk-xxxxxx   # server-side key
```

Run dev server:

```bash
npm run dev
```

---

## 💡 Features

### Cosmo (New Pairs Feed)

* Connects to Go WebSocket
* Displays live stream of new Solana tokens (mint, name, symbol, metadata, etc.)
* Blocks unsafe tokens/images via moderation

### Transfer

* Connect Phantom wallet (Devnet)
* Enter recipient address + SOL amount
* Toggle to show USD value (via CoinGecko)
* Sign + send SOL transaction through Phantom
* Toast notifications on success/error

---

## ⚙️ Requirements

* Phantom Wallet (set to **Devnet**)
* Go installed for backend
* Node.js (20+) for frontend

---
