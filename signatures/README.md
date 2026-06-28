# signatures

Two ways your dapp can ask a user's wallet to sign:

- **EIP-191 `personal_sign`** — sign a raw string. Wallets show the human-readable message. Fine for login (Sign-In With Ethereum) but ambiguous for anything with structure — you cannot reason cleanly about the signed payload.
- **EIP-712 `signTypedData_v4`** — sign a typed structured message. Wallets can display each field with its name and type. Used by Permit, Permit2, Seaport, OpenSea listings, Snapshot votes.

Files:

- `personal-sign.ts` — SIWE-style login flow: nonce challenge, sign, verify.
- `typed-data.ts`     — sign an EIP-712 message and verify it locally.

