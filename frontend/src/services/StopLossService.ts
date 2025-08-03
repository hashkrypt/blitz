// src/services/StopLossService.ts
import { ethers } from "ethers";

interface StopLossOrder {
  token: string;
  amount: string;
  stopPrice: number;
  orderHash?: string;
  signature?: string;
}

export class StopLossService {
  // 1inch Limit Order Protocol V4 contract on Polygon
  protected limitOrderContract = "0x94Bc2a1C732BcAd7343B25af48385Fe76E08734f";

  // Token addresses on Polygon
  protected tokenAddresses: { [key: string]: string } = {
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    WBTC: "0x1bfd67037b42cf73acF2047067bd4F2C47D9BfD6",
    "1INCH": "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
  };

  async createStopLossOrder(params: {
    token: string;
    amount: string;
    stopPrice: number;
    signer: ethers.Signer;
  }): Promise<StopLossOrder> {
    const { token, amount, stopPrice, signer } = params;

    try {
      // Get wallet address
      const walletAddress = await signer.getAddress();

      // Get token addresses
      const tokenIn = this.tokenAddresses[token] || token;
      const tokenOut = this.tokenAddresses["USDC"]; // Default to USDC as stable

      // Create the limit order
      const order = await this.createLimitOrder({
        signer,
        maker: walletAddress,
        tokenIn,
        tokenOut,
        amountIn: amount,
        stopPrice,
      });

      return {
        token,
        amount,
        stopPrice,
        orderHash: order.orderHash,
        signature: order.signature,
      };
    } catch (error) {
      console.error("Error creating stop-loss order:", error);
      throw error;
    }
  }

  protected async createLimitOrder(params: {
    signer: ethers.Signer;
    maker: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    stopPrice: number;
  }) {
    const { signer, maker, tokenIn, tokenOut, amountIn, stopPrice } = params;

    // Generate random salt
    const salt = Math.floor(Math.random() * 1000000000).toString();

    // Calculate maker traits (simplified)
    const makerTraits = this.encodeMakerTraits({
      allowPartialFill: true,
      shouldCheckEpoch: false,
      usePermit2: false,
      isMakerContract: false,
    });

    // Calculate amounts
    const makingAmount = ethers.utils.parseEther(amountIn).toString();
    const takingAmount = this.calculateTakingAmount(amountIn, stopPrice);

    // Create order struct
    const order = {
      salt: salt,
      maker: maker,
      receiver: "0x0000000000000000000000000000000000000000", // Zero address means maker receives
      makerAsset: tokenIn,
      takerAsset: tokenOut,
      makingAmount: makingAmount,
      takingAmount: takingAmount,
      makerTraits: makerTraits,
    };

    // Sign the order
    const signature = await this.signLimitOrder(signer, order);

    // Calculate order hash
    const orderHash = await this.calculateOrderHash(order);

    return {
      order,
      signature,
      orderHash,
    };
  }

  protected encodeMakerTraits(traits: {
    allowPartialFill: boolean;
    shouldCheckEpoch: boolean;
    usePermit2: boolean;
    isMakerContract: boolean;
  }): string {
    // Encode traits into uint256
    let encoded = BigInt(0);

    if (traits.allowPartialFill) encoded |= BigInt(1) << BigInt(255);
    if (traits.shouldCheckEpoch) encoded |= BigInt(1) << BigInt(254);
    if (traits.usePermit2) encoded |= BigInt(1) << BigInt(253);
    if (traits.isMakerContract) encoded |= BigInt(1) << BigInt(252);

    return encoded.toString();
  }

  protected calculateTakingAmount(amountIn: string, stopPrice: number): string {
    // Calculate the USDC amount based on stop price
    const usdcAmount = parseFloat(amountIn) * stopPrice;
    return ethers.utils.parseUnits(usdcAmount.toString(), 6).toString();
  }

  protected async signLimitOrder(
    signer: ethers.Signer,
    order: any
  ): Promise<string> {
    // EIP-712 Domain
    const domain = {
      name: "1inch Limit Order Protocol",
      version: "4",
      chainId: 137, // Polygon
      verifyingContract: this.limitOrderContract,
    };

    // EIP-712 Types
    const types = {
      Order: [
        { name: "salt", type: "uint256" },
        { name: "maker", type: "address" },
        { name: "receiver", type: "address" },
        { name: "makerAsset", type: "address" },
        { name: "takerAsset", type: "address" },
        { name: "makingAmount", type: "uint256" },
        { name: "takingAmount", type: "uint256" },
        { name: "makerTraits", type: "uint256" },
      ],
    };

    try {
      const signature = await (signer as any)._signTypedData(
        domain,
        types,
        order
      );
      return signature;
    } catch (error) {
      console.error("Error signing order:", error);
      throw new Error("Failed to sign order");
    }
  }

  protected async calculateOrderHash(order: any): Promise<string> {
    const orderString = JSON.stringify({
      salt: order.salt,
      maker: order.maker,
      receiver: order.receiver,
      makerAsset: order.makerAsset,
      takerAsset: order.takerAsset,
      makingAmount: order.makingAmount,
      takingAmount: order.takingAmount,
      makerTraits: order.makerTraits,
    });

    return ethers.utils.id(orderString);
  }

  // Helper method to check if an order should be executed
  async shouldExecuteOrder(order: any, currentPrice: number): Promise<boolean> {
    const stopPrice = this.extractStopPriceFromOrder(order);
    return currentPrice <= stopPrice;
  }

  private extractStopPriceFromOrder(order: any): number {
    const makingAmount = ethers.utils.formatEther(order.makingAmount);
    const takingAmount = ethers.utils.formatUnits(order.takingAmount, 6);
    return parseFloat(takingAmount) / parseFloat(makingAmount);
  }

  getSupportedTokens(): string[] {
    return Object.keys(this.tokenAddresses);
  }

  getTokenAddress(symbol: string): string {
    return this.tokenAddresses[symbol] || symbol;
  }
}
