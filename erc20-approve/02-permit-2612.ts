// Sign an EIP-2612 permit and deliver it inline. One transaction, zero
// approval gas paid by the owner.
//
// USDC and DAI implement EIP-2612 on mainnet. This is the pattern most
// aggregators use to save users an approve tx.

import { createPublicClient, http, parseUnits, verifyTypedData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

const USDC     = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const SPENDER  = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; // permit2
const AMOUNT   = parseUnits("100", 6);
const DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 3600);

const owner    = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const client   = createPublicClient({ chain: mainnet, transport: http() });

async function main() {
  const nonce = (await client.readContract({
    address:      USDC,
    abi:          [{ name: "nonces", type: "function", stateMutability: "view",
                     inputs: [{ name: "owner", type: "address" }], outputs: [{ type: "uint256" }] }] as const,
    functionName: "nonces",
    args:         [owner.address],
  })) as bigint;

  const domain = {
    name:              "USD Coin",
    version:           "2",
    chainId:           mainnet.id,
    verifyingContract: USDC,
  } as const;

  const types = {
    Permit: [
      { name: "owner",    type: "address" },
      { name: "spender",  type: "address" },
      { name: "value",    type: "uint256" },
      { name: "nonce",    type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  } as const;

  const message = { owner: owner.address, spender: SPENDER, value: AMOUNT, nonce, deadline: DEADLINE };
  const signature = await owner.signTypedData({ domain, types, primaryType: "Permit", message });

  const ok = await verifyTypedData({
    address:      owner.address,
    domain, types, primaryType: "Permit", message, signature,
  });
  console.log("signature verified locally:", ok);

  console.log("signature:", signature);
  console.log("next step: submit this to a contract that accepts permit + action in one tx");
}

main().catch(console.error);

