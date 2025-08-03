import { useState, useEffect } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else if (accounts[0] !== address) {
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setChainId(network.chainId);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      // Check if we're on Polygon
      if (network.chainId !== 137 && network.chainId !== 80001) {
        toast.error("Please switch to Polygon network");

        try {
          // Try to switch to Polygon
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x89" }], // 137 in hex
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
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
                    rpcUrls: ["https://polygon-rpc.com/"],
                    blockExplorerUrls: ["https://polygonscan.com/"],
                  },
                ],
              });
            } catch (addError) {
              toast.error("Failed to add Polygon network");
              throw addError;
            }
          } else {
            throw switchError;
          }
        }

        // Re-check connection after network switch
        await checkConnection();
        return;
      }

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setChainId(network.chainId);
      setIsConnected(true);

      toast.success(
        `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
      );
    } catch (error: any) {
      console.error("Error connecting wallet:", error);

      if (error.code === -32002) {
        toast.error("Please check MetaMask - connection request pending");
      } else if (error.code === 4001) {
        toast.error("Connection rejected");
      } else {
        toast.error("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setIsConnected(false);
    toast.success("Wallet disconnected");
  };

  const getChainName = (chainId: number | null): string => {
    if (!chainId) return "Unknown";

    const chains: { [key: number]: string } = {
      1: "Ethereum",
      137: "Polygon",
      80001: "Mumbai",
      56: "BSC",
      42161: "Arbitrum",
      10: "Optimism",
    };

    return chains[chainId] || `Chain ${chainId}`;
  };

  return {
    provider,
    signer,
    address,
    isConnecting,
    isConnected,
    chainId,
    chainName: getChainName(chainId),
    connectWallet,
    disconnect,
  };
};
