import { useState } from "react";
import { ethers } from "ethers";
import { StopLossService } from "../services/StopLossService";

export const useStopLoss = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStopLossOrder = async (params: {
    token: string;
    amount: string;
    stopPrice: number;
    signer: ethers.Signer;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const service = new StopLossService();

      // Create the stop-loss order
      const result = await service.createStopLossOrder({
        token: params.token,
        amount: params.amount,
        stopPrice: params.stopPrice,
        signer: params.signer,
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createStopLossOrder,
    isLoading,
    error,
  };
};
