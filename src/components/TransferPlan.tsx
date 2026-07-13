import type { StrategyName, TransferMove } from "@/lib/types";

type TransferPlanProps = {
  mode?: "basic" | "pro";
  strategyName: StrategyName;
  recommendedDrivers: string[];
  recommendedConstructors: string[];
  keptDrivers: string[];
  keptConstructors: string[];
  transferPlan: TransferMove[];
};

function formatPrice(value: number) {
  return value.toFixed(1);
}

function AssetList({ title, assets }: { title: string; assets: string[] }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.045] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <li key={asset} className="min-w-0 break-words whitespace-normal">
              {asset}
            </li>
          ))
        ) : (
          <li className="text-slate-500">None</li>
        )}
      </ul>
    </div>
  );
}

export function TransferPlan({
  mode = "pro",
  strategyName,
  recommendedDrivers,
  recommendedConstructors,
  keptDrivers,
  keptConstructors,
  transferPlan,
}: TransferPlanProps) {
  const isBasic = mode === "basic";

  return (
    <section className="mb-6 min-w-0 rounded-lg border border-white/10 bg-surface-900/90 p-5 shadow-glow">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 break-words whitespace-normal">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pit-cyan">
            {isBasic ? "Balanced pick" : "Mock MVP recommendation"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {isBasic ? "Recommended Transfers" : "Recommended Transfer Plan"}
          </h2>
        </div>
        <span className="w-fit rounded-md border border-pit-red/30 bg-pit-red/10 px-3 py-1 font-mono text-xs font-semibold text-pit-red">
          {strategyName}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-white">Transfers</h3>
        {transferPlan.length > 0 ? (
          <div className="mt-3 grid gap-3">
            {transferPlan.map((move) => (
              <article
                key={`${move.category}-${move.out}-${move.in}`}
                className="min-w-0 rounded-md border border-white/10 bg-surface-950/70 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 break-words whitespace-normal">
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold capitalize text-surface-950">
                      {move.category}
                    </span>
                    <div className="mt-3 flex min-w-0 flex-col gap-2 text-sm text-slate-200 sm:flex-row sm:items-center">
                      <span className="min-w-0 break-words whitespace-normal">
                        OUT {move.out} (${formatPrice(move.outPrice)}m)
                      </span>
                      <span aria-hidden className="text-pit-red">
                        →
                      </span>
                      <span className="min-w-0 break-words whitespace-normal">
                        IN {move.in} (${formatPrice(move.inPrice)}m)
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-right sm:min-w-40">
                    <div className="rounded-md bg-white/[0.045] p-2">
                      <p className="text-xs text-slate-500">Delta</p>
                      <p className="font-mono text-sm font-semibold text-white">
                        {move.priceDelta >= 0 ? "+" : ""}
                        {formatPrice(move.priceDelta)}m
                      </p>
                    </div>
                    <div className="rounded-md bg-white/[0.045] p-2">
                      <p className="text-xs text-slate-500">Gain</p>
                      <p className="font-mono text-sm font-semibold text-pit-lime">
                        +{formatPrice(move.expectedGain)}
                      </p>
                    </div>
                  </div>
                </div>
                {isBasic ? null : (
                  <p className="mt-3 min-w-0 break-words whitespace-normal text-sm leading-6 text-slate-300">
                    {move.reason}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-md border border-white/10 bg-white/[0.045] p-4 text-sm text-slate-300">
            {isBasic
              ? "No transfers recommended. Hold current team."
              : "No changes recommended for this strategy."}
          </p>
        )}
      </div>

      <div className={`mt-5 grid gap-3 ${isBasic ? "" : "lg:grid-cols-2"}`}>
        <div>
          <h3 className="text-sm font-semibold text-white">Recommended Team</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <AssetList title="Drivers" assets={recommendedDrivers} />
            <AssetList title="Constructors" assets={recommendedConstructors} />
          </div>
        </div>
        {isBasic ? null : (
          <div>
            <h3 className="text-sm font-semibold text-white">Kept from current team</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <AssetList title="Kept drivers" assets={keptDrivers} />
              <AssetList title="Kept constructors" assets={keptConstructors} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
