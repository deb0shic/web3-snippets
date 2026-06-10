// The two-transaction flow: `approve(spender, amount)` then let the spender
// `transferFrom(owner, recipient, amount)`.
//
// Two transactions, two gas payments, but works with every ERC-20.

import { createWalletClient, createPublicClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

const ABI = [
  { name: "approve", type: "function", stateMutability: "nonpayable",
    inputs:  [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
] as const;

const USDC     = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const ROUTER   = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // uni v2 router
const AMOUNT   = parseUnits("100", 6); // 100 USDC

const account  = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const wallet   = createWalletClient({ account, chain: mainnet, transport: http() });
const client   = createPublicClient({ chain: mainnet, transport: http() });

async function main() {
  const hash = await wallet.writeContract({
    address:      USDC,
    abi:          ABI,
    functionName: "approve",
    args:         [ROUTER, AMOUNT],
  });
  console.log("approve tx:", hash);

  const rc = await client.waitForTransactionReceipt({ hash });
  console.log("status:", rc.status);
}

main().catch(console.error);

