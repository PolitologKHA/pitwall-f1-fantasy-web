import { NextRequest, NextResponse } from "next/server";
import {
  CONSTRUCTOR_OPTIONS,
  CONSTRUCTOR_PRICES,
  DRIVER_OPTIONS,
  DRIVER_PRICES,
} from "@/lib/fantasyAssets";
import type { OptimizeRequest, StrategyName, StrategyResult, TransferMove } from "@/lib/types";

const mockStrategies: Record<
  StrategyName,
  Omit<
    StrategyResult,
    | "expectedNet"
    | "transfers"
    | "paidTransfers"
    | "penalty"
    | "cost"
    | "remainingBudget"
    | "recommendedDrivers"
    | "recommendedConstructors"
    | "keptDrivers"
    | "keptConstructors"
    | "transferPlan"
  >
> = {
  SAFE: {
    rawXpts: 88.4,
    confidence: "Medium-High",
    transferAdvice: "Bank 1 free transfer",
    budgetAdvice: "Budget stable",
    verdict: "Best for protecting rank with low transfer risk",
  },
  BALANCED: {
    rawXpts: 92.1,
    confidence: "Medium",
    transferAdvice: "Use planned transfers",
    budgetAdvice: "Low budget flexibility",
    verdict: "Best expected net score without paid transfers",
  },
  AGGRESSIVE: {
    rawXpts: 105.0,
    confidence: "Low-Medium",
    transferAdvice: "Paid transfer risk",
    budgetAdvice: "Low budget flexibility",
    verdict: "Higher upside, but penalty and confidence risk",
  },
};

const strategyConfig: Record<
  StrategyName,
  {
    preferredDrivers: string[];
    preferredConstructors: string[];
    expectedGainBase: number;
    reason: string;
  }
> = {
  SAFE: {
    preferredDrivers: [
      "Lando Norris",
      "Oscar Piastri",
      "George Russell",
      "Kimi Antonelli",
      "Gabriel Bortoleto",
      "Arvid Lindblad",
      "Alex Albon",
    ],
    preferredConstructors: ["McLaren", "Mercedes", "Racing Bulls", "Williams"],
    expectedGainBase: 2.0,
    reason: "Budget-safe upgrade with no paid transfer risk.",
  },
  BALANCED: {
    preferredDrivers: [
      "Lando Norris",
      "Oscar Piastri",
      "George Russell",
      "Kimi Antonelli",
      "Arvid Lindblad",
      "Carlos Sainz",
      "Gabriel Bortoleto",
    ],
    preferredConstructors: ["McLaren", "Mercedes", "Ferrari", "Racing Bulls"],
    expectedGainBase: 3.0,
    reason: "Improves expected net score while staying within budget.",
  },
  AGGRESSIVE: {
    preferredDrivers: [
      "Max Verstappen",
      "Lando Norris",
      "Oscar Piastri",
      "Charles Leclerc",
      "Kimi Antonelli",
      "Arvid Lindblad",
      "Isack Hadjar",
    ],
    preferredConstructors: ["McLaren", "Ferrari", "Red Bull Racing", "Mercedes"],
    expectedGainBase: 4.0,
    reason: "Higher upside pick for aggressive scoring.",
  },
};

function isOptimizeRequest(value: unknown): value is OptimizeRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Partial<OptimizeRequest>;
  const hasUniqueDrivers =
    Array.isArray(body.drivers) && new Set(body.drivers).size === body.drivers.length;
  const hasUniqueConstructors =
    Array.isArray(body.constructors) &&
    new Set(body.constructors).size === body.constructors.length;
  const selectedTeamCost =
    Array.isArray(body.drivers) && Array.isArray(body.constructors)
      ? body.drivers.reduce(
          (total, driver) => total + (typeof driver === "string" ? (DRIVER_PRICES[driver] ?? 0) : 0),
          0,
        ) +
        body.constructors.reduce(
          (total, constructor) =>
            total + (typeof constructor === "string" ? (CONSTRUCTOR_PRICES[constructor] ?? 0) : 0),
          0,
        )
      : 0;

  return (
    Array.isArray(body.drivers) &&
    body.drivers.length === 5 &&
    body.drivers.every(
      (driver) => typeof driver === "string" && DRIVER_OPTIONS.includes(driver),
    ) &&
    hasUniqueDrivers &&
    Array.isArray(body.constructors) &&
    body.constructors.length === 2 &&
    body.constructors.every(
      (constructor) =>
        typeof constructor === "string" && CONSTRUCTOR_OPTIONS.includes(constructor),
    ) &&
    hasUniqueConstructors &&
    typeof body.currentBudgetCap === "number" &&
    Number.isFinite(body.currentBudgetCap) &&
    body.currentBudgetCap > 0 &&
    selectedTeamCost <= body.currentBudgetCap &&
    typeof body.currentFreeTransfers === "number" &&
    Number.isInteger(body.currentFreeTransfers) &&
    body.currentFreeTransfers >= 0 &&
    body.currentFreeTransfers <= 3
  );
}

function teamCost(drivers: string[], constructors: string[]) {
  return Number(
    (
      drivers.reduce((total, driver) => total + DRIVER_PRICES[driver], 0) +
      constructors.reduce((total, constructor) => total + CONSTRUCTOR_PRICES[constructor], 0)
    ).toFixed(1),
  );
}

function keptAssets(current: string[], recommended: string[]) {
  return current.filter((asset) => recommended.includes(asset));
}

function expectedGain(strategyName: StrategyName, moveIndex: number) {
  const base = strategyConfig[strategyName].expectedGainBase;
  return Number((base + moveIndex * 1.1).toFixed(1));
}

function tryReplacement({
  category,
  currentTeam,
  preferredPool,
  prices,
  currentBudgetCap,
  strategyName,
  transferPlan,
}: {
  category: "driver" | "constructor";
  currentTeam: { drivers: string[]; constructors: string[] };
  preferredPool: string[];
  prices: Record<string, number>;
  currentBudgetCap: number;
  strategyName: StrategyName;
  transferPlan: TransferMove[];
}) {
  const team = category === "driver" ? currentTeam.drivers : currentTeam.constructors;
  const outIndex = team.findIndex((asset) => !preferredPool.includes(asset));

  if (outIndex === -1) {
    return false;
  }

  for (const candidate of preferredPool) {
    if (team.includes(candidate)) {
      continue;
    }

    const nextTeam = [...team];
    const outAsset = nextTeam[outIndex];
    nextTeam[outIndex] = candidate;

    const nextDrivers = category === "driver" ? nextTeam : currentTeam.drivers;
    const nextConstructors = category === "constructor" ? nextTeam : currentTeam.constructors;

    if (teamCost(nextDrivers, nextConstructors) > currentBudgetCap) {
      continue;
    }

    team[outIndex] = candidate;
    const outPrice = prices[outAsset];
    const inPrice = prices[candidate];

    transferPlan.push({
      category,
      out: outAsset,
      in: candidate,
      outPrice,
      inPrice,
      priceDelta: Number((inPrice - outPrice).toFixed(1)),
      expectedGain: expectedGain(strategyName, transferPlan.length),
      reason: strategyConfig[strategyName].reason,
    });

    return true;
  }

  return false;
}

function buildRecommendedTeam(
  strategyName: StrategyName,
  request: OptimizeRequest,
  maxTransfers: number,
) {
  const currentTeam = {
    drivers: [...request.drivers],
    constructors: [...request.constructors],
  };
  const transferPlan: TransferMove[] = [];
  const config = strategyConfig[strategyName];

  while (transferPlan.length < maxTransfers) {
    const changedDriver = tryReplacement({
      category: "driver",
      currentTeam,
      preferredPool: config.preferredDrivers,
      prices: DRIVER_PRICES,
      currentBudgetCap: request.currentBudgetCap,
      strategyName,
      transferPlan,
    });

    if (changedDriver || transferPlan.length >= maxTransfers) {
      continue;
    }

    const changedConstructor = tryReplacement({
      category: "constructor",
      currentTeam,
      preferredPool: config.preferredConstructors,
      prices: CONSTRUCTOR_PRICES,
      currentBudgetCap: request.currentBudgetCap,
      strategyName,
      transferPlan,
    });

    if (!changedConstructor) {
      break;
    }
  }

  return {
    recommendedDrivers: currentTeam.drivers,
    recommendedConstructors: currentTeam.constructors,
    keptDrivers: keptAssets(request.drivers, currentTeam.drivers),
    keptConstructors: keptAssets(request.constructors, currentTeam.constructors),
    transferPlan,
  };
}

function buildStrategy(
  strategyName: StrategyName,
  request: OptimizeRequest,
): StrategyResult {
  const strategy = mockStrategies[strategyName];
  const maxTransfers =
    strategyName === "SAFE" ? request.currentFreeTransfers : strategyName === "BALANCED" ? 2 : 3;
  const team = buildRecommendedTeam(strategyName, request, maxTransfers);
  const cost = teamCost(team.recommendedDrivers, team.recommendedConstructors);
  const transfers = team.transferPlan.length;
  const paidTransfers = Math.max(0, transfers - request.currentFreeTransfers);
  const penalty = paidTransfers * 10;

  return {
    ...strategy,
    transfers,
    paidTransfers,
    penalty,
    expectedNet: Number((strategy.rawXpts - penalty).toFixed(1)),
    cost,
    remainingBudget: Number((request.currentBudgetCap - cost).toFixed(1)),
    ...team,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!isOptimizeRequest(body)) {
    return NextResponse.json({ error: "Invalid team selection" }, { status: 400 });
  }

  return NextResponse.json({
    recommendedStrategy: "BALANCED",
    strategies: {
      SAFE: buildStrategy("SAFE", body),
      BALANCED: buildStrategy("BALANCED", body),
      AGGRESSIVE: buildStrategy("AGGRESSIVE", body),
    },
  });
}
