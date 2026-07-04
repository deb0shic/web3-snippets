# merkle-proofs

Build a merkle tree over `(address, amount)` pairs, then produce and verify per-address proofs. Layout matches `@openzeppelin/merkle-tree` so the same root works with `MerkleProof.verify` in OZ contracts.

Files:

- `build.ts`  — takes a JSON file of allocations and writes tree + root + per-address proofs.
- `verify.ts` — verifies a proof against a root, mimicking what an on-chain `MerkleDistributor` checks.

Typical use: airdrops, allowlists, batched refunds — anywhere you want to commit to a large set of `(who, how much)` pairs with one 32-byte root.

