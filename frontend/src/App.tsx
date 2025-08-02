// src/App.tsx
import React from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Large background unicorn - very subtle */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/logos/1inch_without_text_white.svg"
          alt=""
          className="w-[600px] h-[600px] opacity-[0.02]"
        />
      </div>

      <div className="relative z-10">
        <Header />
        <Dashboard />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
            borderRadius: "16px",
          },
        }}
      />
    </div>
  );
}

export default App;
