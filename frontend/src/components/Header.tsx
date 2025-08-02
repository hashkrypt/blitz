// src/components/Header.tsx
import React from "react";
import { useWallet } from "../hooks/useWallet";

const Header: React.FC = () => {
  const { address, connectWallet, isConnecting, isConnected } = useWallet();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            {/* 1inch Logo */}
            <img
              src="/logos/1inch_color_white.svg"
              alt="1inch"
              className="h-16 w-auto"
              style={{ height: "64px" }}
            />
            <span className="text-gray-400 text-2xl mx-3">|</span>
            <span className="text-2xl text-gray-400 font-medium">
              Blitz Pro
            </span>
          </div>

          {isConnected ? (
            <div className="flex items-center space-x-4 bg-gray-800 rounded-2xl px-5 py-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
            >
              {isConnecting ? (
                <span className="flex items-center space-x-2">
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
                  <span>Connecting...</span>
                </span>
              ) : (
                "Connect Wallet"
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
