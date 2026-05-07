import type { ReactNode } from "react";

export function Frame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`frame ${className}`}>
      <span className="corner-bl" />
      <span className="corner-br" />
      {children}
    </div>
  );
}
