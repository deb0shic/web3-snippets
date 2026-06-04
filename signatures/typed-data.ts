// Sign and verify an EIP-712 typed-data payload.

import { createWalletClient, http, verifyTypedData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const wallet  = createWalletClient({ account, chain: mainnet, transport: http() });

const domain = {
  name:              "example.app",
  version:           "1",
  chainId:           mainnet.id,
  verifyingContract: "0x0000000000000000000000000000000000000000",
} as const;

const types = {
  Order: [
    { name: "maker",    type: "address" },
    { name: "asset",    type: "address" },
    { name: "amount",   type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

async function main() {
  const message = {
    maker:    account.address,
    asset:    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    amount:   1_000_000n,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
  } as const;

  const signature = await wallet.signTypedData({ domain, types, primaryType: "Order", message });

  const ok = await verifyTypedData({
    address: account.address,
    domain, types, primaryType: "Order", message, signature,
  });
  console.log("valid:", ok, "sig:", signature);
}

main().catch(console.error);
