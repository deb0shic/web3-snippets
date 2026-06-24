// SIWE-lite: server issues a nonce, client signs `<message>\n\n<nonce>` with
// `personal_sign`, server verifies signer address.

import { createWalletClient, http, verifyMessage } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const wallet  = createWalletClient({ account, chain: mainnet, transport: http() });

async function main() {
  const nonce   = crypto.randomUUID();
  const message = `Sign in to example.app\n\nNonce: ${nonce}`;

  const signature = await wallet.signMessage({ message });

  const ok = await verifyMessage({
    address: account.address,
    message,
    signature,
  });
  console.log("valid:", ok, "signer:", account.address);
}

main().catch(console.error);

