export const PROVIDER = process.env.PROVIDER;
export const CMC_API_KEY = process.env.CMC_API_KEY;
export const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 300);
export const NODE_ENV = process.env.NODE_ENV || "development";
export const API_BASE_URL = "/api";
export const VS_CURRENCY = "usd";
export const DEFAULT_PER_PAGE = 10;
export const REFETCH_INTERVAL= 10_000;

export function coinMarketCapUrl(start: number, per_page: number) {
  return `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${start}&limit=${per_page}&convert=${VS_CURRENCY.toUpperCase()}`;
}
