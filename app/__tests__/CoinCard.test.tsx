import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CoinCard from "../components/CoinCard";

describe("CoinCard Component", () => {
  const coin = {
    symbol: "BTC",
    name: "Bitcoin",
    rank: 1,
    price: 30000,
    change_24h: 2.5,
    image: "/btc.png",
  };

  const coinNegativeChange = {
    ...coin,
    symbol: "ETH",
    name: "Ethereum",
    rank: 2,
    price: 2000,
    change_24h: -1.2,
    image: "/eth.png",
  };

  it("renders coin information correctly", () => {
    render(<CoinCard coin={coin} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("$30,000")).toBeInTheDocument();
    expect(screen.getByText("2.50%")).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://coinmarketcap.com/search/?q=Bitcoin"
    );
  });

  it("applies correct color for positive and negative changes", () => {
    render(<CoinCard coin={coin} />);
    expect(screen.getByText("2.50%")).toHaveClass("text-green-600");

    render(<CoinCard coin={coinNegativeChange} />);
    expect(screen.getByText("-1.20%")).toHaveClass("text-red-600");
  });

  it("renders fallback UI when image fails to load", () => {
    render(<CoinCard coin={{ ...coin, image: "broken.png" }} />);
    const img = screen.getByAltText("BTC");

    // simulate image error
    fireEvent.error(img);

    // Find the fallback by checking its parent class
    const fallback = screen
      .getAllByText("BTC")
      .find((el) =>
        el.parentElement?.className.includes(
          "w-12 h-12 flex items-center justify-center"
        )
      );

    expect(fallback).toBeInTheDocument();
  });
});
