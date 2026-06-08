// Subscribe to new blocks via polling (works on any RPC).
// If your RPC supports WebSockets, swap `http()` for `webSocket(...)` and
// viem will use eth_subscribe under the hood.

import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain:     mainnet,
  transport: http(process.env.MAINNET_RPC_URL, { batch: true }),
  pollingInterval: 4_000,
});

const unwatch = client.watchBlocks({
  emitOnBegin: true,
  onBlock:  (block) => {
    console.log(`block ${block.number} · ${block.transactions.length} tx · gasUsed ${block.gasUsed}`);
  },
  onError:  (err)   => console.error("watch error:", err.message),
});

process.on("SIGINT", () => { unwatch(); process.exit(0); });

