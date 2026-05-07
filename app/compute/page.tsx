import type { Metadata } from "next";
import { keccak256, toBytes, toHex, concat, numberToHex } from "viem";
import { PageHeader } from "../components/PageHeader";
import { Frame } from "../components/Frame";
import { OpenInCyfrin } from "../components/OpenInCyfrin";
import { eip712Digests, calldataDigest, byteLen } from "../lib/digests";
import { examplePermit, exampleCalldata } from "../lib/example";

export const metadata: Metadata = {
  title: "Compute — ERC-8213",
  description:
    "A worked example: every byte and every hash that lead from typed data to an ERC-8213 digest.",
};

/** Build the EIP-712 type string the way EIP-712 specifies. */
function typeString(
  types: Record<string, ReadonlyArray<{ name: string; type: string }>>,
  primary: string,
): string {
  const visited = new Set<string>();
  const order: string[] = [];

  const visit = (t: string) => {
    if (visited.has(t)) return;
    if (!types[t]) return;
    visited.add(t);
    order.push(t);
    for (const f of types[t]) {
      const base = f.type.replace(/\[.*\]$/, "");
      if (types[base]) visit(base);
    }
  };
  visit(primary);
  // EIP-712: primary first, then dependencies in alphabetical order
  const tail = order.slice(1).sort();
  const final = [primary, ...tail];
  return final
    .map(
      (n) =>
        `${n}(${(types[n] ?? []).map((f) => `${f.type} ${f.name}`).join(",")})`,
    )
    .join("");
}

export default function ComputePage() {
  const { domain, types, primaryType, message } = examplePermit;

  const domainTypeStr = typeString(
    types as Record<string, ReadonlyArray<{ name: string; type: string }>>,
    "EIP712Domain",
  );
  const messageTypeStr = typeString(
    types as Record<string, ReadonlyArray<{ name: string; type: string }>>,
    primaryType,
  );

  const domainTypeHash = keccak256(toBytes(domainTypeStr));
  const messageTypeHash = keccak256(toBytes(messageTypeStr));

  const { domainHash, messageHash, digest } = eip712Digests(examplePermit);

  const eip712Preimage = toHex(
    concat([toBytes("0x1901"), toBytes(domainHash), toBytes(messageHash)]),
  );

  const cdLen = byteLen(exampleCalldata);
  const cdLenWord = numberToHex(cdLen, { size: 32 });
  const cdPreimage = toHex(concat([toBytes(cdLenWord), toBytes(exampleCalldata)]));
  const cdDigest = calldataDigest(exampleCalldata);

  return (
    <>
      <PageHeader
        num="04"
        kicker="for the curious"
        title={
          <>
            Every byte,
            <span className="serif-italic text-ink-dim"> traced.</span>
          </>
        }
        description={
          <>
            A real example from typed data to digest, with every intermediate
            value surfaced. If you can reproduce these numbers with paper and a
            keccak implementation, you can audit any wallet that claims to
            implement ERC-8213.
          </>
        }
      />

      {/* Section A: EIP-712 walkthrough */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-10 mb-32">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ 04.A</div>
            <div className="marginalia mt-2">eip-712 walkthrough</div>
            <p className="serif-italic text-ink-dim text-sm mt-4 hidden md:block">
              from typed data to a single 32-byte fingerprint.
            </p>
          </div>
          <div className="col-span-12 md:col-span-10 space-y-12">
            <Step num="01" title="Start with typed data">
              <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                A Permit2 signing request authorising a transfer of 1,000 USDC.
                Every field below is part of what we&apos;re cryptographically
                committing to.
              </p>
              <Frame className="p-5">
                <pre className="text-xs leading-relaxed text-ink overflow-x-auto">
{JSON.stringify({ domain, primaryType, message }, null, 2)}
                </pre>
              </Frame>
            </Step>

            <Step num="02" title="Encode the EIP-712 type strings">
              <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                EIP-712 specifies a deterministic textual encoding: primary
                struct first, dependencies sorted alphabetically.
              </p>
              <Labeled label="domain type">
                <code className="block hex text-xs bg-bg-alt border border-rule p-3 break-all">
                  {domainTypeStr}
                </code>
              </Labeled>
              <Labeled label="message type">
                <code className="block hex text-xs bg-bg-alt border border-rule p-3 break-all">
                  {messageTypeStr}
                </code>
              </Labeled>
            </Step>

            <Step num="03" title="Hash each type string → typeHash">
              <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                Both type strings are utf-8 encoded and run through keccak256.
              </p>
              <HashRow label="domain typeHash" hash={domainTypeHash} />
              <HashRow label="message typeHash" hash={messageTypeHash} />
            </Step>

            <Step num="04" title="Encode and hash each struct">
              <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                <code className="inline">hashStruct(s) =
                  keccak256(typeHash ‖ encodeData(s))</code>
                . encodeData replaces dynamic types with their hashes and
                left-pads everything to 32 bytes.
              </p>
              <HashRow label="domainHash" hash={domainHash} primary />
              <HashRow label="messageHash" hash={messageHash} primary />
            </Step>

            <Step num="05" title="Build the EIP-712 digest preimage">
              <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                Concatenate the EIP-191 prefix, the domain hash, and the message
                hash. Two bytes plus thirty-two plus thirty-two equals sixty-six.
              </p>
              <div className="space-y-1 mb-3">
                <div className="grid grid-cols-[140px_1fr] gap-3 text-xs">
                  <span className="marginalia">prefix</span>
                  <code className="hex text-accent">0x1901</code>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-3 text-xs">
                  <span className="marginalia">domain hash</span>
                  <code className="hex break-all">{domainHash}</code>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-3 text-xs">
                  <span className="marginalia">message hash</span>
                  <code className="hex break-all">{messageHash}</code>
                </div>
              </div>
              <Labeled label="preimage (66 bytes)">
                <code className="block hex text-xs bg-bg-alt border border-rule p-3 break-all">
                  {eip712Preimage}
                </code>
              </Labeled>
            </Step>

            <Step num="06" title="keccak256 → the digest" final>
              <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                The single 32-byte value an ECDSA signer signs. This is the
                number a hardware wallet should put on its screen.
              </p>
              <Frame className="p-6 md:p-8 bg-bg-panel">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-accent text-[10px] tracking-[0.25em]">§01</span>
                  <span className="serif-italic text-ink-dim text-sm">
                    EIP-712 digest
                  </span>
                </div>
                <code className="hex block text-base md:text-lg break-all">
                  {digest}
                </code>
              </Frame>
            </Step>
          </div>
        </div>
      </section>

      {/* Section B: Calldata walkthrough */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <div className="section-num">§ 04.B</div>
              <div className="marginalia mt-2">calldata walkthrough</div>
              <p className="serif-italic text-ink-dim text-sm mt-4 hidden md:block">
                two operations: prepend a length, hash.
              </p>
            </div>
            <div className="col-span-12 md:col-span-10 space-y-12">
              <Step num="01" title="Start with the raw calldata">
                <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                  A Uniswap V3 <code className="inline">exactInputSingle</code>{" "}
                  call. {cdLen} bytes total — too long to read, just long enough
                  to fingerprint.
                </p>
                <Frame className="p-5">
                  <code className="hex block text-xs text-ink-dim break-all leading-relaxed">
                    {exampleCalldata}
                  </code>
                  <div className="mt-4 pt-4 border-t border-rule flex justify-end">
                    <OpenInCyfrin data={exampleCalldata} label="Decode in Cyfrin Tools" />
                  </div>
                </Frame>
              </Step>

              <Step num="02" title="Encode the length as a 32-byte word">
                <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                  Length is a big-endian <code className="inline">uint256</code>.{" "}
                  {cdLen} = 0x{cdLen.toString(16).padStart(2, "0")} → padded to
                  32 bytes.
                </p>
                <Labeled label={`length word — ${cdLen} (uint256)`}>
                  <code className="block hex text-xs bg-bg-alt border border-rule p-3 break-all">
                    {cdLenWord}
                  </code>
                </Labeled>
              </Step>

              <Step num="03" title="Concatenate length ‖ calldata">
                <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                  The preimage. Identical except for the length prefix, the same
                  calldata pasted twice would still produce the same digest
                  here — but two different payloads sharing a common prefix
                  cannot collide.
                </p>
                <Labeled label={`preimage — ${cdLen + 32} bytes`}>
                  <code className="block hex text-xs bg-bg-alt border border-rule p-3 break-all leading-relaxed">
                    {cdPreimage}
                  </code>
                </Labeled>
              </Step>

              <Step num="04" title="keccak256 → the digest" final>
                <p className="text-ink-dim text-sm leading-relaxed mb-4 max-w-[640px]">
                  The fingerprint. Reproducible from the calldata alone, on any
                  device, on any chain.
                </p>
                <Frame className="p-6 md:p-8 bg-bg-panel">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-accent text-[10px] tracking-[0.25em]">§04</span>
                    <span className="serif-italic text-ink-dim text-sm">
                      calldata digest
                    </span>
                  </div>
                  <code className="hex block text-base md:text-lg break-all">
                    {cdDigest}
                  </code>
                </Frame>
              </Step>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Step({
  num,
  title,
  children,
  final,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  final?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex items-baseline gap-4 mb-5">
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: final ? "var(--color-accent)" : "var(--color-ink-faint)" }}
        >
          step {num}
        </span>
        <h3 className={`text-xl md:text-2xl ${final ? "text-accent" : "text-ink"}`}>
          {title}
        </h3>
      </div>
      <div className="pl-0 md:pl-0">{children}</div>
    </div>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="marginalia mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function HashRow({
  label,
  hash,
  primary,
}: {
  label: string;
  hash: string;
  primary?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-3 text-xs items-baseline mb-2">
      <span className={`marginalia ${primary ? "text-accent" : ""}`}>
        {label}
      </span>
      <code className={`hex break-all ${primary ? "text-ink" : "text-ink-dim"}`}>
        {hash}
      </code>
    </div>
  );
}
