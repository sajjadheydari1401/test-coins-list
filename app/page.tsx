import React from "react";
import CoinsList from "./components/CoinsList";
import HeaderBar from "./components/HeaderBar";

export default function Home() {
  return (
    <main className="min-h-screen p-0 bg-gray-50">
      <HeaderBar />

      <div className="max-w-3xl mx-auto p-6">
        <CoinsList />
      </div>
    </main>
  );
}
