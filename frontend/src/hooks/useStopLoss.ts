// frontend/src/hooks/useStopLoss.ts
import { useState } from "react";
import { ethers } from "ethers";
import { StopLossService } from "../services/StopLossService";

export const useStopLoss = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createStopLossOrder = async (params: {
    token: string;
    amount: string;
    stopPrice: number;
    signer: ethers.Signer | null;
  }) => {
    if (!params.signer) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      const service = new StopLossService();

      // Token addresses on Polygon
      const tokens: { [key: string]: string } = {
        ETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH on Polygon
        WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        WBTC: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      };

      const { order, signature, orderHash } = await service.createStopLossOrder(
        {
          signer: params.signer,
          tokenIn: tokens[params.token] || tokens["WMATIC"],
          tokenOut: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
          amount: params.amount,
          triggerPrice: params.stopPrice,
        }
      );

      const result = await service.submitOrder(order, signature, orderHash);

      return result;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createStopLossOrder,
    isLoading,
  };
};
