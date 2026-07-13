"use client";

import { FormEvent, useMemo, useState } from "react";
import { Activity, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { TransferPlan } from "@/components/TransferPlan";
import {
  CONSTRUCTOR_OPTIONS,
  CONSTRUCTOR_PRICES,
  DRIVER_OPTIONS,
  DRIVER_PRICES,
} from "@/lib/fantasyAssets";
import type { OptimizeRequest, OptimizeResponse } from "@/lib/types";

const initialDrivers = [
  "Lando Norris",
  "Kimi Antonelli",
  "Alex Albon",
  "Arvid Lindblad",
  "Gabriel Bortoleto",
];
const initialConstructors = ["McLaren", "Audi"];
const teamSelectionError = "Please select 5 unique drivers and 2 unique constructors.";
const budgetCapError = "Selected team exceeds Current Budget Cap.";

export default function Home() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [constructors, setConstructors] = useState(initialConstructors);
  const [currentBudgetCap, setCurrentBudgetCap] = useState("106.7");
  const [currentFreeTransfers, setCurrentFreeTransfers] = useState("2");
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestBody = useMemo<OptimizeRequest>(
    () => ({
      drivers: drivers.map((driver) => driver.trim()),
      constructors: constructors.map((constructor) => constructor.trim()),
      currentBudgetCap: Number(currentBudgetCap),
      currentFreeTransfers: Number(currentFreeTransfers),
    }),
    [constructors, currentBudgetCap, currentFreeTransfers, drivers],
  );
  const currentTeamCost = useMemo(
    () =>
      drivers.reduce((total, driver) => total + (DRIVER_PRICES[driver] ?? 0), 0) +
      constructors.reduce(
        (total, constructor) => total + (CONSTRUCTOR_PRICES[constructor] ?? 0),
        0,
      ),
    [constructors, drivers],
  );
  const currentRemainingBudget = Number(currentBudgetCap) - currentTeamCost;
  const isOverBudget = Number.isFinite(currentRemainingBudget) && currentRemainingBudget < 0;
  const basicPick = result
    ? result.strategies.BALANCED ?? result.strategies[result.recommendedStrategy] ?? null
    : null;
  const basicPickName = result?.strategies.BALANCED ? "BALANCED" : result?.recommendedStrategy;

  function updateDriver(index: number, value: string) {
    setDrivers((current) =>
      current.map((driver, driverIndex) => (driverIndex === index ? value : driver)),
    );
  }

  function updateConstructor(index: number, value: string) {
    setConstructors((current) =>
      current.map((constructor, constructorIndex) =>
        constructorIndex === index ? value : constructor,
      ),
    );
  }

  function hasUniqueSelections(values: string[]) {
    const selectedValues = values.filter(Boolean);

    return selectedValues.length === values.length && new Set(selectedValues).size === values.length;
  }

  function isOptionDisabled(values: string[], currentIndex: number, option: string) {
    return values.some((value, index) => index !== currentIndex && value === option);
  }

  function formatPrice(value: number) {
    return value.toFixed(1);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!hasUniqueSelections(drivers) || !hasUniqueSelections(constructors)) {
      setError(teamSelectionError);
      return;
    }

    if (isOverBudget) {
      setError(budgetCapError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const payload = (await response.json()) as OptimizeResponse | { error?: string };

      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : "Strategy failed.");
      }

      setResult(payload as OptimizeResponse);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Strategy failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-950 px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="track-grid pointer-events-none fixed inset-0 opacity-40" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md border border-pit-red/40 bg-pit-red/10 shadow-red-glow">
                <Activity aria-hidden className="h-6 w-6 text-pit-red" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pit-red">
                F1 GridIQ Pick
              </p>
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              F1 GridIQ Pick
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Balanced F1 Fantasy team recommendation for the next Grand Prix.
            </p>
            <p className="mt-4 max-w-3xl rounded-md border border-white/10 bg-white/[0.045] p-3 text-sm leading-6 text-slate-400">
              MVP Preview: recommendations currently use mock calculations. Live optimizer
              integration coming next.
            </p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-300">
            $1.99 / GP preview
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <form
            onSubmit={onSubmit}
            className="rounded-lg border border-white/10 bg-surface-900/90 p-5 shadow-glow sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pit-cyan">
                  Your Team
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Current setup</h2>
              </div>
              <span className="rounded-md bg-pit-red/10 px-3 py-1 text-xs font-semibold text-pit-red">
                Manual input
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <fieldset className="grid gap-3">
                <legend className="text-sm font-semibold text-slate-200">Drivers</legend>
                <p className="text-xs text-slate-400">Choose 5 unique drivers</p>
                {drivers.map((driver, index) => (
                  <label key={index} className="grid gap-2">
                    <span className="text-xs font-medium text-slate-400">Driver {index + 1}</span>
                    <select
                      value={driver}
                      onChange={(event) => updateDriver(index, event.target.value)}
                      className="h-12 w-full rounded-md border border-white/10 bg-surface-950/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-pit-cyan focus:ring-4 focus:ring-pit-cyan/10"
                    >
                      <option value="">Select driver</option>
                      {DRIVER_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                          disabled={isOptionDisabled(drivers, index, option)}
                        >
                          {option} (${formatPrice(DRIVER_PRICES[option])}m)
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </fieldset>

              <fieldset className="grid gap-3">
                <legend className="text-sm font-semibold text-slate-200">Constructors</legend>
                <p className="text-xs text-slate-400">Choose 2 unique constructors</p>
                {constructors.map((constructor, index) => (
                  <label key={index} className="grid gap-2">
                    <span className="text-xs font-medium text-slate-400">
                      Constructor {index + 1}
                    </span>
                    <select
                      value={constructor}
                      onChange={(event) => updateConstructor(index, event.target.value)}
                      className="h-12 w-full rounded-md border border-white/10 bg-surface-950/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-pit-cyan focus:ring-4 focus:ring-pit-cyan/10"
                    >
                      <option value="">Select constructor</option>
                      {CONSTRUCTOR_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                          disabled={isOptionDisabled(constructors, index, option)}
                        >
                          {option} (${formatPrice(CONSTRUCTOR_PRICES[option])}m)
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">Current Budget Cap</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={currentBudgetCap}
                    onChange={(event) => setCurrentBudgetCap(event.target.value)}
                    className="h-12 rounded-md border border-white/10 bg-surface-950/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-pit-cyan focus:ring-4 focus:ring-pit-cyan/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Current Free Transfers
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    step="1"
                    value={currentFreeTransfers}
                    onChange={(event) => setCurrentFreeTransfers(event.target.value)}
                    className="h-12 rounded-md border border-white/10 bg-surface-950/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-pit-cyan focus:ring-4 focus:ring-pit-cyan/10"
                  />
                </label>
              </div>

              <div
                className={`grid gap-3 rounded-md border p-4 sm:grid-cols-3 ${
                  isOverBudget
                    ? "border-pit-red/40 bg-pit-red/10"
                    : "border-pit-cyan/20 bg-pit-cyan/10"
                }`}
              >
                <div className="min-w-0 break-words whitespace-normal">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Team Cost
                  </p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-white">
                    ${formatPrice(currentTeamCost)}m
                  </p>
                </div>
                <div className="min-w-0 break-words whitespace-normal">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Budget Cap
                  </p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-white">
                    ${formatPrice(Number(currentBudgetCap))}m
                  </p>
                </div>
                <div className="min-w-0 break-words whitespace-normal">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Remaining Budget
                  </p>
                  <p
                    className={`mt-1 font-mono text-2xl font-semibold ${
                      isOverBudget ? "text-pit-red" : "text-pit-lime"
                    }`}
                  >
                    ${formatPrice(currentRemainingBudget)}m
                  </p>
                </div>
                {isOverBudget ? (
                  <p className="text-sm font-medium text-red-100 sm:col-span-3">
                    Selected team exceeds Current Budget Cap. Choose cheaper assets before running
                    strategy.
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isOverBudget}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-pit-red px-5 text-sm font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-pit-red/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                  Running Strategy
                </>
              ) : (
                <>
                  Run Strategy
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </>
              )}
            </button>

            {error ? (
              <div
                className="mt-4 flex items-start gap-3 rounded-md border border-pit-red/30 bg-pit-red/10 p-4 text-sm text-red-100"
                role="alert"
              >
                <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-pit-red" />
                <p>{error}</p>
              </div>
            ) : null}
          </form>

          <section className="min-h-[420px] rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            {result ? (
              basicPick && basicPickName ? (
              <div>
                <div className="mb-6 min-w-0 rounded-lg border border-pit-red/35 bg-pit-red/10 p-5 shadow-red-glow">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 break-words whitespace-normal">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pit-red">
                        Your Balanced Pick
                      </p>
                      <p className="mt-2 text-4xl font-semibold text-white">
                        BALANCED
                      </p>
                    </div>
                    <span className="w-fit rounded-md bg-pit-red px-3 py-1 text-xs font-semibold text-white">
                      Pick
                    </span>
                  </div>

                  <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      ["Expected Net", basicPick.expectedNet.toFixed(1)],
                      ["Transfers", basicPick.transfers],
                      ["Paid Transfers", basicPick.paidTransfers],
                      ["Penalty", basicPick.penalty],
                      ["Team Cost", basicPick.cost.toFixed(1)],
                      ["Remaining Budget", basicPick.remainingBudget.toFixed(1)],
                      [
                        "Budget Status",
                        basicPick.remainingBudget >= 0 ? "Within budget" : "Over budget",
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="min-w-0 rounded-md border border-white/10 bg-surface-950/70 p-3 break-words whitespace-normal"
                      >
                        <dt className="text-xs text-slate-400">{label}</dt>
                        <dd className="mt-1 font-mono text-sm font-semibold text-white">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-200 lg:grid-cols-2">
                    <p className="min-w-0 rounded-md border border-white/10 bg-white/[0.045] p-3 break-words whitespace-normal">
                      <span className="font-semibold text-white">Transfer Advice:</span>{" "}
                      {basicPick.transferAdvice}
                    </p>
                    <p className="min-w-0 rounded-md border border-white/10 bg-white/[0.045] p-3 break-words whitespace-normal">
                      <span className="font-semibold text-white">Budget Advice:</span>{" "}
                      {basicPick.budgetAdvice}
                    </p>
                    <p className="min-w-0 rounded-md border border-white/10 bg-white/[0.045] p-3 break-words whitespace-normal lg:col-span-2">
                      <span className="font-semibold text-white">Recommendation:</span>{" "}
                      {basicPick.verdict}
                    </p>
                  </div>
                  <div className="mt-4 min-w-0 rounded-md border border-white/10 bg-surface-950/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Transfer Plan
                    </p>
                    {basicPick.transferPlan.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm text-slate-200">
                        {basicPick.transferPlan.slice(0, 3).map((move) => (
                          <li
                            key={`${move.category}-${move.out}-${move.in}`}
                            className="min-w-0 break-words whitespace-normal"
                          >
                            {move.out} -&gt; {move.in}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-slate-300">
                        No transfers recommended. Hold current team.
                      </p>
                    )}
                  </div>
                </div>
                <TransferPlan
                  mode="basic"
                  strategyName={basicPickName}
                  recommendedDrivers={basicPick.recommendedDrivers}
                  recommendedConstructors={basicPick.recommendedConstructors}
                  keptDrivers={basicPick.keptDrivers}
                  keptConstructors={basicPick.keptConstructors}
                  transferPlan={basicPick.transferPlan}
                />
                <div className="min-w-0 rounded-lg border border-white/10 bg-surface-900/90 p-5">
                  <p className="text-sm font-semibold text-white">Want deeper analysis?</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    F1 GridIQ Pro will include SAFE / BALANCED / AGGRESSIVE strategies,
                    transfer reasoning, driver comparisons and confidence scores.
                  </p>
                  <button
                    type="button"
                    disabled
                    className="mt-4 rounded-md border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-slate-300"
                  >
                    Pro Analysis coming soon
                  </button>
                </div>
              </div>
              ) : (
                <div className="rounded-md border border-pit-red/30 bg-pit-red/10 p-4 text-sm text-red-100">
                  Balanced pick is unavailable. Please run strategy again.
                </div>
              )
            ) : (
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-surface-950/50 p-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Strategy Output
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  Run a mock strategy comparison
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                  Results will show one balanced pick with expected net, transfers, budget room
                  and recommended changes.
                </p>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
