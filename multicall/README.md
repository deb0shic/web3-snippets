# multicall

Batch read calls through [Multicall3](https://www.multicall3.com/) so you only pay one HTTP round trip and one RPC quota unit per batch instead of one per call.

Files:

- `batch-erc20.ts` — read name/symbol/decimals/totalSupply for a whole list of tokens in one call.
- `batch-with-failures.ts` — using `aggregate3` so per-call failures do not tank the whole batch.

Under the hood viem's public client already batches calls when you enable `batch: true` on the transport, but doing it explicitly via Multicall3 works with any provider and lets you mix functions across contracts.

