import React, { useState } from "react";
import OrderCreator from "./OrderCreator";
import ActiveOrders from "./ActiveOrders";
import PortfolioStats from "./PortfolioStats";
import OneInchDashboard from "./OneInchDashboard";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"place" | "manage" | "dashboard">(
    "place"
  );

  return (
    <>
      {/* Background 1inch Logo - Absolute positioning */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12">
          <img
            src="/logos/1inch_color_white.svg"
            alt=""
            className="w-[800px] h-[800px]"
            style={{
              opacity: 0.05,
              filter: "brightness(2) invert(1)",
            }}
          />
        </div>

        {/* Additional smaller logos for depth */}
        <div className="absolute top-20 right-20">
          <img
            src="/logos/1inch_without_text_white.svg"
            alt=""
            className="w-32 h-32"
            style={{
              opacity: 0.03,
              filter: "brightness(2) invert(1)",
            }}
          />
        </div>

        <div className="absolute bottom-20 left-20 rotate-45">
          <img
            src="/logos/1inch_without_text_white.svg"
            alt=""
            className="w-24 h-24"
            style={{
              opacity: 0.03,
              filter: "brightness(2) invert(1)",
            }}
          />
        </div>
      </div>

      {/* Main Content - Relative positioning to stay above background */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <PortfolioStats />

        <div className="flex flex-col items-center">
          <div className="bg-gray-900 rounded-2xl p-1 mb-6 inline-flex">
            <button
              onClick={() => setActiveTab("place")}
              className={`py-2 px-6 rounded-2xl text-sm font-medium transition-all ${
                activeTab === "place"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Place Order
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
              activeTab === "dashboard" ? "w-full" : "w-full max-w-2xl"
            }
          >
            {activeTab === "place" && <OrderCreator />}
            {activeTab === "manage" && <ActiveOrders />}
            {activeTab === "dashboard" && <OneInchDashboard />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
