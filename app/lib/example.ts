import type { TypedDataInput, Hex } from "./digests";

/** A canonical Permit2 example used across docs. */
export const examplePermit: TypedDataInput = {
  domain: {
    name: "Permit2",
    chainId: 1,
    verifyingContract: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  },
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    PermitTransferFrom: [
      { name: "permitted", type: "TokenPermissions" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    TokenPermissions: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  primaryType: "PermitTransferFrom",
  message: {
    permitted: {
      token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: "1000000000",
    },
    spender: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    nonce: "0",
    deadline: "1893456000",
  },
};

/**
 * Example calldata: a Uniswap V3 SwapRouter `exactInputSingle` for
 * 1,000 USDC → ≥ 0.42 WETH at 0.3% fee, recipient vitalik.eth.
 * Generated via viem's encodeFunctionData; 260 bytes total.
 */
export const exampleCalldata: Hex =
  "0x414bf389000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000000000070dbd880000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000005d423c655aa00000000000000000000000000000000000000000000000000000000000000000000";
