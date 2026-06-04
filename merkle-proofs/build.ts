// Build an OZ-compatible merkle tree over (address, amount) pairs.
//
//   pnpm tsx merkle-proofs/build.ts allocations.json out/
//
// Writes root.txt, tree.json, and proofs/<addr>.json into `out/`.

import fs from "node:fs";
import path from "node:path";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

type Alloc = { address: `0x${string}`; amount: string };

function main() {
  const [inputPath, outDir] = process.argv.slice(2);
  if (!inputPath || !outDir) {
    console.error("usage: build.ts <allocations.json> <out-dir>");
    process.exit(1);
  }

  const allocations: Alloc[] = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  const values: [string, string][] = allocations.map((a) => [a.address, a.amount]);
  const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

  fs.mkdirSync(path.join(outDir, "proofs"), { recursive: true });
  fs.writeFileSync(path.join(outDir, "root.txt"), tree.root);
  fs.writeFileSync(path.join(outDir, "tree.json"), JSON.stringify(tree.dump(), null, 2));

  for (const [i, v] of tree.entries()) {
    const proof = tree.getProof(i);
    fs.writeFileSync(
      path.join(outDir, "proofs", `${v[0]}.json`),
      JSON.stringify({ address: v[0], amount: v[1], proof }, null, 2),
    );
  }
  console.log("root:", tree.root);
  console.log("entries:", values.length);
}

main();
