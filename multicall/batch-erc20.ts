// Batch-read four fields for N tokens in one call via viem's multicall.
// Uses Multicall3 at its canonical address 0xcA11...E11.

import { createPublicClient, http, formatUnits } from "viem";
import { mainnet } from "viem/chains";

const ERC20_ABI = [
  { name: "name",        type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string"  }] },
  { name: "symbol",      type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string"  }] },
  { name: "decimals",    type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8"   }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

const TOKENS = [
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
] as const;

const client = createPublicClient({ chain: mainnet, transport: http() });

async function main() {
  const calls = TOKENS.flatMap((address) => [
    { address, abi: ERC20_ABI, functionName: "name"        as const },
    { address, abi: ERC20_ABI, functionName: "symbol"      as const },
    { address, abi: ERC20_ABI, functionName: "decimals"    as const },
    { address, abi: ERC20_ABI, functionName: "totalSupply" as const },
  ]);

  const results = await client.multicall({ contracts: calls, allowFailure: true });

  for (let i = 0; i < TOKENS.length; i++) {
    const [name, symbol, decimals, supply] = results.slice(i * 4, i * 4 + 4);
    if (!name.result) { console.log(TOKENS[i], "read failed"); continue; }
    console.log(`${name.result} (${symbol.result}) — supply ${formatUnits(supply.result as bigint, decimals.result as number)}`);
  }
}

main().catch(console.error);
