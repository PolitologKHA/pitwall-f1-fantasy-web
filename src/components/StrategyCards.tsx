import type { OptimizeResponse, StrategyName, StrategyResult } from "@/lib/types";

const strategyOrder: StrategyName[] = ["SAFE", "BALANCED", "AGGRESSIVE"];

const strategyStyles: Record<StrategyName, string> = {
  SAFE: "border-pit-lime/25 bg-pit-lime/10 text-pit-lime",
  BALANCED: "border-pit-cyan/25 bg-pit-cyan/10 text-pit-cyan",
  AGGRESSIVE: "border-pit-red/25 bg-pit-red/10 text-pit-red",
};

type StrategyCardsProps = {
  result: OptimizeResponse;
};

function formatNumber(value: number) {
  return value.toFixed(1);
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/10 py-2 last:border-b-0">
      <dt className="min-w-0 break-words text-sm text-slate-400">{label}</dt>
      <dd className="min-w-0 break-words text-right font-mono text-sm font-semibold text-white">
        {value}
      </dd>
    </div>
  );
}

function StrategyCard({
  name,
  strategy,
  isRecommended,
}: {
  name: StrategyName;
  strategy: StrategyResult;
  isRecommended: boolean;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-lg border border-white/10 bg-surface-900/90 p-5 shadow-glow">
      <div className="flex min-h-9 items-center justify-between gap-3">
        <span
          className={`rounded-md border px-3 py-1 font-mono text-xs font-semibold ${strategyStyles[name]}`}
        >
          {name}
        </span>
        {isRecommended ? (
          <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-surface-950">
            Recommended
          </span>
        ) : null}
      </div>

      <dl className="mt-5">
        <MetricRow label="Expected Net" value={formatNumber(strategy.expectedNet)} />
        <MetricRow label="Raw xPts" value={formatNumber(strategy.rawXpts)} />
        <MetricRow label="Transfers" value={strategy.transfers} />
        <MetricRow label="Paid Transfers" value={strategy.paidTransfers} />
        <MetricRow label="Penalty" value={strategy.penalty} />
        <MetricRow label="Cost" value={formatNumber(strategy.cost)} />
        <MetricRow label="Remaining Budget" value={formatNumber(strategy.remainingBudget)} />
        <MetricRow label="Confidence" value={strategy.confidence} />
      </dl>

      <div className="mt-5 flex min-w-0 flex-1 flex-col gap-3 text-sm leading-6 text-slate-300">
        <p className="min-w-0 break-words whitespace-normal">
          <span className="font-semibold text-white">Changes:</span>{" "}
          {strategy.transferPlan.length > 0
            ? strategy.transferPlan.map((move) => `${move.out} → ${move.in}`).join(", ")
            : "Hold current team"}
        </p>
        <p className="min-w-0 break-words whitespace-normal">
          <span className="font-semibold text-white">Transfer Advice:</span>{" "}
          {strategy.transferAdvice}
        </p>
        <p className="min-w-0 break-words whitespace-normal">
          <span className="font-semibold text-white">Budget Advice:</span>{" "}
          {strategy.budgetAdvice}
        </p>
        <p className="mt-auto min-w-0 rounded-md border border-white/10 bg-white/[0.045] p-3 break-words whitespace-normal">
          {strategy.verdict}
        </p>
      </div>
    </article>
  );
}

export function StrategyCards({ result }: StrategyCardsProps) {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3">
      {strategyOrder.map((name) => (
        <StrategyCard
          key={name}
          name={name}
          strategy={result.strategies[name]}
          isRecommended={name === result.recommendedStrategy}
        />
      ))}
    </div>
  );
}
