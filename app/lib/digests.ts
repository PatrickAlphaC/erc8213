import {
  keccak256,
  toBytes,
  toHex,
  hashTypedData,
  hashDomain,
  hashStruct,
  type TypedData,
  type TypedDataDomain,
  concat,
  numberToHex,
  size,
} from "viem";

export type Hex = `0x${string}`;

export function isHex(value: string): value is Hex {
  return /^0x([0-9a-fA-F]{2})*$/.test(value);
}

/**
 * ERC-8213 Calldata Digest:
 *   keccak256( uint256(len(calldata)) ‖ calldata )
 * The length is encoded as a 32-byte big-endian integer; chainId is
 * intentionally not mixed in.
 */
export function calldataDigest(calldata: Hex): Hex {
  const bytes = toBytes(calldata);
  const lenWord = numberToHex(bytes.length, { size: 32 });
  const preimage = concat([toBytes(lenWord), bytes]);
  return keccak256(preimage);
}

export type TypedDataInput = {
  domain: TypedDataDomain;
  types: TypedData;
  primaryType: string;
  // viem accepts an arbitrary record for `message`
  message: Record<string, unknown>;
};

export type EipDigests = {
  domainHash: Hex;
  messageHash: Hex;
  digest: Hex;
};

/** ERC-8213 EIP-712 digests. */
export function eip712Digests(input: TypedDataInput): EipDigests {
  const domainHash = hashDomain({
    domain: input.domain,
    types: input.types as TypedData,
  });

  // Strip EIP712Domain when computing the message struct hash, per EIP-712.
  const messageTypes = { ...(input.types as Record<string, unknown>) };
  delete (messageTypes as Record<string, unknown>).EIP712Domain;

  const messageHash = hashStruct({
    data: input.message,
    types: messageTypes as TypedData,
    primaryType: input.primaryType,
  });

  const digest = hashTypedData({
    domain: input.domain,
    types: input.types as TypedData,
    primaryType: input.primaryType,
    message: input.message,
  });

  return { domainHash, messageHash, digest };
}

/** Format helpers */
export function shortHex(h: Hex, head = 8, tail = 6): string {
  if (h.length <= head + tail + 4) return h;
  return `${h.slice(0, head + 2)}…${h.slice(-tail)}`;
}

export function byteLen(h: Hex): number {
  return size(h);
}

export { toHex, toBytes };
