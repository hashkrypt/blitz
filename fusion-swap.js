// fusion-swap.js - Intent-based swaps with 1inch Fusion
const { ethers } = require("ethers");
const {
  FusionSDK,
  NetworkEnum,
  PrivateKeyProviderConnector,
} = require("@1inch/fusion-sdk");
require("dotenv").config();

async function main() {
  console.log("🚀 1inch Fusion Swap Demo\n");

  // Configuration
  const config = {
    // Start with Polygon for cheaper testing
    network: NetworkEnum.POLYGON,
    rpcUrl: "https://polygon-rpc.com",

    // Token addresses on Polygon
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",

    // Swap amount (0.1 WMATIC)
    amount: ethers.parseEther("0.1"),
  };

  try {
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("📋 Configuration:");
    console.log("- Network:", config.network);
    console.log("- Wallet:", wallet.address);
    console.log("- Amount:", ethers.formatEther(config.amount), "WMATIC\n");

    // Initialize Fusion SDK
    const blockchainProvider = new PrivateKeyProviderConnector(
      process.env.PRIVATE_KEY,
      provider
    );

    const fusionSDK = new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: config.network,
      authKey: process.env.AUTH_KEY,
      blockchainProvider,
    });

    // Check WMATIC balance
    const wmatic = new ethers.Contract(
      config.WMATIC,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );

    const balance = await wmatic.balanceOf(wallet.address);
    console.log("💰 WMATIC Balance:", ethers.formatEther(balance));

    if (balance < config.amount) {
      console.log("❌ Insufficient WMATIC balance!");
      console.log("💡 Get WMATIC by wrapping MATIC at: https://app.1inch.io");
      return;
    }

    console.log("\n🔄 Creating Fusion Order...");

    // Create Fusion order
    const fusionOrder = await fusionSDK.createOrder({
      fromTokenAddress: config.WMATIC,
      toTokenAddress: config.USDC,
      amount: config.amount.toString(),
      walletAddress: wallet.address,
      preset: "fast", // Options: 'fast', 'fair', 'auction'
    });

    console.log("\n📝 Fusion Order Details:");
    console.log("- Order Hash:", fusionOrder.orderHash);
    console.log("- Auction Duration: ~2-3 minutes");
    console.log("- You Pay: 0 gas for execution!");

    // Build and sign the order
    console.log("\n✍️  Signing order...");
    const builtOrder = await fusionSDK.buildOrder(fusionOrder);
    const signature = await fusionSDK.signOrder(builtOrder);

    // Submit to 1inch network
    console.log("\n📤 Submitting to 1inch network...");
    const result = await fusionSDK.submitOrder(builtOrder, signature);

    console.log("\n✅ Order Submitted Successfully!");
    console.log("- Order ID:", result.orderId);
    console.log("- Status:", result.status);

    console.log("\n⏰ What happens next:");
    console.log("1. Resolvers will compete for 2-3 minutes");
    console.log("2. Best rate wins and executes your swap");
    console.log("3. You receive USDC automatically");
    console.log("4. Resolver pays all gas fees!");

    console.log("\n🔗 Track your order at:");
    console.log(`https://app.1inch.io/#/${config.network}/fusion`);

    // Monitor order status (optional)
    console.log("\n📊 Monitoring order status...");
    let orderStatus = await fusionSDK.getOrderStatus(result.orderId);
    console.log("Current Status:", orderStatus);

    // Poll for updates (in production, use webhooks)
    const startTime = Date.now();
    const checkStatus = setInterval(async () => {
      try {
        orderStatus = await fusionSDK.getOrderStatus(result.orderId);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        console.log(`[${elapsed}s] Status:`, orderStatus.status);

        if (orderStatus.status === "filled") {
          console.log("\n🎉 Order Filled!");
          console.log("- Execution Price:", orderStatus.executionPrice);
          console.log("- Gas Saved: ~$0.50");
          clearInterval(checkStatus);
        } else if (
          orderStatus.status === "cancelled" ||
          orderStatus.status === "expired"
        ) {
          console.log("\n❌ Order", orderStatus.status);
          clearInterval(checkStatus);
        }
      } catch (error) {
        console.error("Status check error:", error.message);
      }
    }, 30000); // Check every 30 seconds

    // Stop monitoring after 5 minutes
    setTimeout(() => {
      clearInterval(checkStatus);
      console.log(
        "\n⏹️  Stopped monitoring. Check the 1inch app for final status."
      );
    }, 300000);
  } catch (error) {
    console.error("\n❌ Error:", error.message);

    if (error.message.includes("insufficient")) {
      console.log("\n💡 Tips:");
      console.log("- Make sure you have WMATIC (wrapped MATIC)");
      console.log("- Wrap MATIC at: https://app.1inch.io");
    } else if (error.message.includes("auth")) {
      console.log("\n💡 Check your AUTH_KEY in .env file");
    }
  }
}

// Helper function to display Fusion benefits
function displayFusionBenefits() {
  console.log("\n📚 Why Use Fusion?");
  console.log("┌─────────────────┬────────────────┬─────────────────┐");
  console.log("│ Feature         │ Regular Swap   │ Fusion Swap     │");
  console.log("├─────────────────┼────────────────┼─────────────────┤");
  console.log("│ Execution       │ Immediate      │ 2-3 minutes     │");
  console.log("│ Gas Fees        │ You pay        │ Resolver pays   │");
  console.log("│ Price           │ Market rate    │ Best of auction │");
  console.log("│ MEV Protection  │ Limited        │ Full protection │");
  console.log("│ Slippage        │ Possible       │ None            │");
  console.log("└─────────────────┴────────────────┴─────────────────┘");
}

// Run the demo
main()
  .then(() => {
    displayFusionBenefits();
  })
  .catch(console.error);
