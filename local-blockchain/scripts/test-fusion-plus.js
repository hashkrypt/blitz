// scripts/test-fusion-plus.js - Test cross-chain Fusion+ on local blockchain
const { ethers } = require("hardhat");

async function main() {
  console.log("🌉 Testing 1inch Fusion+ (Cross-Chain) on Local Blockchain\n");

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

    // Transfer WETH with proper gas settings
    await weth.transfer(deployer.address, ethers.parseEther("1"), {
      gasLimit: 100000,
      maxFeePerGas: ethers.parseUnits("100", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    });
    console.log("✅ Received 1 WETH on Ethereum\n");

    console.log("Step 2: Simulating Cross-Chain Fusion+ Order...");

    // Cross-chain order example
    console.log("\n🌐 Fusion+ Cross-Chain Order:");
    console.log("┌─────────────────────────────────────────┐");
    console.log("│ Cross-Chain Order Details               │");
    console.log("├─────────────────────────────────────────┤");
    console.log("│ Source Chain: Ethereum                  │");
    console.log("│ Source Token: 1 WETH                    │");
    console.log("│ Destination Chain: Polygon              │");
    console.log("│ Destination Token: USDC                 │");
    console.log("│ Expected Amount: ~3,500 USDC            │");
    console.log("│ Auction Duration: 3-5 minutes           │");
    console.log("└─────────────────────────────────────────┘");

    console.log("\n🔄 Traditional Cross-Chain Process:");
    console.log("1. ❌ Sell WETH on Ethereum");
    console.log("2. ❌ Bridge USDC to Polygon");
    console.log("3. ❌ Pay bridge fees");
    console.log("4. ❌ Wait 10-30 minutes");
    console.log("5. ❌ Multiple transactions & gas fees\n");

    console.log("✨ Fusion+ Process:");
    console.log("1. ✅ Submit one intent: 'WETH on ETH → USDC on Polygon'");
    console.log("2. ✅ Resolvers handle everything");
    console.log("3. ✅ No bridge interaction needed");
    console.log("4. ✅ Receive USDC directly on Polygon");
    console.log("5. ✅ One transaction, no execution gas!\n");

    // Show cross-chain scenarios
    console.log("📊 Popular Cross-Chain Routes:");
    console.log("┌─────────────────────┬─────────────────────┬──────────────┐");
    console.log("│ From                │ To                  │ Use Case     │");
    console.log("├─────────────────────┼─────────────────────┼──────────────┤");
    console.log("│ ETH (Ethereum)      │ USDC (Polygon)      │ Lower fees   │");
    console.log("│ USDC (Polygon)      │ ETH (Arbitrum)      │ L2 trading   │");
    console.log("│ WBTC (Ethereum)     │ USDT (BSC)          │ Yield farm   │");
    console.log("│ MATIC (Polygon)     │ ETH (Optimism)      │ Arbitrage    │");
    console.log("└─────────────────────┴─────────────────────┴──────────────┘");

    // Demonstrate approval
    console.log("\n🔓 Approving tokens for Fusion+...");
    const FUSION_ROUTER = "0x111111125421ca6dc452d289314280a0f8842a65";
    const wethAsDeployer = weth.connect(deployer);
    await wethAsDeployer.approve(FUSION_ROUTER, ethers.parseEther("10"), {
      gasLimit: 100000,
      maxFeePerGas: ethers.parseUnits("100", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    });
    console.log("✅ Fusion+ router approved\n");

    // Show the magic
    console.log("🎩 The Magic of Fusion+:");
    console.log("┌─────────────────┬────────────────┬─────────────────┐");
    console.log("│ Feature         │ Traditional    │ Fusion+         │");
    console.log("├─────────────────┼────────────────┼─────────────────┤");
    console.log("│ Steps           │ 3-5            │ 1               │");
    console.log("│ Time            │ 10-30 min      │ 3-5 min         │");
    console.log("│ Gas Fees        │ Multiple       │ None (you)      │");
    console.log("│ Bridge Risk     │ Yes            │ No              │");
    console.log("│ Complexity      │ High           │ Simple          │");
    console.log("└─────────────────┴────────────────┴─────────────────┘");

    console.log("\n⚡ How Resolvers Make It Work:");
    console.log("1. 🤖 Resolver sees your intent");
    console.log("2. 💰 They have liquidity on both chains");
    console.log("3. 📤 They send you USDC on Polygon");
    console.log("4. 📥 They claim your WETH on Ethereum");
    console.log("5. 🎯 Competition ensures best rates!\n");

    console.log("💡 Real-World Use Cases:");
    console.log("- 🏃 Arbitrage: ETH cheaper on Ethereum, sell on Arbitrum");
    console.log("- 💸 Gas Savings: Move to cheaper chains for DeFi");
    console.log("- 🎮 Gaming: Move assets to gaming chains");
    console.log("- 🌾 Yield Farming: Chase yields across chains\n");

    console.log("🎯 Next Steps:");
    console.log(
      "1. Test Fusion+ at: https://app.1inch.io (select Fusion mode)"
    );
    console.log("2. Start with small cross-chain swaps");
    console.log("3. No bridges, no complexity, just intents!");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

// Show example Fusion+ order structure
function showFusionPlusOrderStructure() {
  console.log("\n📚 Fusion+ Cross-Chain Order Structure:");
  console.log(`
  {
    "sourceChain": "ETHEREUM",
    "destinationChain": "POLYGON",
    "fromTokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "toTokenAddress": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "amount": "1000000000000000000",
    "minReturn": "3400000000",
    "destinationWallet": "0x...",
    "preset": "fast",
    "auctionDuration": 300,
    "crossChainFee": "0"
  }
  `);

  console.log("\n🌉 Supported Chains:");
  console.log("- Ethereum, Polygon, BSC, Arbitrum");
  console.log("- Optimism, Avalanche, Gnosis, Fantom");
  console.log("- Base, zkSync Era, and more!");
}

main()
  .then(() => {
    showFusionPlusOrderStructure();
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
