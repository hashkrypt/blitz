// src/components/TWAPStrategy.tsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";

const TWAPStrategy: React.FC = () => {
  const { signer, isConnected } = useWallet();
  const [fromChain, setFromChain] = useState("ethereum");
  const [toChain, setToChain] = useState("solana");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("SOL");
  const [totalAmount, setTotalAmount] = useState("");
  const [chunks, setChunks] = useState("10");
  const [duration, setDuration] = useState("4"); // hours
  const [startDelay, setStartDelay] = useState("0"); // minutes
  const [preview, setPreview] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const tokens = [
    { symbol: "1INCH", name: "1inch", price: 0.42 },
    { symbol: "AAVE", name: "Aave", price: 95 },
    { symbol: "ADA", name: "Cardano", price: 0.38, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "AGIX", name: "SingularityNET", price: 0.21 },
    { symbol: "ALGO", name: "Algorand", price: 0.16 },
    { symbol: "ALPHA", name: "Alpha Finance", price: 0.089 },
    { symbol: "APT", name: "Aptos", price: 8.9, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "ARB", name: "Arbitrum", price: 0.85 },
    { symbol: "ATOM", name: "Cosmos", price: 9.8, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "AUTO", name: "Auto", price: 285 },
    { symbol: "AVAX", name: "Avalanche", price: 35 },
    { symbol: "AXS", name: "Axie Infinity", price: 5.8 },
    { symbol: "BAL", name: "Balancer", price: 2.8 },
    { symbol: "BCH", name: "Bitcoin Cash", price: 245, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "BNB", name: "BNB", price: 310 },
    { symbol: "BTC", name: "Bitcoin", price: 43250, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "BUSD", name: "Binance USD", price: 1.0 },
    { symbol: "CAKE", name: "PancakeSwap", price: 1.9 },
    { symbol: "COMP", name: "Compound", price: 58 },
    { symbol: "CRO", name: "Cronos", price: 0.085 },
    { symbol: "CRV", name: "Curve DAO", price: 0.62 },
    { symbol: "CVX", name: "Convex Finance", price: 2.3 },
    { symbol: "DAI", name: "DAI", price: 1.0 },
    { symbol: "DASH", name: "Dash", price: 32 },
    { symbol: "DOGE", name: "Dogecoin", price: 0.078, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "DOT", name: "Polkadot", price: 6.5, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "ENJ", name: "Enjin Coin", price: 0.18 },
    { symbol: "EOS", name: "EOS", price: 0.58, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "ETH", name: "Ethereum", price: 2150 },
    { symbol: "FET", name: "Fetch.ai", price: 0.28 },
    { symbol: "FIL", name: "Filecoin", price: 4.2 },
    { symbol: "FLOKI", name: "Floki", price: 0.000028 },
    { symbol: "FRAX", name: "Frax", price: 1.0 },
    { symbol: "FTT", name: "FTX Token", price: 1.2 },
    { symbol: "GALA", name: "Gala", price: 0.022 },
    { symbol: "GOLD", name: "Gold Token", price: 65 },
    { symbol: "GRT", name: "The Graph", price: 0.12 },
    { symbol: "HT", name: "Huobi Token", price: 2.1 },
    { symbol: "ICP", name: "Internet Computer", price: 12.5, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "IMX", name: "Immutable X", price: 1.4 },
    { symbol: "IOTA", name: "IOTA", price: 0.18 },
    { symbol: "LDO", name: "Lido DAO", price: 1.9 },
    { symbol: "LINK", name: "Chainlink", price: 14.5 },
    { symbol: "LRC", name: "Loopring", price: 0.23 },
    { symbol: "LTC", name: "Litecoin", price: 73, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "MANA", name: "Decentraland", price: 0.38 },
    { symbol: "MATIC", name: "Polygon", price: 0.89 },
    { symbol: "MKR", name: "Maker", price: 1450 },
    { symbol: "MONAD", name: "Monad", price: 15, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "NEAR", name: "NEAR Protocol", price: 1.85, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "NEO", name: "Neo", price: 12 },
    { symbol: "OCEAN", name: "Ocean Protocol", price: 0.42 },
    { symbol: "OKB", name: "OKB", price: 45 },
    { symbol: "OP", name: "Optimism", price: 1.6 },
    { symbol: "PEPE", name: "Pepe", price: 0.000000012 },
    { symbol: "RWA", name: "Real World Assets", price: 0.25 },
    { symbol: "SAND", name: "The Sandbox", price: 0.32 },
    { symbol: "SHIB", name: "Shiba Inu", price: 0.0000089 },
    { symbol: "SNX", name: "Synthetix", price: 2.1 },
    { symbol: "SOL", name: "Solana", price: 98 },
    { symbol: "STRK", name: "Starknet", price: 0.45, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "SUI", name: "Sui", price: 1.75, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "SUSHI", name: "SushiSwap", price: 0.78 },
    { symbol: "THETA", name: "Theta Network", price: 0.95 },
    { symbol: "TON", name: "TON", price: 2.2, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "TRX", name: "TRON", price: 0.105, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "TUSD", name: "TrueUSD", price: 1.0 },
    { symbol: "UNI", name: "Uniswap", price: 6.8 },
    { symbol: "USDC", name: "USD Coin", price: 1.0 },
    { symbol: "USDT", name: "Tether", price: 1.0 },
    { symbol: "VET", name: "VeChain", price: 0.025 },
    { symbol: "WBTC", name: "Wrapped BTC", price: 43250 },
    { symbol: "WETH", name: "Wrapped ETH", price: 2150 },
    { symbol: "XLM", name: "Stellar Lumens", price: 0.3890, fusion: "priority" }, // 🥇 Priority Fusion+
    { symbol: "XMR", name: "Monero", price: 158 },
    { symbol: "XRP", name: "XRP", price: 0.52, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "XTZ", name: "Tezos", price: 0.68, fusion: "standard" }, // 🥈 Standard Fusion+
    { symbol: "YFI", name: "yearn.finance", price: 6200 },
    { symbol: "ZEC", name: "Zcash", price: 28 },
  ].sort((a, b) => a.symbol.localeCompare(b.symbol));

  // Calculate preview
  useEffect(() => {
    if (totalAmount && chunks && duration) {
      const chunkSize = parseFloat(totalAmount) / parseInt(chunks);
      const intervalMinutes = (parseFloat(duration) * 60) / parseInt(chunks);

      setPreview({
        chunkSize: chunkSize.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        intervalMinutes: intervalMinutes.toFixed(1),
        totalTime: duration,
        priceImpactReduction: Math.min(parseInt(chunks) * 10, 85), // Rough estimate
      });
    }
  }, [totalAmount, chunks, duration]);

  const handleCreateTWAP = async () => {
    if (!isConnected || !signer) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsCreating(true);
    const loadingToast = toast.loading("Creating TWAP order...");

    try {
      // For demo purposes, create fake TWAP order
      const twapOrder = {
        id: `TWAP-${Date.now()}`,
        fromToken,
        toToken,
        fromChain,
        toChain,
        totalAmount,
        chunks: parseInt(chunks),
        executedChunks: 0,
        durationHours: parseFloat(duration),
        intervalSeconds: (parseFloat(duration) * 3600) / parseInt(chunks),
        startTime: Date.now() / 1000 + parseInt(startDelay) * 60,
        status: "active",
        type: "twap",
        strategy: "twap",
        createdAt: new Date().toISOString(),
        chunkSize: (parseFloat(totalAmount) / parseInt(chunks)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      };

      // Save to both TWAP orders and general orders
      const twapOrders = JSON.parse(localStorage.getItem("twapOrders") || "[]");
      twapOrders.push(twapOrder);
      localStorage.setItem("twapOrders", JSON.stringify(twapOrders));

      const allOrders = JSON.parse(localStorage.getItem("stopLossOrders") || "[]");
      allOrders.push(twapOrder);
      localStorage.setItem("stopLossOrders", JSON.stringify(allOrders));

      // Emit event for dashboard update
      window.dispatchEvent(new CustomEvent('orderCreated', { detail: twapOrder }));

      toast.success(
        `TWAP order created! ${chunks} chunks over ${duration} hours 📈`,
        { id: loadingToast, duration: 5000 }
      );

      // Show cross-chain message if applicable
      if (fromChain !== toChain) {
        setTimeout(() => {
          toast.success(`Cross-chain TWAP: ${fromChain} → ${toChain} 🌉`, {
            duration: 5000,
          });
        }, 1000);
      }

      // Reset form
      setTotalAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create TWAP order", {
        id: loadingToast,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">TWAP Order</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">
            Time-Weighted Average Price
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Configuration */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                From Chain
              </label>
              <select
                value={fromChain}
                onChange={(e) => setFromChain(e.target.value)}
                className="input-field text-sm"
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                To Chain
              </label>
              <select
                value={toChain}
                onChange={(e) => setToChain(e.target.value)}
                className="input-field text-sm"
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                From Token
              </label>
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="input-field"
              >
                {tokens.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                To Token
              </label>
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="input-field"
              >
                {tokens.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Total Amount
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.00"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Split Into Chunks
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["5", "10", "20", "50"].map((num) => (
                <button
                  key={num}
                  onClick={() => setChunks(num)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    chunks === num
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Time Period (hours)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["1", "4", "12", "24"].map((hour) => (
                <button
                  key={hour}
                  onClick={() => setDuration(hour)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    duration === hour
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {hour}h
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Start Time
            </label>
            <select
              value={startDelay}
              onChange={(e) => setStartDelay(e.target.value)}
              className="input-field"
            >
              <option value="0">Immediately</option>
              <option value="60">In 1 hour</option>
              <option value="240">In 4 hours</option>
              <option value="1440">Tomorrow</option>
            </select>
          </div>
        </div>

        {/* Right side - Preview */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Order Preview</h3>
            {fromChain !== toChain && (
              <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full">
                ⚡ Cross-chain
              </span>
            )}
          </div>

          {preview ? (
            <div className="space-y-4">
              <div className="p-3 bg-gray-900 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Trading Pair</span>
                  <span className="font-semibold">
                    {fromToken} → {toToken}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{fromChain} → {toChain}</span>
                  <span>TWAP Strategy</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-sm text-gray-400">Chunk Size</span>
                <span className="font-semibold">
                  {preview.chunkSize} {fromToken}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-sm text-gray-400">
                  Execution Interval
                </span>
                <span className="font-semibold">
                  Every {preview.intervalMinutes} minutes
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-sm text-gray-400">Total Duration</span>
                <span className="font-semibold">{preview.totalTime} hours</span>
              </div>

              <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-400">
                    Price Impact Reduction
                  </span>
                  <span className="text-lg font-bold text-green-400">
                    ~{preview.priceImpactReduction}%
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">
                  Execution Timeline:
                </p>
                <div className="space-y-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 text-xs"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>
                        Order {i + 1}:{" "}
                        {new Date(
                          Date.now() + i * preview.intervalMinutes * 60000
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {parseInt(chunks) > 3 && (
                    <div className="text-xs text-gray-500 ml-4">
                      ... and {parseInt(chunks) - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Enter order details to see preview
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleCreateTWAP}
        disabled={!isConnected || isCreating || !totalAmount}
        className={`w-full mt-6 py-3 rounded-xl font-bold transition-all duration-300 ${
          !isConnected || isCreating || !totalAmount
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30"
        }`}
      >
        {isCreating ? "Creating TWAP Order..." : "Create TWAP Order"}
      </button>

      {/* Active TWAP Orders */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Active TWAP Orders</h3>
        <TWAPOrdersList />
      </div>
    </div>
  );
};

// Component to show active TWAP orders
const TWAPOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const saved = localStorage.getItem("twapOrders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <p className="text-gray-400">No active TWAP orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📈</span>
                <span className="font-semibold">
                  {parseFloat(order.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fromToken} → {order.toToken}
                </span>
                <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full">
                  TWAP
                </span>
              </div>
              
              {order.fromChain && order.toChain && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-gray-500">Route:</span>
                  <span className="text-xs text-blue-400 capitalize">{order.fromChain}</span>
                  <span className="text-xs text-gray-500">→</span>
                  <span className="text-xs text-green-400 capitalize">{order.toChain}</span>
                  {order.fromChain !== order.toChain && (
                    <span className="text-xs text-yellow-400">⚡ Cross-chain</span>
                  )}
                </div>
              )}

              <div className="text-sm text-gray-400">
                {order.executedChunks || 0}/{order.chunks} chunks executed
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-purple-400">
                Every {Math.round((order.intervalSeconds || 0) / 60)} min
              </p>
              <p className="text-xs text-gray-500">
                {order.startTime ? new Date(order.startTime * 1000).toLocaleTimeString() : 'Starting soon'}
              </p>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{
                width: `${((order.executedChunks || 0) / order.chunks) * 100}%`,
              }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>ID: {order.id}</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-400">Running</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TWAPStrategy;
