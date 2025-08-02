// frontend/src/services/StopLossService.ts
import { ethers } from "ethers";

// Define types directly since SDK might have issues
interface OrderData {
  salt: string;
  maker: string;
  receiver: string;
  makerAsset: string;
  takerAsset: string;
  makingAmount: string;
  takingAmount: string;
  makerTraits: string;
}

export class StopLossService {
  private provider: ethers.providers.JsonRpcProvider;
  private chainId = 137; // Polygon

  // Contract addresses
  private LIMIT_ORDER_CONTRACT = "0x111111125421ca6dc452d289314280a0f8842a65";
  private WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
  private USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
  }

  async createStopLossOrder(params: {
    signer: ethers.Signer;
    tokenIn: string;
    tokenOut: string;
    amount: string;
    triggerPrice: number;
  }) {
    const { signer, tokenIn, tokenOut, amount, triggerPrice } = params;
    const walletAddress = await signer.getAddress();

    // Generate salt and nonce
    const salt = Math.floor(Math.random() * 1000000000).toString();
    const expiration = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days

    // Calculate amounts
    const makingAmount = ethers.utils.parseEther(amount);
    const takingAmount = ethers.utils.parseUnits(
      (parseFloat(amount) * triggerPrice).toString(),
      6 // USDC decimals
    );

    // Create maker traits (packed uint256)
    // For now, just use expiration in the traits
    const makerTraits = expiration.toString();

    // Create the order object
    const order: OrderData = {
      salt: salt,
      maker: walletAddress,
      receiver: "0x0000000000000000000000000000000000000000",
      makerAsset: tokenIn,
      takerAsset: tokenOut,
      makingAmount: makingAmount.toString(),
      takingAmount: takingAmount.toString(),
      makerTraits: makerTraits,
    };

    // Create EIP-712 domain
    const domain = {
      name: "1inch Limit Order Protocol",
      version: "4",
      chainId: this.chainId,
      verifyingContract: this.LIMIT_ORDER_CONTRACT,
    };

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
      // Try using the standard signTypedData method
      let signature: string;

      // Check if we're using MetaMask
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const msgParams = {
          domain,
          primaryType: "Order",
          types,
          message: order,
        };

        // Use eth_signTypedData_v4
        signature = await provider.send("eth_signTypedData_v4", [
          walletAddress,
          JSON.stringify(msgParams),
        ]);
      } else {
        // Fallback for other signers
        const signerWithAddress = signer as any;
        if (signerWithAddress._signTypedData) {
          signature = await signerWithAddress._signTypedData(
            domain,
            types,
            order
          );
        } else {
          // Last resort - create a simple signature
          const messageHash = ethers.utils.id(JSON.stringify(order));
          signature = await signer.signMessage(messageHash);
        }
      }

      // Calculate order hash
      const orderHash = ethers.utils._TypedDataEncoder.hash(
        domain,
        types,
        order
      );

      return {
        order,
        signature,
        orderHash,
      };
    } catch (error) {
      console.error("Error signing order:", error);
      throw new Error("Failed to sign order. Please try again.");
    }
  }

  async submitOrder(order: OrderData, signature: string, orderHash: string) {
    // For demo, just log it
    console.log("Order to submit:", {
      order,
      signature,
      orderHash,
    });

    // In production, submit to 1inch API
    // const apiKey = process.env.REACT_APP_1INCH_API_KEY;
    // const response = await fetch(...);

    return {
      success: true,
      orderHash,
      message: "Order created (demo mode)",
    };
  }
}

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
