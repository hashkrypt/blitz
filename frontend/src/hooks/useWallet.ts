// src/hooks/useWallet.ts
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    console.log("Starting wallet connection...");

    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    setIsConnecting(true);
    try {
      console.log("Requesting accounts...");
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Accounts received:", accounts);

      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Address:", address);

      // Try to switch to Polygon
      try {
        console.log("Switching to Polygon...");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }], // 137 in hex
        });
        console.log("Switched to Polygon successfully");
      } catch (switchError: any) {
        console.log("Switch error:", switchError);
        // Chain not added, add it
        if (switchError.code === 4902) {
          console.log("Adding Polygon network...");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x89",
                chainName: "Polygon",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://polygon-rpc.com"],
                blockExplorerUrls: ["https://polygonscan.com/"],
              },
            ],
          });
        }
      }

      setAddress(address);
      setSigner(signer);
      console.log("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Check console for details.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Check if already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          console.log("Existing accounts:", accounts);
          if (accounts.length > 0) {
            connectWallet();
          }
        })
        .catch((error: any) => {
          console.error("Error checking accounts:", error);
        });
    } else {
      console.log("No window.ethereum found");
    }
  }, []);

  return {
    address,
    signer,
    connectWallet,
    isConnecting,
    isConnected: !!address,
  };
};

// Add TypeScript declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}
