"use client";

import { PageHeader } from "../components/PageHeader";
import { Frame } from "../components/Frame";
import { CodeBlock } from "../components/CodeBlock";

const tsCode = `import {
  keccak256, toBytes, hashTypedData,
  hashDomain, hashStruct, concat, numberToHex,
} from 'viem'

// 1. EIP-712 digests
const domainHash  = hashDomain({ domain, types })
const messageHash = hashStruct({ data: message, types, primaryType })
const digest      = hashTypedData({ domain, types, primaryType, message })

// 2. Calldata digest — chainId is intentionally NOT mixed in
function calldataDigest(calldata: \`0x\${string}\`): \`0x\${string}\` {
  const bytes  = toBytes(calldata)
  const lenWord = numberToHex(bytes.length, { size: 32 })
  return keccak256(concat([toBytes(lenWord), bytes]))
}`;

const rsCode = `use alloy_primitives::{keccak256, B256, U256};

// Calldata digest: keccak256( uint256(len) ‖ calldata )
pub fn calldata_digest(calldata: &[u8]) -> B256 {
    let mut buf = Vec::with_capacity(32 + calldata.len());
    buf.extend_from_slice(&U256::from(calldata.len()).to_be_bytes::<32>());
    buf.extend_from_slice(calldata);
    keccak256(&buf)
}

// EIP-712 digest is alloy_sol_types::SolStruct::eip712_signing_hash
// or compute manually:  keccak256(0x1901 ‖ domain_separator ‖ struct_hash)`;

const swiftCode = `import CryptoKit

// Calldata digest
func calldataDigest(_ calldata: Data) -> Data {
    var preimage = Data(count: 32 - lengthBytes(calldata.count).count)
    preimage.append(lengthBytes(calldata.count))   // big-endian uint256
    preimage.append(calldata)
    return Data(SHA3_256.hash(data: preimage))     // keccak256, not SHA3
}`;

const solCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Calldata digest — keccak256( uint256(len(data)) ‖ data )
function calldataDigest(bytes calldata data) pure returns (bytes32) {
    return keccak256(abi.encodePacked(uint256(data.length), data));
}

// EIP-712 digest — for verifying typed-data signatures on-chain
function eip712Digest(bytes32 domainHash, bytes32 messageHash) pure returns (bytes32) {
    return keccak256(abi.encodePacked(hex"1901", domainHash, messageHash));
}`;

export default function ImplementClient() {
  return (
    <>
      <PageHeader
        num="02"
        kicker="for wallet builders"
        title={
          <>
            How to ship<span className="serif-italic text-ink-dim"> ERC-8213.</span>
          </>
        }
        description={
          <>
            Two flows, four values, one rule: a signer must be able to read at least one fingerprint before approving. This page walks through each flow with reference code, then catalogues the edge cases that bite.
          </>
        }
      />

      <section className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ 02.A</div>
            <div className="marginalia mt-2">decision</div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-2xl md:text-4xl leading-tight">First, what kind of request is this?</h2>
            <p className="mt-4 text-ink-dim text-base max-w-[640px] leading-relaxed">
              The four digests divide cleanly along one axis: whether the user is signing typed data or authorising a raw transaction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Frame className="p-6 md:p-8">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="section-num">A</span>
              <h3 className="text-lg uppercase tracking-[0.15em]">EIP-712 typed data</h3>
            </div>
            <p className="serif-italic text-ink-dim text-base mb-6">eth_signTypedData_v4 and friends.</p>
            <ul className="space-y-3 text-sm text-ink-dim leading-relaxed">
              <li>
                <span className="text-accent mr-2">→</span>Compute <code className="inline">domainHash</code>,{" "}
                <code className="inline">messageHash</code>, <code className="inline">digest</code>.
              </li>
              <li>
                <span className="text-accent mr-2">→</span>
                <span className="text-ink">Display</span> <code className="inline">digest</code> alone, or all three.
              </li>
              <li>
                <span className="text-accent mr-2">→</span>Place the digest where a signer reads it before approving — not three taps deep.
              </li>
            </ul>
          </Frame>
          <Frame className="p-6 md:p-8">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="section-num">B</span>
              <h3 className="text-lg uppercase tracking-[0.15em]">Raw transaction calldata</h3>
            </div>
            <p className="serif-italic text-ink-dim text-base mb-6">eth_sendTransaction, eth_signTransaction.</p>
            <ul className="space-y-3 text-sm text-ink-dim leading-relaxed">
              <li>
                <span className="text-accent mr-2">→</span>Compute <code className="inline">calldataDigest</code>.
              </li>
              <li>
                <span className="text-accent mr-2">→</span>
                <span className="text-ink">Display</span> the result as a 0x-prefixed hex string.
              </li>
              <li>
                <span className="text-accent mr-2">→</span>Do not include chainId in the preimage.
              </li>
            </ul>
          </Frame>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ 02.B</div>
            <div className="marginalia mt-2">display rules</div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-2xl md:text-4xl leading-tight">
              <span className="serif-italic text-ink-dim">Display, not </span>decoration.
            </h2>
            <ol className="editorial mt-10 text-base text-ink-dim leading-relaxed max-w-[700px]">
              <li>
                <span className="text-ink">Always 0x-prefixed.</span> Lower- or upper-case hex; do not invent a custom encoding.
              </li>
              <li>
                <span className="text-ink">Never truncate without a reveal.</span> If space forces an ellipsis, give the user a way to read the full 32-byte value before signing.
              </li>
              <li>
                <span className="text-ink">Use a monospace face.</span> Variable fonts make digit comparison harder than it needs to be.
              </li>
              <li>
                <span className="text-ink">Group bytes for scanability.</span> Optional, but four- or eight-byte groups help eyeballed comparison against a hardware wallet screen.
              </li>
              <li>
                <span className="text-ink">Label every value.</span> A digest without a name is a number; a labelled digest is evidence.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ 02.C</div>
            <div className="marginalia mt-2">reference</div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-2xl md:text-4xl leading-tight">Reference implementations.</h2>
            <p className="mt-4 text-ink-dim text-base max-w-[640px] leading-relaxed">
              The two non-trivial bits: stripping <code className="inline">EIP712Domain</code> from the message struct hash, and length-prefixing the calldata before keccak. Everything else is plumbing.
            </p>

            <div className="mt-10 space-y-8">
              <CodeBlock language="TypeScript · viem" filename="digests.ts" raw={tsCode}>
                <code>
                  <span className="kw">import</span>
                  {" {\n  "}
                  <span className="fn">keccak256</span>,{" "}
                  <span className="fn">toBytes</span>,{" "}
                  <span className="fn">hashTypedData</span>,{"\n  "}
                  <span className="fn">hashDomain</span>,{" "}
                  <span className="fn">hashStruct</span>,{" "}
                  <span className="fn">concat</span>,{" "}
                  <span className="fn">numberToHex</span>,{"\n"}
                  {"} "}
                  <span className="kw">from</span>{" "}
                  <span className="str">{`'viem'`}</span>
                  {"\n\n"}
                  <span className="com">{`// 1. EIP-712 digests`}</span>
                  {"\n"}
                  <span className="kw">const</span> domainHash{"  "}={" "}
                  <span className="fn">hashDomain</span>{"({ domain, types })"}
                  {"\n"}
                  <span className="kw">const</span> messageHash ={" "}
                  <span className="fn">hashStruct</span>
                  {"({ data: message, types, primaryType })"}
                  {"\n"}
                  <span className="kw">const</span> digest{"      "}={" "}
                  <span className="fn">hashTypedData</span>
                  {"({ domain, types, primaryType, message })"}
                  {"\n\n"}
                  <span className="com">
                    {`// 2. Calldata digest — chainId is intentionally NOT mixed in`}
                  </span>
                  {"\n"}
                  <span className="kw">function</span>{" "}
                  <span className="fn">calldataDigest</span>(calldata:{" "}
                  <span className="str">{`\`0x\${string}\``}</span>):{" "}
                  <span className="str">{`\`0x\${string}\``}</span> {"{"}
                  {"\n  "}
                  <span className="kw">const</span> bytes{"   "}={" "}
                  <span className="fn">toBytes</span>(calldata)
                  {"\n  "}
                  <span className="kw">const</span> lenWord ={" "}
                  <span className="fn">numberToHex</span>(bytes.length, {"{ size: "}
                  <span className="num">32</span>
                  {" })"}
                  {"\n  "}
                  <span className="kw">return</span>{" "}
                  <span className="fn">keccak256</span>({" "}
                  <span className="fn">concat</span>([
                  <span className="fn">toBytes</span>(lenWord), bytes]) )
                  {"\n"}
                  {"}"}
                </code>
              </CodeBlock>

              <CodeBlock language="Rust · alloy" filename="digests.rs" raw={rsCode}>
                <code>
                  <span className="kw">use</span>{" "}
                  alloy_primitives::{"{keccak256, B256, U256}"};{"\n\n"}
                  <span className="com">
                    {`// Calldata digest: keccak256( uint256(len) ‖ calldata )`}
                  </span>
                  {"\n"}
                  <span className="kw">pub fn</span>{" "}
                  <span className="fn">calldata_digest</span>(calldata:{" "}
                  <span className="kw">&</span>[
                  <span className="kw">u8</span>]) -&gt; B256 {"{"}
                  {"\n    "}
                  <span className="kw">let mut</span> buf = Vec::
                  <span className="fn">with_capacity</span>(<span className="num">32</span>{" "}
                  + calldata.<span className="fn">len</span>());
                  {"\n    "}
                  buf.<span className="fn">extend_from_slice</span>(&U256::
                  <span className="fn">from</span>(calldata.
                  <span className="fn">len</span>()).
                  <span className="fn">to_be_bytes</span>::&lt;
                  <span className="num">32</span>&gt;());
                  {"\n    "}
                  buf.<span className="fn">extend_from_slice</span>(calldata);
                  {"\n    "}
                  <span className="fn">keccak256</span>(&buf)
                  {"\n"}
                  {"}"}
                  {"\n\n"}
                  <span className="com">
                    {`// EIP-712 digest is alloy_sol_types::SolStruct::eip712_signing_hash`}
                  </span>
                  {"\n"}
                  <span className="com">
                    {`// or compute manually:  keccak256(0x1901 ‖ domain_separator ‖ struct_hash)`}
                  </span>
                </code>
              </CodeBlock>

              <CodeBlock language="Swift · CryptoKit" filename="digests.swift" raw={swiftCode}>
                <code>
                  <span className="kw">import</span> CryptoKit{"\n\n"}
                  <span className="com">{`// Calldata digest`}</span>
                  {"\n"}
                  <span className="kw">func</span>{" "}
                  <span className="fn">calldataDigest</span>(_ calldata: Data) -&gt; Data {"{"}
                  {"\n    "}
                  <span className="kw">var</span> preimage = Data(count: <span className="num">32</span> - lengthBytes(calldata.count).count)
                  {"\n    "}
                  preimage.<span className="fn">append</span>(lengthBytes(calldata.count)){"   "}
                  <span className="com">{`// big-endian uint256`}</span>
                  {"\n    "}
                  preimage.<span className="fn">append</span>(calldata)
                  {"\n    "}
                  <span className="kw">return</span> Data(SHA3_256.<span className="fn">hash</span>(data: preimage))     <span className="com">{`// keccak256, not SHA3`}</span>
                  {"\n"}
                  {"}"}
                </code>
              </CodeBlock>

              <CodeBlock language="Solidity" filename="Digests.sol" raw={solCode}>
                <code>
                  <span className="com">{`// SPDX-License-Identifier: MIT`}</span>
                  {"\n"}
                  <span className="kw">pragma solidity</span>{" "}
                  <span className="num">^0.8.20</span>;{"\n\n"}
                  <span className="com">
                    {`// Calldata digest — keccak256( uint256(len(data)) ‖ data )`}
                  </span>
                  {"\n"}
                  <span className="kw">function</span>{" "}
                  <span className="fn">calldataDigest</span>(<span className="kw">bytes calldata</span> data){" "}
                  <span className="kw">pure returns</span> (<span className="kw">bytes32</span>) {"{"}
                  {"\n    "}
                  <span className="kw">return</span>{" "}
                  <span className="fn">keccak256</span>(<span className="fn">abi.encodePacked</span>(<span className="kw">uint256</span>(data.length), data));
                  {"\n"}
                  {"}"}
                  {"\n\n"}
                  <span className="com">
                    {`// EIP-712 digest — for verifying typed-data signatures on-chain`}
                  </span>
                  {"\n"}
                  <span className="kw">function</span>{" "}
                  <span className="fn">eip712Digest</span>(<span className="kw">bytes32</span> domainHash, <span className="kw">bytes32</span> messageHash){" "}
                  <span className="kw">pure returns</span> (<span className="kw">bytes32</span>) {"{"}
                  {"\n    "}
                  <span className="kw">return</span>{" "}
                  <span className="fn">keccak256</span>(<span className="fn">abi.encodePacked</span>(
                  <span className="str">{`hex"1901"`}</span>, domainHash, messageHash));
                  {"\n"}
                  {"}"}
                </code>
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 md:px-10 mt-24 mb-32">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ 02.D</div>
            <div className="marginalia mt-2">edge cases</div>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="text-2xl md:text-4xl leading-tight">
              <span className="serif-italic text-ink-dim">Where </span>wallets get this wrong.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              {[
                {
                  t: "Stripping EIP712Domain",
                  b: (
                    <>
                      When computing <code className="inline">messageHash</code>, remove{" "}
                      <code className="inline">EIP712Domain</code> from the types map. Otherwise viem-style libraries refuse and ad-hoc implementations silently produce a different hash.
                    </>
                  ),
                },
                {
                  t: "Length-prefix encoding",
                  b: (
                    <>
                      The length is a 32-byte big-endian <code className="inline">uint256</code> — not a varint, not 4 bytes, not the byte length of the hex string.
                    </>
                  ),
                },
                {
                  t: "chainId is omitted",
                  b: (
                    <>
                      Deliberately. The same calldata produces the same digest across forks, which is the property auditors need. ChainId already appears in the EIP-712 domain hash where it belongs.
                    </>
                  ),
                },
                {
                  t: "Hex case",
                  b: (
                    <>
                      Pick one and stick with it. Mixed case in displayed digests turns &quot;byte equality&quot; into a vibes-based comparison.
                    </>
                  ),
                },
                {
                  t: "Display, not log",
                  b: (
                    <>
                      Console output isn&apos;t display. The signer needs to see the digest in the same surface as the approval button.
                    </>
                  ),
                },
                {
                  t: "Both, never one",
                  b: (
                    <>
                      A wallet that signs both EIP-712 and raw calldata must implement{" "}
                      <em className="serif-italic text-ink">both</em> digest types. Implementing one makes the other look more dangerous than it should.
                    </>
                  ),
                },
              ].map((e) => (
                <div key={e.t} className="border border-rule p-5 transition-colors hover:border-rule-strong">
                  <div className="text-accent text-[10px] tracking-[0.2em] uppercase mb-2">pitfall</div>
                  <h3 className="text-base text-ink mb-2">{e.t}</h3>
                  <p className="text-sm text-ink-dim leading-relaxed">{e.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
