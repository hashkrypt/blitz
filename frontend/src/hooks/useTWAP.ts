// src/hooks/useTWAP.ts
import { useState, useEffect } from "react";
import { useWallet } from "./useWallet";
import { TWAPService } from "../services/TWAPService";

export const useTWAP = () => {
  const { signer } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [twapOrders, setTwapOrders] = useState<any[]>([]);

  const createTWAPOrder = async (params: {
    token: string;
    totalAmount: string;
    chunks: number;
    durationHours: number;
  }) => {
    if (!signer) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      const service = new TWAPService();
      const result = await service.createTWAPOrder({
        signer,
        fromToken: params.token,
        toToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
        totalAmount: params.totalAmount,
        chunks: params.chunks,
        durationHours: params.durationHours,
        startDelay: 0,
      });

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTWAPOrder,
    isLoading,
    twapOrders,
  };
};
