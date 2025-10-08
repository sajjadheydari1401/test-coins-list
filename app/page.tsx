import React from "react";
import CoinsList from "./components/CoinsList";

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Crypto Coins</h1>
        <p className="text-sm text-gray-600 mb-6">A simple coins list MVP</p>
        <CoinsList />
      </div>
    </main>
  );
}
