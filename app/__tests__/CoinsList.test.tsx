import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CoinsList from "../components/CoinsList";
import coinsReducer from "../store/coinsSlice";

describe("CoinsList Component", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { coins: coinsReducer } as any,
      preloadedState: {
        coins: {
          items: [
            {
              symbol: "BTC",
              name: "Bitcoin",
              rank: 1,
              price: 30000,
              change_24h: 2.5,
            },
            {
              symbol: "ETH",
              name: "Ethereum",
              rank: 2,
              price: 2000,
              change_24h: -1.2,
            },
          ],
          status: "idle",
          per_page: 10,
          page: 1,
        },
      },
    });
  });

  it("renders initial list of coins", () => {
    render(
      <Provider store={store}>
        <CoinsList />
      </Provider>
    );

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
  });

  it("renders 'Show More' button and appends a new coin", async () => {
    render(
      <Provider store={store}>
        <CoinsList />
      </Provider>
    );

    const button = screen.getByRole("button", { name: /show more/i });
    expect(button).toBeInTheDocument();

    // Simulate appending a coin manually (mocking Show More effect)
    store.dispatch({
      type: "coins/appendCoins",
      payload: [
        { symbol: "SOL", name: "Solana", rank: 3, price: 30, change_24h: 1.2 },
      ],
    });

    // Wait for the component to update after state change
    await waitFor(() => {
      expect(screen.getByText("Solana")).toBeInTheDocument();
      expect(screen.getByText("SOL")).toBeInTheDocument();
    });
  });
});
