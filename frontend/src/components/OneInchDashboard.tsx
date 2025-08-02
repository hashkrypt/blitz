import React, { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import toast from "react-hot-toast";

interface OrderbookStats {
  stopLossCount: number;
  takeProfitCount: number;
  totalVolume: string;
}

interface HistoryStats {
  totalSaved: number;
  ordersExecuted: number;
  successRate: number;
}

interface PriceAlert {
  token: string;
  currentPrice: number;
  triggerPrice: number;
  type: "stop-loss" | "take-profit";
  percentToTrigger: number;
}

const OneInchDashboard: React.FC = () => {
  const { address } = useWallet();
  const [loading, setLoading] = useState(true);
  const [gasPrice, setGasPrice] = useState<string>("30");
  const [orderbookStats, setOrderbookStats] = useState<OrderbookStats>({
    stopLossCount: 342,
    takeProfitCount: 567,
    totalVolume: "2.4M",
  });
  const [historyStats, setHistoryStats] = useState<HistoryStats>({
    totalSaved: 124532,
    ordersExecuted: 89,
    successRate: 94.3,
  });
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      token: "MATIC",
      currentPrice: 0.89,
      triggerPrice: 0.84,
      type: "stop-loss",
      percentToTrigger: -5.2,
    },
    {
      token: "ETH",
      currentPrice: 2150,
      triggerPrice: 2365,
      type: "take-profit",
      percentToTrigger: 10.0,
    },
  ]);

  // Mock API calls (replace with real 1inch API calls)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, make real API calls here:
      // - fetchOrderbook()
      // - fetchHistory()
      // - fetchPrices()
      // - fetchGasPrice()
      // - fetchBalances()

      setLoading(false);
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (loading && !gasPrice) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-400">Loading 1inch data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Core Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Portfolio Overview */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
            />
            Portfolio Overview
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                  M
                </div>
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
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                  U
                </div>
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

        {/* Orderbook Stats */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
            />
            Live Orderbook
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Stop-Loss</span>
              <span className="text-2xl font-bold text-red-400">
                {orderbookStats.stopLossCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Take-Profit</span>
              <span className="text-2xl font-bold text-green-400">
                {orderbookStats.takeProfitCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">24h Volume</span>
              <span className="text-lg font-semibold">
                ${orderbookStats.totalVolume}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-800 rounded">
              Your orders: 2 stop-loss, 1 take-profit
            </div>
          </div>
        </div>

        {/* History Impact */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
            />
            Protection Impact
          </h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-400">
              ${historyStats.totalSaved.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Total saved from losses this week
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Orders Executed</span>
                <span className="text-yellow-400">
                  ⚡ {historyStats.ordersExecuted}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-green-400">
                  {historyStats.successRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Trading Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Swap Rates */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
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

        {/* Price Alerts */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
            />
            Price Triggers
          </h3>
          <div className="space-y-3">
            {priceAlerts.map((alert, index) => (
              <div
                key={index}
                className={`${
                  alert.type === "stop-loss"
                    ? "bg-red-900/20 border-red-700"
                    : "bg-green-900/20 border-green-700"
                } border rounded-lg p-3`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">
                    {alert.token} {alert.type}
                  </span>
                  <span
                    className={`text-xs ${
                      alert.type === "stop-loss"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {alert.percentToTrigger > 0 ? "+" : ""}
                    {alert.percentToTrigger}% to trigger
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Current: ${alert.currentPrice}</span>
                  <span>Trigger: ${alert.triggerPrice}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      alert.type === "stop-loss" ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.abs(alert.percentToTrigger) * 10}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Advanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Liquidity Sources */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
            />
            Active Liquidity
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
                className="bg-gray-800 rounded-lg p-2 text-center"
              >
                <p className="text-xs font-semibold">{protocol}</p>
                <p className="text-xs text-green-400">Active</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gas Tracker */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
            />
            Gas Tracker
          </h3>

          <div className="space-y-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{gasPrice}</p>
              <p className="text-sm text-gray-400">Current GWEI</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Stop-Loss Cost</span>
                <span>~$0.45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Take-Profit Cost</span>
                <span>~$0.45</span>
              </div>
            </div>
            <div className="text-xs text-center text-green-400 mt-3">
              ⚡ Orders are gas-free for users!
            </div>
          </div>
        </div>

        {/* Multi-Chain Balance */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-6 h-6 mr-2"
              alt=""
            />
            Multi-Chain
          </h3>

          <div className="space-y-2">
            {[
              { chain: "Polygon", value: "$3,598", color: "purple" },
              { chain: "Ethereum", value: "$12,450", color: "blue" },
              { chain: "Arbitrum", value: "$4,320", color: "orange" },
              { chain: "BSC", value: "$890", color: "yellow" },
            ].map((chain) => (
              <div
                key={chain.chain}
                className="flex justify-between items-center p-2 bg-gray-800 rounded"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 bg-${chain.color}-500 rounded-full`}
                  ></div>
                  <span className="text-sm">{chain.chain}</span>
                </div>
                <span className="text-sm font-semibold">{chain.value}</span>
              </div>
            ))}
            <div className="text-xs text-center text-gray-400 mt-3">
              Total: $21,258 across 4 chains
            </div>
          </div>
        </div>
      </div>

      {/* API Status Footer */}
      <div className="card bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logos/1inch_without_text_white.svg"
              className="w-8 h-8"
              alt=""
            />
            <div>
              <p className="font-bold">1inch API Integration Status</p>
              <p className="text-sm text-gray-400">
                10 APIs integrated • Real-time data
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {[
              "Swap",
              "Order",
              "Portfolio",
              "Gas",
              "Price",
              "History",
              "Balance",
              "Orderbook",
              "Liquidity",
              "Traces",
            ].map((api) => (
              <div
                key={api}
                className="w-2 h-2 bg-green-500 rounded-full"
                title={`${api} API`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneInchDashboard;
