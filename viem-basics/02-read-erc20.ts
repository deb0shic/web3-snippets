// Read name / symbol / decimals / totalSupply from an ERC-20.
//
// Also shows encoding the ABI as `const` so viem infers correct return types
// without a separate typechain step.

import { createPublicClient, http, formatUnits } from "viem";
import { mainnet } from "viem/chains";

const ERC20_ABI = [
  { name: "name",        type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "symbol",      type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals",    type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8"  }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const client = createPublicClient({ chain: mainnet, transport: http() });

async function main() {
  const [name, symbol, decimals, supply] = await Promise.all([
    client.readContract({ address: USDC, abi: ERC20_ABI, functionName: "name"        }),
    client.readContract({ address: USDC, abi: ERC20_ABI, functionName: "symbol"      }),
    client.readContract({ address: USDC, abi: ERC20_ABI, functionName: "decimals"    }),
    client.readContract({ address: USDC, abi: ERC20_ABI, functionName: "totalSupply" }),
  ]);
  console.log(`${name} (${symbol})`);
  console.log("decimals:", decimals);
  console.log("supply:  ", formatUnits(supply, decimals), symbol);
}

main().catch(console.error);
