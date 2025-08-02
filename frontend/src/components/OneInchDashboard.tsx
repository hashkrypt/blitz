// src/components/OneInchDashboard.tsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  value: number;
  logo: string;
}

interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  gas: string;
  protocols: string[];
}

const OneInchDashboard: React.FC = () => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);
  const [gasPrice, setGasPrice] = useState<string>("");
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const INCH_API_KEY = process.env.REACT_APP_1INCH_API_KEY || "demo";
  const userAddress = "0xYourAddress"; // Get from wallet

  // 1. Portfolio API - Get token balances
  const fetchPortfolio = async () => {
    try {
      const response = await fetch(
        `https://api.1inch.dev/portfolio/v4/overview/erc20/details?addresses=${userAddress}&chain_id=137`,
        {
          headers: { Authorization: `Bearer ${INCH_API_KEY}` },
        }
      );
      const data = await response.json();
      // Process and set balances
      console.log("Portfolio data:", data);
    } catch (error) {
      console.error("Portfolio fetch error:", error);
    }
  };

  // 2. Swap API - Get best swap rates
  const fetchSwapQuote = async () => {
    try {
      const response = await fetch(
        `https://api.1inch.dev/swap/v6.0/137/quote?src=0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270&dst=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&amount=1000000000000000000&from=${userAddress}`,
        {
          headers: { Authorization: `Bearer ${INCH_API_KEY}` },
        }
      );
      const quote = await response.json();
      setSwapQuote(quote);
    } catch (error) {
      console.error("Swap quote error:", error);
    }
  };

  // 3. Gas Price API
  const fetchGasPrice = async () => {
    try {
      const response = await fetch("https://api.1inch.dev/gas-price/v1.5/137", {
        headers: { Authorization: `Bearer ${INCH_API_KEY}` },
      });
      const data = await response.json();
      setGasPrice(data.medium || "30");
    } catch (error) {
      console.error("Gas price error:", error);
    }
  };

  // 4. Liquidity Sources API
  const fetchProtocols = async () => {
    try {
      const response = await fetch(
        "https://api.1inch.dev/swap/v6.0/137/liquidity-sources",
        {
          headers: { Authorization: `Bearer ${INCH_API_KEY}` },
        }
      );
      const data = await response.json();
      setProtocols(data.protocols || []);
    } catch (error) {
      console.error("Protocols error:", error);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await Promise.all([
        fetchPortfolio(),
        fetchSwapQuote(),
        fetchGasPrice(),
        fetchProtocols(),
      ]);
      setLoading(false);
    };

    loadDashboard();
    const interval = setInterval(loadDashboard, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Portfolio Overview */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <img
            src="/logos/1inch_without_text_white.svg"
            className="w-6 h-6 mr-2"
          />
          Portfolio Overview
        </h3>

        <div className="space-y-3">
          {/* Mock data for demo */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-semibold">MATIC</p>
                <p className="text-xs text-gray-400">1,234.56</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">$1,098.76</p>
              <p className="text-xs text-green-400">+2.4%</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-semibold">USDC</p>
                <p className="text-xs text-gray-400">2,500.00</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">$2,500.00</p>
              <p className="text-xs text-gray-400">0.0%</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Portfolio</span>
            <span className="text-xl font-bold">$3,598.76</span>
          </div>
        </div>
      </div>

      {/* Best Swap Rates */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <img
            src="/logos/1inch_without_text_white.svg"
            className="w-6 h-6 mr-2"
          />
          Best Swap Rates
        </h3>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">From</span>
              <span className="font-semibold">1 MATIC</span>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">To</span>
              <span className="font-semibold">0.89 USDC</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Route</span>
              <span>QuickSwap → 1inch LP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Cost</span>
              <span className="text-yellow-400">{gasPrice} GWEI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slippage</span>
              <span className="text-green-400">0.1%</span>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors">
          Swap Now
        </button>
      </div>

      {/* Liquidity Sources */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <img
            src="/logos/1inch_without_text_white.svg"
            className="w-6 h-6 mr-2"
          />
          Active Liquidity Sources
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {[
            "QuickSwap",
            "SushiSwap",
            "Balancer",
            "Curve",
            "1inch LP",
            "DFYN",
          ].map((protocol) => (
            <div
              key={protocol}
              className="bg-gray-800 rounded-lg p-3 text-center"
            >
              <p className="text-sm font-semibold">{protocol}</p>
              <p className="text-xs text-green-400">Active</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Book Stats */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <img
            src="/logos/1inch_without_text_white.svg"
            className="w-6 h-6 mr-2"
          />
          Limit Order Stats
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Active Orders</span>
            <span className="text-2xl font-bold">1,234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">24h Volume</span>
            <span className="text-xl font-semibold">$2.4M</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Avg Fill Time</span>
            <span className="text-lg">12 min</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-xs text-green-400">
            Your stop-loss orders execute 3x faster than market average
          </p>
        </div>
      </div>
    </div>
  );
};

export default OneInchDashboard;
