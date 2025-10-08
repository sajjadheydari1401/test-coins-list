"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCachedPage, fetchPage } from "../store/coinsSlice";
import api from "../lib/api";
import { savePage } from "../lib/idb";
import type { RootState, AppDispatch } from "../store";
import CoinCard from "./CoinCard";
import SkeletonCard from "./SkeletonCard";
import ShowMoreButton from "./ShowMoreButton";
import { REFETCH_INTERVAL } from "../lib/config";

export default function CoinsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, page, per_page } = useSelector(
    (s: RootState) => s.coins
  );
  const [loadedPages, setLoadedPages] = useState(1);

  useEffect(() => {
    // Load cached first, then background fetch
    dispatch(loadCachedPage({ page: 1, per_page } as any));

    const interval = setInterval(() => {
      console.debug(
        "[coins] interval tick - dispatching silent fetch",
        new Date().toISOString()
      );
      dispatch(
        fetchPage({
          page: 1,
          per_page,
          forceNetwork: true,
          silent: true,
        } as any)
      ).then((res: any) => {
        console.debug(
          "[coins] interval fetch finished",
          res && res.payload ? "ok" : "failed",
          res
        );
      });
    }, REFETCH_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, per_page]);

  const handleShowMore = () => {
    if (loadedPages === 1) {
      api
        .get("/coins", { params: { page: 1, per_page: 50 } })
        .then(async (resp) => {
          const data = resp.data.data as any[];
          const toAppend = data.slice(10); // items 11..50
          await savePage(`coins:1:50`, data);
          dispatch({ type: "coins/appendCoins", payload: toAppend });
          setLoadedPages(2);
        });
    } else {
      dispatch(
        fetchPage({
          page: loadedPages,
          per_page: 50,
          forceNetwork: false,
        } as any)
      ).then((res: any) => {
        if (res && res.payload && res.payload.data) {
          setLoadedPages(loadedPages + 1);
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      {status === "loading" && items.length === 0
        ? Array.from({ length: per_page }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        : items.map((c: any) => <CoinCard key={c.id} coin={c} />)}

      <div className="flex justify-center mt-4">
        <ShowMoreButton
          onClick={handleShowMore}
          disabled={status === "loading"}
        />
      </div>
    </div>
  );
}
