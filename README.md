# web3-snippets

A grab bag of small on-chain code experiments. Everything here is a self-contained TypeScript example that I wrote to answer some specific question I had at the time. Kept them around so I do not have to figure them out from scratch again.

Nothing here is a library. Copy-paste, adapt, discard.

## Contents

| Folder | What is in it |
|--------|---------------|
| [`viem-basics/`](viem-basics/) | Public/wallet client setup, reading state, sending native tx, watching blocks |
| [`erc20-approve/`](erc20-approve/) | Classic `approve` vs `permit` (EIP-2612) vs `permit2` |
| [`merkle-proofs/`](merkle-proofs/) | Building and verifying merkle proofs client-side, using OZ-compatible layout |
| [`multicall/`](multicall/) | Batching reads through Multicall3; encoding, decoding, error handling |
| [`signatures/`](signatures/) | EIP-191 personal_sign vs EIP-712 typed data; verify offchain |

## Setup

Every folder has its own `package.json` if it needs one. Common deps:

```bash
pnpm install viem @openzeppelin/merkle-tree
```

Env vars are read from `.env` — copy `.env.example` and fill in RPC URLs. Do not commit private keys, obviously.

## Notes

- The examples target mainnet, Base, and Robinhood Chain interchangeably. Chain IDs are declared per-file.
- Where I use a private key I load it from `PRIVATE_KEY` env; every example prints what it is about to send before submitting.
- Some snippets use `simulateContract` to preview the call before dispatching. If a snippet does not, it is because I explicitly did not want the extra round trip.

## License

MIT
