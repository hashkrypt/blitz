// src/components/Dashboard.tsx
import React, { useState } from "react";
import OrderCreator from "./OrderCreator";
import ActiveOrders from "./ActiveOrders";
import PortfolioStats from "./PortfolioStats";
import OneInchDashboard from "./OneInchDashboard";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "manage" | "analytics">(
    "create"
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <PortfolioStats />

      {/* Centered content */}
      <div className="flex flex-col items-center">
        {/* Tab switcher */}
        <div className="bg-gray-900 rounded-2xl p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab("create")}
            className={`py-2 px-6 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "create"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Create Order
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
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-6 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Content area */}
        <div
          className={activeTab === "analytics" ? "w-full" : "w-full max-w-2xl"}
        >
          {activeTab === "create" && <OrderCreator />}
          {activeTab === "manage" && <ActiveOrders />}
          {activeTab === "analytics" && <OneInchDashboard />}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
