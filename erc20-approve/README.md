# erc20-approve

Three approaches to letting a contract move your ERC-20:

1. **`approve` + `transferFrom`** — the classic. Requires two on-chain transactions and a gas payment for the approval itself.
2. **`permit` (EIP-2612)** — the token issuer signs one message off-chain, and the spender delivers it in the same transaction that spends. One tx total, no approval gas. Not every token supports it — the token contract needs an EIP-2612 permit implementation.
3. **Permit2 (Uniswap)** — a middle-layer contract you approve once (up to max), then every subsequent approval is a signed message routed through Permit2. Works with any ERC-20, at the cost of the initial approval to the Permit2 contract.

Files:

- `01-classic-approve.ts` — the two-transaction flow.
- `02-permit-2612.ts` — signing a `permit` message and using it inline.
- `03-permit2.ts` — signing a `PermitSingle` for the Permit2 contract.

Which one to reach for depends on the token: USDC has native permit, so option 2 works and is cheapest. WETH does not, so you either eat the extra approve tx or route through Permit2.
