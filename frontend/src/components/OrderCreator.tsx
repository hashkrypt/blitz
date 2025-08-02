import React, { useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { useStopLoss } from "../hooks/useStopLoss";

type OrderType = "stop-loss" | "take-profit" | "both";

const OrderCreator: React.FC = () => {
  const { address, signer, connectWallet, isConnected } = useWallet();
  const { createStopLossOrder, isLoading } = useStopLoss();

  const [orderType, setOrderType] = useState<OrderType>("both");
  const [token, setToken] = useState("WMATIC");
  const [amount, setAmount] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [profitPrice, setProfitPrice] = useState("");

  const currentPrice = 0.89;

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

        const result = await createStopLossOrder({
          token,
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
          token,
          amount,
          type: "stop-loss",
          triggerPrice: stopPrice,
          status: "active",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("stopLossOrders", JSON.stringify(orders));

        toast.success("Stop-loss order created successfully! 🎉", {
          id: loadingToast,
        });
      }

      if (orderType === "take-profit" || orderType === "both") {
        toast("Take-profit orders coming soon! 🚀", {
          id: loadingToast,
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
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Create Protection Order</h2>

      {/* Order Type Selection */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => setOrderType("stop-loss")}
          className={`relative overflow-hidden rounded-xl p-3 transition-all duration-300 ${
            orderType === "stop-loss"
              ? "bg-gradient-to-br from-red-500/30 to-red-600/20 border-2 border-red-500"
              : "bg-gray-800 border-2 border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="text-2xl mb-1">🔴</div>
          <div className="font-bold text-sm">Stop-Loss</div>
          <div className="text-xs text-gray-400">Limit losses</div>
        </button>

        <button
          onClick={() => setOrderType("take-profit")}
          className={`relative overflow-hidden rounded-xl p-3 transition-all duration-300 ${
            orderType === "take-profit"
              ? "bg-gradient-to-br from-green-500/30 to-green-600/20 border-2 border-green-500"
              : "bg-gray-800 border-2 border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="text-2xl mb-1">🟢</div>
          <div className="font-bold text-sm">Take-Profit</div>
          <div className="text-xs text-gray-400">Lock gains</div>
        </button>

        <button
          onClick={() => setOrderType("both")}
          className={`relative overflow-hidden rounded-xl p-3 transition-all duration-300 ${
            orderType === "both"
              ? "bg-gradient-to-br from-blue-500/30 to-purple-600/20 border-2 border-blue-500"
              : "bg-gray-800 border-2 border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="text-2xl mb-1">🎯</div>
          <div className="font-bold text-sm">OCO Order</div>
          <div className="text-xs text-gray-400">Full protection</div>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Select Token
          </label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="input-field text-sm py-2"
          >
            <option value="WMATIC">MATIC</option>
            <option value="ETH">ETH</option>
            <option value="WBTC">WBTC</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="input-field text-sm py-2 pr-16"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400 text-sm">
                {token.replace("W", "")}
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              ≈ ${(parseFloat(amount || "0") * currentPrice).toFixed(2)} USD
            </span>
            <span className="text-xs text-gray-500">
              Current: ${currentPrice}
            </span>
          </div>
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(orderType === "stop-loss" || orderType === "both") && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                🔴 Stop-Loss Price
              </label>
              <input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder={`${(currentPrice * 0.9).toFixed(2)}`}
                className="input-field text-sm py-2 border-red-500/50 focus:border-red-500 focus:ring-red-500"
              />
              {stopPrice && (
                <div className="mt-1 text-xs text-red-400">
                  {(
                    ((parseFloat(stopPrice) - currentPrice) / currentPrice) *
                    100
                  ).toFixed(1)}
                  % from current
                </div>
              )}
            </div>
          )}

          {(orderType === "take-profit" || orderType === "both") && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                🟢 Take-Profit Price
              </label>
              <input
                type="number"
                value={profitPrice}
                onChange={(e) => setProfitPrice(e.target.value)}
                placeholder={`${(currentPrice * 1.1).toFixed(2)}`}
                className="input-field text-sm py-2 border-green-500/50 focus:border-green-500 focus:ring-green-500"
              />
              {profitPrice && (
                <div className="mt-1 text-xs text-green-400">
                  +
                  {(
                    ((parseFloat(profitPrice) - currentPrice) / currentPrice) *
                    100
                  ).toFixed(1)}
                  % from current
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={!isConnected || isLoading || !amount}
        className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
          !isConnected || isLoading || !amount
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/30"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-3">
            <svg
              className="animate-spin h-5 w-5"
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
            <span>Creating Order...</span>
          </span>
        ) : (
          "Create Protection Order"
        )}
      </button>
    </div>
  );
};

export default OrderCreator;
