import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Order {
  id: string;
  fromToken: string;
  toToken: string;
  amount: string;
  type: "stop-loss" | "take-profit";
  triggerPrice: string;
  status: string;
  createdAt: string;
}

const ActiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem("stopLossOrders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  };

  const cancelOrder = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    localStorage.setItem("stopLossOrders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    toast.success("Order cancelled");
  };

  if (orders.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-bold mb-2">No Active Orders</h3>
        <p className="text-gray-400">
          Create your first stop-loss order to protect your assets
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Active Orders</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`text-xl ${
                      order.type === "stop-loss" ? "🔴" : "🟢"
                    }`}
                  ></span>
                  <span className="font-semibold">
                    {order.amount} {order.fromToken} → {order.toToken}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Trigger: {order.triggerPrice} {order.fromToken}/
                  {order.toToken}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => cancelOrder(order.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveOrders;
