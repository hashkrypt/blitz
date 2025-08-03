import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Order {
  id: string;
  fromToken: string;
  toToken: string;
  fromChain?: string;
  toChain?: string;
  amount: string;
  type: "stop-loss" | "take-profit";
  triggerPrice: string;
  currentPrice?: string;
  status: string;
  createdAt: string;
  strategy?: string;
}

const ActiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();

    // Listen for new orders
    const handleOrderCreated = (event: CustomEvent) => {
      loadOrders(); // Reload orders when a new one is created
      toast.success(`New ${event.detail.type} order added to Active Orders! 📋`);
    };

    window.addEventListener('orderCreated', handleOrderCreated as EventListener);

    return () => {
      window.removeEventListener('orderCreated', handleOrderCreated as EventListener);
    };
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
          <div key={order.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">
                    {order.type === "stop-loss" ? "🔴" : "🟢"}
                  </span>
                  <span className="font-semibold">
                    {order.amount} {order.fromToken} → {order.toToken}
                  </span>
                  <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full">
                    {order.type.toUpperCase()}
                  </span>
                  {order.strategy && (
                    <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full">
                      {order.strategy}
                    </span>
                  )}
                </div>
                
                {/* Chain Information */}
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

                <div className="text-sm text-gray-400 mb-1">
                  Trigger: {order.triggerPrice} {order.fromToken}/{order.toToken}
                  {order.currentPrice && (
                    <span className="ml-2 text-gray-500">
                      (Current: {order.currentPrice})
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>ID: {order.id}</span>
                  <span>Created: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400">Active</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => cancelOrder(order.id)}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
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
