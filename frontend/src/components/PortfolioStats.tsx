// src/components/PortfolioStats.tsx
import React from "react";

const PortfolioStats: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-2xl p-4 border border-blue-500/20">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-400 text-xs">Portfolio Value</h3>
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-white">$45,234</p>
        <p className="text-xs text-green-400">+2.8%</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-2xl p-4 border border-purple-500/20">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-400 text-xs">Active Orders</h3>
          <svg
            className="w-4 h-4 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-white">5</p>
        <p className="text-xs text-gray-400">2 Stop, 3 Profit</p>
      </div>

      <div className="bg-gradient-to-br from-green-600/20 to-green-600/10 rounded-2xl p-4 border border-green-500/20">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-400 text-xs">24h Saved</h3>
          <svg
            className="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold text-white">$892</p>
        <p className="text-xs text-gray-400">12 executed</p>
      </div>
    </div>
  );
};

export default PortfolioStats;
