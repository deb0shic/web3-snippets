// Verify a proof against a root without loading the whole tree.
// Mirrors what MerkleDistributor.verify(bytes32[] proof, bytes32 leaf) does
// on-chain.

import { keccak256, encodeAbiParameters, parseAbiParameters } from "viem";

function leafHash(address: `0x${string}`, amount: bigint): `0x${string}` {
  const inner = keccak256(encodeAbiParameters(parseAbiParameters("address, uint256"), [address, amount]));
  return keccak256(inner); // OZ StandardMerkleTree double-hashes leaves.
}

function processProof(leaf: `0x${string}`, proof: `0x${string}`[]): `0x${string}` {
  return proof.reduce<`0x${string}`>((h, sibling) => {
    return keccak256(
      h < sibling
        ? ("0x" + h.slice(2)      + sibling.slice(2)) as `0x${string}`
        : ("0x" + sibling.slice(2) + h.slice(2))      as `0x${string}`
    );
  }, leaf);
}

export function verify(
  root:    `0x${string}`,
  address: `0x${string}`,
  amount:  bigint,
  proof:   `0x${string}`[],
): boolean {
  return processProof(leafHash(address, amount), proof) === root;
}

// Example:
// const root = "0x…";
// const proof = ["0x…", "0x…"];
// verify(root, "0xabc…", 1_000_000n, proof);

