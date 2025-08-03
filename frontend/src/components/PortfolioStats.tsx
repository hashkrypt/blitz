// src/components/PortfolioStats.tsx
import React, { useState, useEffect } from "react";

const PortfolioStats: React.FC = () => {
  const [stats, setStats] = useState({
    portfolioValue: 15420.50,
    portfolioChange: 3.2,
    activeOrders: 0,
    savedAmount: 0
  });

  const loadOrders = () => {
    const savedOrders = localStorage.getItem("stopLossOrders");
    if (savedOrders) {
      const orderList = JSON.parse(savedOrders);
      
      // Calculate portfolio stats based on orders
      const activeOrderCount = orderList.filter((order: any) => order.status === 'active').length;
      
      // Calculate total value in orders (using USDC base values)
      let totalOrderValue = 0;
      let totalSaved = 0;
      
      orderList.forEach((order: any) => {
        if (order.status === 'active') {
          const amount = parseFloat(order.amount || "0");
          
          // For Base USDC orders, amount is directly in USD
          if (order.fromToken === 'USDC') {
            totalOrderValue += amount;
          }
          // For XLM, convert to USD (XLM price = $0.3890)
          else if (order.fromToken === 'XLM') {
            totalOrderValue += amount * 0.3890;
          }
          
          // Calculate protected value for stop-loss orders
          if (order.type === 'stop-loss') {
            // For stop-loss orders, the protected value is the order amount
            if (order.fromToken === 'USDC') {
              totalSaved += amount;
            } else if (order.fromToken === 'XLM') {
              totalSaved += amount * 0.3890; // Convert XLM to USD
            }
          }
        }
      });
      
      setStats({
        portfolioValue: 15420.50 + totalOrderValue,
        portfolioChange: 3.2,
        activeOrders: activeOrderCount,
        savedAmount: totalSaved // Total value protected by stop-loss orders
      });
    }
  };

  useEffect(() => {
    loadOrders();

    // Listen for new orders
    const handleOrderCreated = () => {
      loadOrders();
    };

    window.addEventListener('orderCreated', handleOrderCreated);

    // Refresh every 10 seconds to simulate live updates
    const interval = setInterval(loadOrders, 10000);

    return () => {
      window.removeEventListener('orderCreated', handleOrderCreated);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-2xl p-3 border border-blue-500/20">
        <h3 className="text-gray-400 text-xs mb-1">Portfolio Value</h3>
        <p className="text-xl font-bold text-white">
          ${stats.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-green-400">+{stats.portfolioChange}%</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-2xl p-3 border border-purple-500/20">
        <h3 className="text-gray-400 text-xs mb-1">Active Orders</h3>
        <p className="text-xl font-bold text-white">{stats.activeOrders}</p>
        <p className="text-xs text-gray-400">
          {stats.activeOrders === 1 ? 'Order' : 'Orders'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-600/20 to-green-600/10 rounded-2xl p-3 border border-green-500/20">
        <h3 className="text-gray-400 text-xs mb-1">Protected Value</h3>
        <p className="text-xl font-bold text-white">
          ${stats.savedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-400">Stop-loss</p>
      </div>
    </div>
  );
};

export default PortfolioStats;
