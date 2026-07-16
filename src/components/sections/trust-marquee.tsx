import { INDUSTRIES, TRUST_STATS } from "@/lib/data/industries";

function MarqueeRow({ items, className }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className="animate-marquee flex w-max shrink-0 items-center gap-4">
      {loop.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-muted whitespace-nowrap ${className ?? ""}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {item}
        </span>
      ))}
    </div>
  );
}

export function TrustMarquee() {
  return (
    <section className="relative border-y border-white/5 bg-surface/30 py-8" aria-label="Industries and trust indicators">
      <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="overflow-hidden">
          <MarqueeRow items={INDUSTRIES} />
        </div>
        <div className="overflow-hidden">
          <MarqueeRow items={TRUST_STATS} className="border-primary/20 text-highlight" />
        </div>
      </div>
    </section>
  );
}
