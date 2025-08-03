// src/services/TWAPService.ts
import { ethers } from "ethers";
import { StopLossService } from "./StopLossService";

interface TWAPOrder {
  id: string;
  token: string;
  totalAmount: string;
  chunks: number;
  intervalSeconds: number;
  startTime: number;
  executedChunks: number;
  status: "pending" | "active" | "completed" | "cancelled";
  childOrders: string[];
}

export class TWAPService extends StopLossService {
  private twapOrders: Map<string, TWAPOrder> = new Map();

  async createTWAPOrder(params: {
    signer: ethers.Signer;
    fromToken: string;
    toToken: string;
    totalAmount: string;
    chunks: number;
    durationHours: number;
    startDelay: number;
  }) {
    const {
      signer,
      fromToken,
      toToken,
      totalAmount,
      chunks,
      durationHours,
      startDelay,
    } = params;
    const walletAddress = await signer.getAddress();

    // Calculate chunk size and interval
    const chunkAmount = (parseFloat(totalAmount) / chunks).toFixed(6);
    const intervalSeconds = (durationHours * 3600) / chunks;
    const startTime = Math.floor(Date.now() / 1000) + startDelay * 60;

    // Create TWAP order
    const twapId = `twap_${Date.now()}`;
    const twapOrder: TWAPOrder = {
      id: twapId,
      token: fromToken,
      totalAmount,
      chunks,
      intervalSeconds,
      startTime,
      executedChunks: 0,
      status: "pending",
      childOrders: [],
    };

    // Create individual limit orders for each chunk
    const childOrders = [];
    for (let i = 0; i < chunks; i++) {
      const executeAfter = startTime + i * intervalSeconds;

      // Create limit order with time restriction
      const order = await this.createTimedLimitOrder({
        signer,
        tokenIn: fromToken,
        tokenOut: toToken,
        amount: chunkAmount,
        executeAfter,
        executeDeadline: executeAfter + intervalSeconds,
      });

      childOrders.push(order);
    }

    twapOrder.childOrders = childOrders.map((o) => o.orderHash);
    this.twapOrders.set(twapId, twapOrder);

    return twapOrder;
  }

  async createTimedLimitOrder(params: {
    signer: ethers.Signer;
    tokenIn: string;
    tokenOut: string;
    amount: string;
    executeAfter: number;
    executeDeadline: number;
  }) {
    const { signer, tokenIn, tokenOut, amount, executeAfter, executeDeadline } =
      params;
    const walletAddress = await signer.getAddress();

    // Generate order with time restrictions
    const salt = Math.floor(Math.random() * 1000000000).toString();
    const makerTraits = this.encodeMakerTraitsWithTime({
      allowPartialFill: false,
      shouldCheckEpoch: true,
      usePermit2: false,
      isMakerContract: false,
      expiry: executeDeadline,
      nonceOrEpoch: executeAfter,
      series: 0,
    });

    const order = {
      salt: salt,
      maker: walletAddress,
      receiver: "0x0000000000000000000000000000000000000000",
      makerAsset: tokenIn,
      takerAsset: tokenOut,
      makingAmount: ethers.utils.parseEther(amount).toString(),
      takingAmount: this.calculateTakingAmountForTokens(
        amount,
        tokenIn,
        tokenOut
      ),
      makerTraits: makerTraits,
    };

    // Sign order
    const signature = await this.signLimitOrder(signer, order);

    return {
      order,
      signature,
      orderHash: await this.calculateOrderHash(order),
      executeAfter,
      executeDeadline,
    };
  }

  private encodeMakerTraitsWithTime(traits: any): string {
    let encoded = BigInt(0);

    if (traits.allowPartialFill) encoded |= BigInt(1) << BigInt(255);
    if (traits.shouldCheckEpoch) encoded |= BigInt(1) << BigInt(254);
    if (traits.usePermit2) encoded |= BigInt(1) << BigInt(253);
    if (traits.isMakerContract) encoded |= BigInt(1) << BigInt(252);

    // Add expiry (40 bits)
    encoded |= BigInt(traits.expiry) << BigInt(208);

    // Add nonce/epoch for time restriction (40 bits)
    encoded |= BigInt(traits.nonceOrEpoch) << BigInt(168);

    return encoded.toString();
  }

  private calculateTakingAmountForTokens(
    amount: string,
    tokenIn: string,
    tokenOut: string
  ): string {
    // Get current price and calculate output
    // For demo, using fixed rate
    const rate = 0.89; // MATIC/USDC
    return ethers.utils
      .parseUnits((parseFloat(amount) * rate).toString(), 6)
      .toString();
  }

  getTWAPStatus(twapId: string): TWAPOrder | undefined {
    return this.twapOrders.get(twapId);
  }

  getAllTWAPOrders(): TWAPOrder[] {
    return Array.from(this.twapOrders.values());
  }
}
