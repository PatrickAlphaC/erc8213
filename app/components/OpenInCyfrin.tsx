/**
 * Outbound link that opens calldata in the Cyfrin Tools ABI decoder.
 * The hex param is URI-encoded, but very long calldata (>~6 KB) may
 * exceed browser URL limits — in practice fine for typical transactions.
 */
export function OpenInCyfrin({
  data,
  className = "",
  label = "Decode in Cyfrin Tools",
}: {
  data: string;
  className?: string;
  label?: string;
}) {
  const href = `https://tools.cyfrin.io/abi-encoding?data=${encodeURIComponent(
    data,
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-ink-faint hover:text-accent transition-colors px-3 py-1.5 border border-rule-strong hover:border-accent ${className}`}
    >
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
