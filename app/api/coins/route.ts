import { NextResponse } from "next/server";
import {
  CMC_API_KEY,
  VS_CURRENCY,
  DEFAULT_PER_PAGE,
  coinMarketCapUrl,
} from "../../lib/config";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const per_page = Number(
      url.searchParams.get("per_page") || DEFAULT_PER_PAGE
    );
    const page = Number(url.searchParams.get("page") || "1");

    // Require CoinMarketCap API key
    if (!CMC_API_KEY) {
      return NextResponse.json(
        {
          message:
            "CoinMarketCap API key is not configured. Set CMC_API_KEY in your .env.",
        },
        { status: 500 }
      );
    }

    const start = (page - 1) * per_page + 1;
    const cmcUrl = coinMarketCapUrl(start, per_page);

    const res = await fetch(cmcUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Upstream error", status: res.status },
        { status: 502 }
      );
    }

    const json = await res.json();

    const mapped = (json.data || []).map((item: any, idx: number) => ({
      id: String(item.id),
      name: item.name,
      symbol: item.symbol,
      image: item?.logo || item?.slug || null,
      price: item.quote?.[VS_CURRENCY.toUpperCase()]?.price ?? null,
      market_cap: item.quote?.[VS_CURRENCY.toUpperCase()]?.market_cap ?? null,
      volume_24h: item.quote?.[VS_CURRENCY.toUpperCase()]?.volume_24h ?? null,
      change_24h:
        item.quote?.[VS_CURRENCY.toUpperCase()]?.percent_change_24h ?? null,
      rank: item.cmc_rank ?? start + idx,
    }));

    return NextResponse.json({
      data: mapped,
      total: json.status?.total_count ?? undefined,
      page,
      per_page,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 }
    );
  }
}
