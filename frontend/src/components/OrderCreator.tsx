import React, { useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { useStopLoss } from "../hooks/useStopLoss";

type OrderType = "stop-loss" | "take-profit" | "both";

const OrderCreator: React.FC = () => {
  const { signer, isConnected } = useWallet();
  const { createStopLossOrder, isLoading } = useStopLoss();

  const [selectedStrategy, setSelectedStrategy] = useState("stop-loss");
  const [orderType, setOrderType] = useState<OrderType>("both");
  const [fromChain, setFromChain] = useState("polygon");
  const [toChain, setToChain] = useState("polygon");
  const [fromToken, setFromToken] = useState("MATIC");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [profitPrice, setProfitPrice] = useState("");

  // All strategies list with descriptions
  const strategies = [
    {
      id: "stop-loss",
      name: "Stop-Loss/Take-Profit",
      icon: "🛡️",
      description: "Protect your assets from losses and lock in profits",
      implemented: true,
    },
    {
      id: "twap",
      name: "TWAP",
      icon: "⏱️",
      description: "Execute large orders over time to minimize price impact",
      implemented: true,
    },
    {
      id: "grid",
      name: "Grid Trading",
      icon: "🎯",
      description:
        "Profit from market volatility with automated buy/sell orders",
      implemented: false,
    },
    {
      id: "dca",
      name: "DCA (Dollar Cost Average)",
      icon: "💵",
      description: "Invest fixed amounts at regular intervals",
      implemented: false,
    },
    {
      id: "trailing",
      name: "Trailing Stop-Loss",
      icon: "📈",
      description: "Stop-loss that follows price upward to lock in profits",
      implemented: false,
    },
    {
      id: "iceberg",
      name: "Iceberg Orders",
      icon: "🧊",
      description: "Hide large order sizes to minimize market impact",
      implemented: false,
    },
    {
      id: "bracket",
      name: "Bracket Orders",
      icon: "🎯",
      description:
        "Complete trade setup with entry, stop-loss, and take-profit",
      implemented: false,
    },
    {
      id: "conditional",
      name: "If-Then Orders",
      icon: "🔄",
      description: "Execute orders based on specific conditions",
      implemented: false,
    },
    {
      id: "vwap",
      name: "VWAP",
      icon: "📊",
      description: "Trade based on volume-weighted average price",
      implemented: false,
    },
    {
      id: "momentum",
      name: "Momentum Trading",
      icon: "🚀",
      description: "Catch breakouts and trend reversals automatically",
      implemented: false,
    },
    {
      id: "mean-reversion",
      name: "Mean Reversion",
      icon: "📉",
      description: "Trade when price deviates from moving average",
      implemented: false,
    },
    {
      id: "range",
      name: "Range Orders",
      icon: "📏",
      description: "Buy within a specific price range over time",
      implemented: false,
    },
    {
      id: "scale",
      name: "Scale In/Out",
      icon: "📈",
      description: "Enter or exit positions at multiple price levels",
      implemented: false,
    },
    {
      id: "arbitrage",
      name: "Arbitrage Protection",
      icon: "⚡",
      description: "Capture price differences across DEXs",
      implemented: false,
    },
    {
      id: "flash",
      name: "Flash Crash Protection",
      icon: "💥",
      description: "Buy during extreme market events",
      implemented: false,
    },
  ];

  // All chains
  const chains = [
    // From the images
    { id: "solana", name: "Solana", icon: "☀️", category: "new" },
    { id: "ethereum", name: "Ethereum", icon: "Ξ", category: "mainnet" },
    { id: "unichain", name: "Unichain", icon: "🦄", category: "l2" },
    { id: "optimism", name: "Optimism", icon: "🔴", category: "l2" },
    { id: "arbitrum", name: "Arbitrum", icon: "🔵", category: "l2" },
    { id: "zksync", name: "zkSync Era", icon: "⚡", category: "l2" },
    { id: "base", name: "Base", icon: "🔵", category: "l2" },
    { id: "linea", name: "Linea", icon: "🟡", category: "l2" },
    { id: "bnb", name: "BNB Chain", icon: "🟡", category: "mainnet" },
    { id: "sonic", name: "Sonic", icon: "⚡", category: "mainnet" },
    { id: "polygon", name: "Polygon", icon: "🟣", category: "mainnet" },
    { id: "gnosis", name: "Gnosis", icon: "🦉", category: "mainnet" },
    { id: "avalanche", name: "Avalanche", icon: "🔺", category: "mainnet" },

    // Priority Fusion+ Chains
    { id: "aptos", name: "Aptos", icon: "🅰️", category: "fusion-priority" },
    { id: "bitcoin", name: "Bitcoin", icon: "₿", category: "fusion-priority" },
    { id: "cosmos", name: "Cosmos", icon: "⚛️", category: "fusion-priority" },
    { id: "near", name: "NEAR", icon: "🌐", category: "fusion-priority" },
    { id: "sui", name: "Sui", icon: "💧", category: "fusion-priority" },
    { id: "tron", name: "Tron", icon: "🎯", category: "fusion-priority" },
    { id: "stellar", name: "Stellar", icon: "✨", category: "fusion-priority" },

    // Standard Fusion+ Chains
    { id: "ton", name: "TON", icon: "💎", category: "fusion-standard" },
    { id: "monad", name: "Monad", icon: "🟣", category: "fusion-standard" },
    {
      id: "starknet",
      name: "Starknet",
      icon: "🌟",
      category: "fusion-standard",
    },
    { id: "cardano", name: "Cardano", icon: "🔷", category: "fusion-standard" },
    { id: "xrp", name: "XRP Ledger", icon: "🌊", category: "fusion-standard" },
    {
      id: "icp",
      name: "Internet Computer",
      icon: "🖥️",
      category: "fusion-standard",
    },
    { id: "tezos", name: "Tezos", icon: "🔵", category: "fusion-standard" },
    {
      id: "polkadot",
      name: "Polkadot",
      icon: "⚪",
      category: "fusion-standard",
    },
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

  const handleStrategyChange = (strategyId: string) => {
    const strategy = strategies.find((s) => s.id === strategyId);
    if (strategy?.implemented) {
      setSelectedStrategy(strategyId);
    } else {
      toast("This strategy is coming soon!", {
        icon: "🚧",
        duration: 3000,
      });
    }
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

  // Render strategy selector dropdown
  const renderStrategySelector = () => (
    <div className="mb-4 p-3 bg-gray-800 rounded-lg max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">Select Strategy:</label>
        <div className="relative">
          <select
            value={selectedStrategy}
            onChange={(e) => handleStrategyChange(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2 pr-10 appearance-none cursor-pointer hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {strategies.map((strategy) => (
              <option
                key={strategy.id}
                value={strategy.id}
                disabled={!strategy.implemented}
                className={!strategy.implemented ? "text-gray-500" : ""}
              >
                {strategy.icon} {strategy.name}{" "}
                {!strategy.implemented && "(Coming Soon)"}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // If TWAP strategy is selected, show TWAP component
  if (selectedStrategy === "twap") {
    // Import TWAPStrategy dynamically to avoid circular dependencies
    const TWAPStrategy = React.lazy(() => import("./TWAPStrategy"));

    return (
      <div className="w-full">
        {renderStrategySelector()}
        <React.Suspense
          fallback={<div className="text-center">Loading TWAP...</div>}
        >
          <TWAPStrategy />
        </React.Suspense>
      </div>
    );
  }

  // Coming soon placeholder for unimplemented strategies
  const strategy = strategies.find((s) => s.id === selectedStrategy);
  if (!strategy?.implemented) {
    return (
      <div className="w-full">
        {renderStrategySelector()}

        <div className="card max-w-xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">{strategy?.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{strategy?.name}</h2>
          <p className="text-gray-400 mb-6">{strategy?.description}</p>
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-400">
              🚧 This strategy is coming soon! Currently in development.
            </p>
          </div>
          <button
            onClick={() => setSelectedStrategy("stop-loss")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Try Stop-Loss/Take-Profit Instead
          </button>
        </div>
      </div>
    );
  }

  // Default Stop-Loss/Take-Profit form
  return (
    <div className="card max-w-xl mx-auto">
      {renderStrategySelector()}

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
              <optgroup label="Popular Networks">
                {chains
                  .filter((c) =>
                    [
                      "ethereum",
                      "polygon",
                      "arbitrum",
                      "optimism",
                      "base",
                      "solana",
                    ].includes(c.id)
                  )
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Layer 2">
                {chains
                  .filter(
                    (c) =>
                      c.category === "l2" &&
                      !["arbitrum", "optimism", "base"].includes(c.id)
                  )
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name} L2
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Mainnets">
                {chains
                  .filter(
                    (c) =>
                      c.category === "mainnet" &&
                      !["ethereum", "polygon"].includes(c.id)
                  )
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Fusion+ Priority">
                {chains
                  .filter((c) => c.category === "fusion-priority")
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name} ⚡
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Fusion+">
                {chains
                  .filter((c) => c.category === "fusion-standard")
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
              </optgroup>
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
              <optgroup label="Popular Networks">
                {chains
                  .filter((c) =>
                    [
                      "ethereum",
                      "polygon",
                      "arbitrum",
                      "optimism",
                      "base",
                      "solana",
                    ].includes(c.id)
                  )
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Layer 2">
                {chains
                  .filter(
                    (c) =>
                      c.category === "l2" &&
                      !["arbitrum", "optimism", "base"].includes(c.id)
                  )
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name} L2
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Mainnets">
                {chains
                  .filter(
                    (c) =>
                      c.category === "mainnet" &&
                      !["ethereum", "polygon"].includes(c.id)
                  )
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Fusion+ Priority">
                {chains
                  .filter((c) => c.category === "fusion-priority")
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name} ⚡
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Fusion+">
                {chains
                  .filter((c) => c.category === "fusion-standard")
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
              </optgroup>
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
          <div className="text-xs text-center py-1">
            {chains
              .find((c) => c.id === fromChain)
              ?.category?.includes("fusion") ||
            chains
              .find((c) => c.id === toChain)
              ?.category?.includes("fusion") ? (
              <span className="text-yellow-400">
                ⚡ Cross-chain swap via 1inch Fusion+
              </span>
            ) : (
              <span className="text-blue-400">
                🌉 Cross-chain swap available
              </span>
            )}
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
