// src/components/TWAPStrategy.tsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { TWAPService } from "../services/TWAPService";

const TWAPStrategy: React.FC = () => {
  const { signer, isConnected } = useWallet();
  const [token, setToken] = useState("WMATIC");
  const [totalAmount, setTotalAmount] = useState("");
  const [chunks, setChunks] = useState("10");
  const [duration, setDuration] = useState("4"); // hours
  const [startDelay, setStartDelay] = useState("0"); // minutes
  const [preview, setPreview] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const tokens = [
    { symbol: "WMATIC", name: "Polygon", price: 0.89 },
    { symbol: "ETH", name: "Ethereum", price: 2150 },
    { symbol: "1INCH", name: "1inch", price: 0.42 },
    { symbol: "LINK", name: "Chainlink", price: 14.5 },
  ];

  // Calculate preview
  useEffect(() => {
    if (totalAmount && chunks && duration) {
      const chunkSize = parseFloat(totalAmount) / parseInt(chunks);
      const intervalMinutes = (parseFloat(duration) * 60) / parseInt(chunks);

      setPreview({
        chunkSize: chunkSize.toFixed(4),
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
      const twapService = new TWAPService();
      const result = await twapService.createTWAPOrder({
        signer,
        fromToken: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
        toToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
        totalAmount,
        chunks: parseInt(chunks),
        durationHours: parseFloat(duration),
        startDelay: parseInt(startDelay),
      });

      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem("twapOrders") || "[]");
      orders.push({
        ...result,
        tokenSymbol: token,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("twapOrders", JSON.stringify(orders));

      toast.success(
        `TWAP order created! ${chunks} orders over ${duration} hours`,
        { id: loadingToast, duration: 5000 }
      );

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
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Token to Buy
            </label>
            <select
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input-field"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol} - {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Total Amount
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.0"
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
          <h3 className="font-bold mb-4">Order Preview</h3>

          {preview ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-sm text-gray-400">Chunk Size</span>
                <span className="font-semibold">
                  {preview.chunkSize} {token}
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
      {orders.map((order, index) => (
        <div key={order.id} className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {order.totalAmount} {order.tokenSymbol}
              </p>
              <p className="text-sm text-gray-400">
                {order.executedChunks}/{order.chunks} executed
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-400">
                Every {(order.intervalSeconds / 60).toFixed(0)} min
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.startTime * 1000).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{
                width: `${(order.executedChunks / order.chunks) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TWAPStrategy;
