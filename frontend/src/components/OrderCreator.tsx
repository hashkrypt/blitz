import React, { useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { useStopLoss } from "../hooks/useStopLoss";

type OrderType = "stop-loss" | "take-profit" | "both";

const OrderCreator: React.FC = () => {
  const { signer, isConnected } = useWallet();
  const { createStopLossOrder, isLoading } = useStopLoss();

  const [orderType, setOrderType] = useState<OrderType>("both");
  const [fromChain, setFromChain] = useState("polygon");
  const [toChain, setToChain] = useState("polygon");
  const [fromToken, setFromToken] = useState("MATIC");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [profitPrice, setProfitPrice] = useState("");

  // All chains
  const chains = [
    { id: "polygon", name: "Polygon", icon: "🟣" },
    { id: "ethereum", name: "Ethereum", icon: "⟠" },
    { id: "bsc", name: "BSC", icon: "🟡" },
    { id: "arbitrum", name: "Arbitrum", icon: "🔵" },
    { id: "optimism", name: "Optimism", icon: "🔴" },
    { id: "avalanche", name: "Avalanche", icon: "🔺" },
  ];

  // Token list
  const tokens = [
    { symbol: "MATIC", name: "Polygon", price: 0.89 },
    { symbol: "USDC", name: "USD Coin", price: 1.0 },
    { symbol: "USDT", name: "Tether", price: 1.0 },
    { symbol: "DAI", name: "DAI", price: 1.0 },
    { symbol: "WETH", name: "Wrapped ETH", price: 2150 },
    { symbol: "WBTC", name: "Wrapped BTC", price: 43250 },
    { symbol: "1INCH", name: "1inch", price: 0.42 },
  ];

  const fromTokenData = tokens.find((t) => t.symbol === fromToken) || tokens[0];
  const toTokenData = tokens.find((t) => t.symbol === toToken) || tokens[1];
  const currentRate = fromTokenData.price / toTokenData.price;
  const currentOutput = parseFloat(amount || "0") * currentRate;

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const handleCreateOrder = async () => {
    if (!isConnected || !signer) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const loadingToast = toast.loading("Creating order...");

    try {
      if (orderType === "stop-loss" || orderType === "both") {
        if (!stopPrice) {
          toast.error("Please enter a stop-loss price", { id: loadingToast });
          return;
        }

        // Map MATIC to WMATIC for the service
        let tokenForService = fromToken;
        if (fromToken === "MATIC") {
          tokenForService = "WMATIC";
        }

        const result = await createStopLossOrder({
          token: tokenForService,
          amount,
          stopPrice: parseFloat(stopPrice),
          signer,
        });

        // Save to localStorage
        const orders = JSON.parse(
          localStorage.getItem("stopLossOrders") || "[]"
        );
        orders.push({
          id: result.orderHash || Date.now().toString(),
          fromToken,
          toToken,
          amount,
          type: "stop-loss",
          triggerPrice: stopPrice,
          status: "active",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("stopLossOrders", JSON.stringify(orders));

        toast.success("Stop-loss order created! 🎉", { id: loadingToast });
      }

      if (orderType === "take-profit" || orderType === "both") {
        toast("Take-profit orders coming soon! 🚀", {
          id: orderType === "both" ? undefined : loadingToast,
          icon: "🚧",
        });
      }

      // Reset form
      setAmount("");
      setStopPrice("");
      setProfitPrice("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create order", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="card max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-3 text-center">
        Stop-Loss/Take-Profit Strategy
      </h2>

      {/* Order Type Selection */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={() => setOrderType("stop-loss")}
          className={`relative overflow-hidden rounded-lg p-2 transition-all duration-300 ${
            orderType === "stop-loss"
              ? "bg-gradient-to-br from-red-500/30 to-red-600/20 border border-red-500"
              : "bg-gray-800 border border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="text-xl">🔴</div>
          <div className="font-bold text-xs">Stop-Loss</div>
        </button>

        <button
          onClick={() => setOrderType("take-profit")}
          className={`relative overflow-hidden rounded-lg p-2 transition-all duration-300 ${
            orderType === "take-profit"
              ? "bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500"
              : "bg-gray-800 border border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="text-xl">🟢</div>
          <div className="font-bold text-xs">Take-Profit</div>
        </button>

        <button
          onClick={() => setOrderType("both")}
          className={`relative overflow-hidden rounded-lg p-2 transition-all duration-300 ${
            orderType === "both"
              ? "bg-gradient-to-br from-blue-500/30 to-purple-600/20 border border-blue-500"
              : "bg-gray-800 border border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="text-xl">🎯</div>
          <div className="font-bold text-xs">OCO</div>
        </button>
      </div>

      {/* Swap Interface */}
      <div className="space-y-2">
        {/* From Section */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-400">From</label>
            <select
              value={fromChain}
              onChange={(e) => setFromChain(e.target.value)}
              className="bg-gray-700 rounded px-2 py-0.5 text-xs"
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.icon} {chain.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-lg font-semibold outline-none"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-gray-700 rounded px-2 py-1 text-sm font-semibold"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ≈ ${(parseFloat(amount || "0") * fromTokenData.price).toFixed(2)}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center py-1">
          <button
            onClick={handleSwapTokens}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Section */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-400">To</label>
            <select
              value={toChain}
              onChange={(e) => setToChain(e.target.value)}
              className="bg-gray-700 rounded px-2 py-0.5 text-xs"
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.icon} {chain.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              value={currentOutput.toFixed(2)}
              readOnly
              className="flex-1 bg-transparent text-lg font-semibold outline-none text-gray-400"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-gray-700 rounded px-2 py-1 text-sm font-semibold"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Current rate: 1 {fromToken} = {currentRate.toFixed(4)} {toToken}
          </div>
        </div>

        {/* Cross-chain indicator */}
        {fromChain !== toChain && (
          <div className="text-xs text-center text-yellow-400 py-1">
            ⚡ Cross-chain swap via 1inch Fusion+
          </div>
        )}

        {/* Trigger Prices */}
        <div className="space-y-2 mt-2">
          {(orderType === "stop-loss" || orderType === "both") && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-20">🔴 Stop at:</span>
              <input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder={`${(currentRate * 0.9).toFixed(4)}`}
                className="flex-1 input-field text-xs py-1.5 border-red-500/50"
              />
              <span className="text-xs text-gray-400">
                {fromToken}/{toToken}
              </span>
            </div>
          )}

          {(orderType === "take-profit" || orderType === "both") && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-20">🟢 Profit at:</span>
              <input
                type="number"
                value={profitPrice}
                onChange={(e) => setProfitPrice(e.target.value)}
                placeholder={`${(currentRate * 1.1).toFixed(4)}`}
                className="flex-1 input-field text-xs py-1.5 border-green-500/50"
              />
              <span className="text-xs text-gray-400">
                {fromToken}/{toToken}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={!isConnected || isLoading || !amount}
        className={`w-full mt-3 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
          !isConnected || isLoading || !amount
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/30"
        }`}
      >
        {isLoading ? "Creating Order..." : "Create Protection Order"}
      </button>
    </div>
  );
};

export default OrderCreator;
