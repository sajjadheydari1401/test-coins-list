import React from "react";

export default function CoinCard({ coin }: { coin: any }) {
  return (
    <div className="p-4 bg-white rounded shadow-sm flex items-center gap-4">
      <img
        src={coin.image}
        alt={coin.symbol}
        className="w-12 h-12"
        loading="lazy"
      />
      <div className="flex-1">
        <div className="font-medium">
          {coin.name}{" "}
          <span className="text-sm text-gray-500">
            {coin.symbol.toUpperCase()}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          ${coin.price?.toLocaleString()}
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">#{coin.rank}</div>
        <div
          className={`text-sm ${
            coin.change_24h >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {coin.change_24h ? coin.change_24h.toFixed(2) + "%" : "—"}
        </div>
      </div>
    </div>
  );
}
