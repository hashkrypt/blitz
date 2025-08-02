// src/components/PortfolioStats.tsx
import React from "react";

const PortfolioStats: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-2xl p-3 border border-blue-500/20">
        <h3 className="text-gray-400 text-xs mb-1">Portfolio</h3>
        <p className="text-xl font-bold text-white">$45,234</p>
        <p className="text-xs text-green-400">+2.8%</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-2xl p-3 border border-purple-500/20">
        <h3 className="text-gray-400 text-xs mb-1">Active</h3>
        <p className="text-xl font-bold text-white">5</p>
        <p className="text-xs text-gray-400">Orders</p>
      </div>

      <div className="bg-gradient-to-br from-green-600/20 to-green-600/10 rounded-2xl p-3 border border-green-500/20">
        <h3 className="text-gray-400 text-xs mb-1">Saved</h3>
        <p className="text-xl font-bold text-white">$892</p>
        <p className="text-xs text-gray-400">24h</p>
      </div>
    </div>
  );
};

export default PortfolioStats;
