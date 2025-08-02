// scripts/test-fusion.js - Test Fusion on local blockchain
const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing 1inch Fusion on Local Blockchain\n");

  // Get test accounts
  const [deployer] = await ethers.getSigners();
  console.log("👛 Test Wallet:", deployer.address);

  // Token addresses on mainnet fork
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_WHALE = "0x2E40DDCB231672285A5312ad230185ab2F14eD2B";

  try {
    console.log("Step 1: Getting WETH from whale...");

    // Impersonate whale
    await ethers.provider.send("hardhat_impersonateAccount", [WETH_WHALE]);
    const whale = await ethers.getSigner(WETH_WHALE);

    const weth = await ethers.getContractAt(
      [
        "function transfer(address,uint256) returns (bool)",
        "function balanceOf(address) view returns (uint256)",
        "function approve(address,uint256) returns (bool)",
      ],
      WETH,
      whale
    );

    // Transfer WETH to test account with proper gas settings
    await weth.transfer(deployer.address, ethers.parseEther("1"), {
      gasLimit: 100000,
      maxFeePerGas: ethers.parseUnits("100", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    });
    console.log("✅ Received 1 WETH\n");

    console.log("Step 2: Simulating Fusion Order Creation...");

    // NOTE: Fusion SDK requires live resolvers, so we simulate the process
    console.log("\n📋 Fusion Order (Simulated):");
    console.log("┌─────────────────────────────────────┐");
    console.log("│ Fusion Order Details                │");
    console.log("├─────────────────────────────────────┤");
    console.log("│ From: 0.1 WETH                      │");
    console.log("│ To: ~350 USDC                       │");
    console.log("│ Dutch Auction Duration: 2-3 min     │");
    console.log("│ Starting Price: 3600 USDC/ETH       │");
    console.log("│ Ending Price: 3400 USDC/ETH         │");
    console.log("└─────────────────────────────────────┘");

    console.log("\n⚡ Fusion Process (What Would Happen):");
    console.log("1. ✅ Order created with Dutch auction parameters");
    console.log("2. ⏰ Resolvers monitor for 2-3 minutes");
    console.log("3. 🤖 Best resolver executes at optimal price");
    console.log("4. 💰 You receive USDC, resolver pays gas");
    console.log("5. 🎉 Trade complete with no gas fees!");

    console.log("\n📊 Fusion vs Traditional Swap:");
    console.log("┌─────────────────┬──────────────┬─────────────────┐");
    console.log("│ Feature         │ Regular Swap │ Fusion Order    │");
    console.log("├─────────────────┼──────────────┼─────────────────┤");
    console.log("│ Execution       │ Immediate    │ 2-3 minutes     │");
    console.log("│ Gas Cost        │ ~$20-50      │ $0 (you)        │");
    console.log("│ Price           │ Market       │ Auction (better)│");
    console.log("│ MEV Protection  │ Limited      │ Full            │");
    console.log("│ Slippage        │ 0.5-3%       │ 0%              │");
    console.log("└─────────────────┴──────────────┴─────────────────┘");

    // Demonstrate approval (which would be needed)
    console.log("\n🔓 Approving tokens for Fusion...");
    const FUSION_ROUTER = "0x111111125421ca6dc452d289314280a0f8842a65";
    const wethAsDeployer = weth.connect(deployer);
    await wethAsDeployer.approve(FUSION_ROUTER, ethers.parseEther("10"), {
      gasLimit: 100000,
      maxFeePerGas: ethers.parseUnits("100", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    });
    console.log("✅ Fusion router approved");

    console.log("\n💡 Key Insights:");
    console.log("- Fusion requires live resolver network");
    console.log("- Cannot fully simulate on local blockchain");
    console.log("- Best tested on testnet or mainnet");
    console.log("- Use polygon-limit-order.js for real testing");

    console.log("\n🎯 Next Steps:");
    console.log("1. Use your working polygon-limit-order.js");
    console.log("2. Or test Fusion on Polygon with small amounts");
    console.log("3. Monitor at: https://app.1inch.io/#/137/fusion");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

// Educational: Show Fusion order structure
function showFusionOrderStructure() {
  console.log("\n📚 Fusion Order Structure:");
  console.log(`
  {
    "fromTokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "toTokenAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "amount": "100000000000000000",
    "walletAddress": "0x...",
    "preset": "auction",
    "auctionDuration": 180,
    "auctionStartAmount": "360000000",
    "auctionEndAmount": "340000000",
    "executorFee": "0"
  }
  `);
}

main()
  .then(() => {
    showFusionOrderStructure();
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
