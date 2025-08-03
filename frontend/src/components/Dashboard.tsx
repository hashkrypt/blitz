import React, { useState } from "react";
import OrderCreator from "./OrderCreator";
import ActiveOrders from "./ActiveOrders";
import PortfolioStats from "./PortfolioStats";
import OneInchDashboard from "./OneInchDashboard";
import TWAPStrategy from "./TWAPStrategy";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "twap" | "manage" | "dashboard"
  >("create");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <PortfolioStats />

      <div className="flex flex-col items-center">
        <div className="bg-gray-900 rounded-2xl p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab("create")}
            className={`py-2 px-6 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "create"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Stop-Loss/Take-Profit
          </button>
          <button
            onClick={() => setActiveTab("twap")}
            className={`py-2 px-6 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "twap"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            TWAP
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`py-2 px-6 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "manage"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-2 px-6 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </button>
        </div>

        <div
          className={
            activeTab === "dashboard" || activeTab === "twap"
              ? "w-full"
              : "w-full max-w-2xl"
          }
        >
          {activeTab === "create" && <OrderCreator />}
          {activeTab === "twap" && <TWAPStrategy />}
          {activeTab === "manage" && <ActiveOrders />}
          {activeTab === "dashboard" && <OneInchDashboard />}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
