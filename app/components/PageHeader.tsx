import type { ReactNode } from "react";

export function PageHeader({
  num,
  kicker,
  title,
  italicTail,
  description,
}: {
  num: string;
  kicker: string;
  title: ReactNode;
  italicTail?: string;
  description?: ReactNode;
}) {
  return (
    <header className="pt-16 md:pt-24 pb-12 md:pb-16">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 md:col-span-2">
            <div className="section-num">§ {num}</div>
            <div className="marginalia mt-2">{kicker}</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-ink">
              {title}
              {italicTail ? (
                <span className="serif-italic text-ink-dim">
                  {" "}
                  {italicTail}
                </span>
              ) : null}
            </h1>
            {description ? (
              <p className="mt-6 text-base md:text-lg text-ink-dim max-w-[640px] leading-relaxed">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
