"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function HeaderBar() {
  const { page } = useSelector((s: RootState) => s.coins);

  return (
    <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
      <div className="max-w-3xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">Crypto Coins</h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">A simple coins list MVP</p>
              <div
                className="w-3 h-3 bg-blue-700 rounded-full animate-pulse"
                aria-hidden="true"
                title="Auto-updating"
              />
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">Page: {page}</div>
      </div>
    </div>
  );
}
