import type { LucideIcon } from "lucide-react";

type StrategyCardProps = {
  icon: LucideIcon;
  name: string;
  headline: string;
  description: string;
  accent: string;
};

export function StrategyCard({
  icon: Icon,
  name,
  headline,
  description,
  accent,
}: StrategyCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-glow backdrop-blur transition hover:border-white/20 hover:bg-white/[0.065]">
      <div className="flex items-center justify-between gap-4">
        <div className={`rounded-md border border-white/10 p-2 ${accent}`}>
          <Icon aria-hidden className="h-5 w-5" />
        </div>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          {name}
        </span>
      </div>
      <h3 className="mt-7 text-xl font-semibold text-white">{headline}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}
