# Crypto Coins List — MVP

Small Next.js app that displays a list of cryptocurrencies with cache-first behavior, IndexedDB storage, pagination, and a server API proxy that can use CoinMarketCap.

## Features

- Initial list: top 10 cryptocurrencies (rank order), loaded from IndexedDB if present (cache-first).
- Periodic refresh: background polling (10s) updates page 1 from the network.
- Pagination: clicking "Show More" appends 50-item batches: first click adds ranks 11–50, next adds 51–100, etc.
- IndexedDB caching: pages are stored in IndexedDB to support fast initial loads and offline behavior.
- Server-side proxy: `app/api/coins/route.ts` proxies requests to CoinMarketCap.
- Simple, responsive UI built with Tailwind and React components.

## Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/sajjadheydari1401/test-coins-list.git
npm install
npm run dev
```

Create an environment file by copying `.env.example` to `.env` and editing values as needed

Important variables in `.env` (see `.env.example`):

- `CMC_API_KEY` — your CoinMarketCap API key.
- `CACHE_TTL_SECONDS` — optional cache TTL for IndexedDB (not enforced by default; see notes).

## Run (development)
1. Obtain a CoinMarketCap API key from https://coinmarketcap.com/api/
2. Set `CMC_API_KEY=your_key` in `.env`.
3. Restart the dev server.

Open http://localhost:3000

Notes:

- The project uses the Next.js App Router. Server and client components are used; the Redux provider is provided via a small client wrapper to avoid server/client export issues.

## Build / Start (production)

```bash
npm run build
npm start
```

## Project structure and important files

- `app/`
  - `api/coins/route.ts` — server API route that proxies to CoinMarketCap; normalizes response shape.
  - `components/` — React components: `CoinCard`, `CoinsList`, `SkeletonCard`, `ShowMoreButton`.
  - `providers/ReduxProvider.tsx` — client-only wrapper for `react-redux` Provider.
  - `lib/`
    - `api.ts` — axios instance for client requests.
    - `config.ts` — centralized configuration and URL builders (provider, API keys, URL helpers).
    - `idb.ts` — IndexedDB helpers using the `idb` library (openDB, savePage, getPage, clearCache).
  - `store/` — Redux Toolkit store and `coinsSlice` (thunks: `loadCachedPage`, `fetchPage`).
  - `page.tsx` and `layout.tsx` — app layout and root page wiring the components.

Other noteworthy files:

- `global.d.ts` — declarations for importing CSS/images in TypeScript.
- `.env.example` — example environment variables.

## Design decisions and rationale

- Cache-first design (IndexedDB)

  - We store whole pages in IndexedDB keyed by `coins:{page}:{per_page}` so initial loads are immediate and the app works in flaky/offline conditions.
  - The app polls the network in the background (10s) to refresh page 1 and updates the cache.

- Redux Toolkit

  - It provides predictable state management and built-in async thunk support. We implemented `loadCachedPage` (IDB read) and `fetchPage` (network + save to IDB).

- Axios + idb

  - `axios` for client HTTP convenience and easier error handling.
  - `idb` (small wrapper) for IndexedDB operations — it's lightweight and reliable.

- UI and styling
  - Tailwind CSS is used for quick, responsive UI styling.
  - Skeleton placeholders (shimmer) improve perceived performance for loading states.

## How Pagination works

- Initial load: `per_page=10`, page=1. If `coins:1:10` exists in IndexedDB it is loaded immediately.
- First "Show More" click: we fetch top 50 from the server and append items 11–50 to the already-shown 1–10. We also cache `coins:1:50` in IndexedDB for fast subsequent loads.
- Subsequent clicks: we fetch page=2, page=3... with `per_page=50` and append each 50-item batch (so second click adds ranks 51–100, etc.).

This strategy avoids re-downloading or replacing the initial 1–10 and ensures consistent append behavior.