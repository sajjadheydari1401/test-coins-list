import React, { useState } from "react";
import Image from "next/image";
import { getImageSrc } from "../lib/image";

type Coin = {
  image?: string;
  symbol: string;
  name: string;
  price?: number;
  rank: number;
  change_24h?: number;
};

type CoinCardProps = {
  coin: Coin;
};

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const [imgError, setImgError] = useState(false);

  const renderImage = () =>
    imgError ? (
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded px-1">
        <span
          className="text-xs text-gray-400 max-w-full truncate block"
          title={coin.symbol.toUpperCase()}
          style={{ maxWidth: "100%" }}
        >
          {coin.symbol.toUpperCase()}
        </span>
      </div>
    ) : (
      <Image
        src={getImageSrc(coin.image)}
        alt={coin.symbol}
        width={48}
        height={48}
        className="w-12 h-12"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );

  const buildCmcUrl = () => {
    const base = "https://coinmarketcap.com/currencies";
    // @ts-ignore slug may not be present on all items
    if ((coin as any).slug) return `${base}/${(coin as any).slug}/`;
    return `https://coinmarketcap.com/search/?q=${encodeURIComponent(
      coin.name
    )}`;
  };

  return (
    <a
      href={buildCmcUrl()}
      target="_blank"
      rel="noreferrer noopener"
      className="block"
    >
      <div
        className="p-4 bg-white rounded shadow-sm flex items-center gap-4 transition-all duration-200 cursor-pointer
      hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-100 hover:to-white
      hover:border-blue-100 border border-transparent"
      >
        {renderImage()}
        <div className="flex-1">
          <div className="font-medium">
            {coin.name}{" "}
            <span className="text-sm text-gray-500">
              {coin.symbol.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {coin.price !== undefined ? `$${coin.price.toLocaleString()}` : "—"}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">#{coin.rank}</div>
          <div
            className={`text-sm ${
              coin.change_24h && coin.change_24h >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {coin.change_24h !== undefined
              ? `${coin.change_24h.toFixed(2)}%`
              : "—"}
          </div>
        </div>
      </div>
    </a>
  );
};

export default CoinCard;
