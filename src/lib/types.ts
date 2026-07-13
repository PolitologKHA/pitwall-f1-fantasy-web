export type StrategyName = "SAFE" | "BALANCED" | "AGGRESSIVE";
export type AssetCategory = "driver" | "constructor";

export type TransferMove = {
  category: AssetCategory;
  out: string;
  in: string;
  outPrice: number;
  inPrice: number;
  priceDelta: number;
  expectedGain: number;
  reason: string;
};

export type OptimizeRequest = {
  drivers: string[];
  constructors: string[];
  currentBudgetCap: number;
  currentFreeTransfers: number;
};

export type StrategyResult = {
  expectedNet: number;
  rawXpts: number;
  transfers: number;
  paidTransfers: number;
  penalty: number;
  cost: number;
  remainingBudget: number;
  confidence: string;
  transferAdvice: string;
  budgetAdvice: string;
  verdict: string;
  recommendedDrivers: string[];
  recommendedConstructors: string[];
  keptDrivers: string[];
  keptConstructors: string[];
  transferPlan: TransferMove[];
};

export type OptimizeResponse = {
  recommendedStrategy: StrategyName;
  strategies: Record<StrategyName, StrategyResult>;
};
