/**
 * Digest correctness + cross-repo parity.
 *
 * The hard-coded expected values below are the same vectors checked in
 * `cyfrin/chain-tools/src/lib/erc8213-parity.test.ts`, computed with both
 * ethers v6 and viem 2.x. If a refactor here drifts from those values, the
 * two repos disagree — and a wallet that verifies against either would see a
 * false mismatch. Update both sides together.
 */

import { describe, it, expect } from "vitest";
import { calldataDigest, eip712Digests, isHex } from "./digests";
import { examplePermit, exampleCalldata } from "./example";

describe("calldata digest", () => {
  it("matches the spec ERC-20 transfer vector", () => {
    const data =
      "0xa9059cbb" +
      "0000000000000000000000004675c7e5baafbffbca748158becba61ef3b0a263" +
      "0000000000000000000000000000000000000000000000000de0b6b3a7640000";
    expect(calldataDigest(data as `0x${string}`)).toBe(
      "0x812cee5d9cc7461c04bbcd7b70af9c28b243ac5d74d3453b008b93b7dac69985",
    );
  });

  it("computes a real digest for empty calldata (plain ETH transfer)", () => {
    // keccak256 of 32 zero bytes
    expect(calldataDigest("0x")).toBe(
      "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
    );
  });

  it("differs for shared-prefix payloads (length-prefix prevents collision)", () => {
    expect(calldataDigest("0xdeadbeef")).not.toBe(calldataDigest("0xdeadbeef00"));
  });

  it("is reproducible — pure function of the calldata bytes", () => {
    const a = calldataDigest(exampleCalldata);
    const b = calldataDigest(exampleCalldata);
    expect(a).toBe(b);
    expect(a).toMatch(/^0x[0-9a-f]{64}$/);
  });
});

describe("EIP-712 digests", () => {
  it("matches canonical Permit2 fixture", () => {
    const { domainHash, messageHash, digest } = eip712Digests(examplePermit);
    expect(domainHash).toBe(
      "0x866a5aba21966af95d6c7ab78eb2b2fc913915c28be3b9aa07cc04ff903e3f28",
    );
    expect(messageHash).toBe(
      "0x7d1be9b8c7677c8cc6adba965260e35822632ef4eb35ddd5d6aafe26cb1ef882",
    );
    expect(digest).toBe(
      "0x01e5a64a608f03873d795fe77fe6bcd1a15692ee25bc02dd638b8fbc3753625c",
    );
  });

  it("matches the EIP-712 spec Mail example", () => {
    const mail = {
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract:
          "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC" as const,
      },
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      },
      primaryType: "Mail",
      message: {
        from: { name: "Cow", wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826" },
        to: { name: "Bob", wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB" },
        contents: "Hello, Bob!",
      },
    };
    const { digest } = eip712Digests(mail);
    expect(digest).toBe(
      "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
    );
  });
});

describe("isHex", () => {
  it("accepts even-length 0x-prefixed hex", () => {
    expect(isHex("0xdeadbeef")).toBe(true);
    expect(isHex("0x")).toBe(true);
  });
  it("rejects odd-nibble hex", () => {
    expect(isHex("0xabc")).toBe(false);
  });
  it("rejects non-hex characters", () => {
    expect(isHex("0xzzzz")).toBe(false);
  });
});
