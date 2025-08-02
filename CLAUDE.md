# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a stop-loss and take-profit trading platform built for the ETHGlobal Unite Hackathon. The project integrates with 1inch protocol's Fusion SDK and Limit Order SDK to provide automated trading functionality on Ethereum networks.

## Architecture

The codebase is organized into several key components:

### Core Structure
- **Root**: Main entry point with core dependencies and scripts
- **frontend/**: React TypeScript application with Tailwind CSS and RainbowKit wallet integration
- **local-blockchain/**: Hardhat development environment for testing
- **scripts/**: JavaScript utilities for interacting with 1inch protocols
- **reference/**: Reference implementations and SDK examples

### Key Dependencies
- **@1inch/fusion-sdk**: For creating and managing fusion orders
- **@1inch/limit-order-sdk**: For limit order functionality  
- **ethers**: Ethereum library for blockchain interactions
- **hardhat**: Development framework for smart contracts

## Common Development Commands

### Frontend Development
```bash
cd frontend
npm start          # Start React development server
npm run build      # Build production bundle
npm test           # Run tests
```

### Blockchain Development
```bash
cd local-blockchain
npx hardhat compile    # Compile smart contracts
npx hardhat test       # Run contract tests
npx hardhat node      # Start local blockchain
```

### Script Execution
```bash
# Run trading scripts from root directory
node scripts/examples/actual-working.js
node scripts/examples/fusion-swap.js
node scripts/core/polygon-limit-order.js
```

## Environment Configuration

Required environment variables (see .env.example):
- `AUTH_KEY`: 1inch API authentication key
- `PRIVATE_KEY`: Wallet private key for transactions
- `POLYGON_RPC`: Polygon network RPC endpoint
- `ETHEREUM_RPC`: Ethereum mainnet RPC endpoint

## Key Implementation Details

### 1inch SDK Integration
The project uses both Fusion SDK and Limit Order SDK for different trading strategies:
- **Fusion SDK**: For market making and advanced order types
- **Limit Order SDK**: For basic stop-loss/take-profit orders

### Network Support
- Ethereum mainnet and testnets
- Polygon network
- Local development blockchain via Hardhat

### Frontend Stack
- React 19 with TypeScript
- Tailwind CSS for styling
- RainbowKit for wallet connection
- Ethers v5 for blockchain interactions

## Testing Strategy

- Frontend: React Testing Library and Jest
- Blockchain: Hardhat testing framework
- Integration: Manual testing scripts in scripts/ directory

## Development Workflow

1. Set up environment variables in .env file
2. Start local blockchain if needed: `cd local-blockchain && npx hardhat node`
3. Run frontend: `cd frontend && npm start`
4. Test scripts: `node scripts/examples/[script-name].js`

## Important Notes

- The project uses ethers v6 in root and local-blockchain, but v5 in frontend
- 1inch SDK versions are consistent across components (@1inch/limit-order-sdk v4.9.5-rc.0)
- Local blockchain runs on port 8545
- Frontend development server runs on default React port (3000)