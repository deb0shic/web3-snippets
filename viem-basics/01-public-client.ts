// Minimal viem public client: read chain state without signing anything.
//
// Runs against Ethereum mainnet by default — swap the chain import to
// query Base, Optimism, or any other supported chain.

import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain:     mainnet,
  transport: http(process.env.MAINNET_RPC_URL),
});

async function main() {
  const block = await client.getBlockNumber();
  console.log("head block:", block);

  // vitalik.eth
  const balance = await client.getBalance({
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  });
  console.log("vitalik.eth balance:", formatEther(balance), "ETH");
}

main().catch((e) => { console.error(e); process.exit(1); });

