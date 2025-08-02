import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ActiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const saved = localStorage.getItem("stopLossOrders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const cancelOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    localStorage.setItem("stopLossOrders", JSON.stringify(updated));
    setOrders(updated);
    toast.success("Order cancelled");
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Active Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No active orders</p>
          <p className="text-sm text-gray-500">
            Create your first protection order above
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    order.type === "stop-loss" ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                <div>
                  <p className="font-semibold">
                    {order.amount} {order.token}
                  </p>
                  <p className="text-sm text-gray-400">
                    {order.type === "stop-loss" ? "Stop at" : "Take profit at"}{" "}
                    ${order.triggerPrice}
                  </p>
                </div>
              </div>
              <button
                onClick={() => cancelOrder(order.id)}
                className="text-red-400 hover:text-red-300"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
