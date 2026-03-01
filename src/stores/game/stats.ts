import type { GameState } from ".";

export type Stats = {
  money: number;
  dailyProfit: number;
  dailyExpenses: number;
  totalExpenses: number;
  customerSatisfaction: number;
  employeeWage: number;
  employees: number;
  employeeWellbeing: number;
  security: number;
  safety: number;
  cleanliness: number;
  environment: number;
};

export const stats: Stats = {
  money: 100_000,
  dailyProfit: 30_000,
  dailyExpenses: 10_000,
  totalExpenses: 20_000,
  employeeWage: 200,
  employees: 40,
  customerSatisfaction: 2.5,
  employeeWellbeing: 2.5,
  security: 2.5,
  safety: 2.5,
  cleanliness: 2.5,
  environment: 2.5,
};

export const updateStats = (state: GameState, changes: Partial<Stats>): Partial<GameState> => {
  const round = (num: number) => Math.round(num * 100) / 100;
  const clampAndRound = (val: number) => round(Math.min(5, Math.max(0, val)));

  const s = state.stats;
  const c = changes;

  // Multiplier Helpers
  const getUnifiedMult = (val: number) => 0.7 + (val / 5) * 0.6;
  const getGlobalSatMult = (score: number) => 0.3 + (score / 5) * 1.2;

  // Foundation Stats with Inverted Multipliers
  const safetyM = getUnifiedMult(s.security);
  const securityM = getUnifiedMult(s.safety);

  const newSafety = clampAndRound(
    s.safety + (c.safety ?? 0) * (c.safety && c.safety > 0 ? safetyM : 2 - safetyM),
  );
  const newSecurity = clampAndRound(
    s.security + (c.security ?? 0) * (c.security && c.security > 0 ? securityM : 2 - securityM),
  );

  const newClean = clampAndRound(s.cleanliness + (c.cleanliness ?? 0));
  const newEnv = clampAndRound(s.environment + (c.environment ?? 0));
  const newWellbeing = clampAndRound(s.employeeWellbeing + (c.employeeWellbeing ?? 0));

  // Global Station Quality & Satisfaction
  const qualityScore =
    newSafety * 0.3 + newSecurity * 0.25 + newClean * 0.2 + newWellbeing * 0.15 + newEnv * 0.1;
  const satM = getGlobalSatMult(qualityScore);

  // Economy & Wages
  const employeeWage = s.employeeWage + (c.employeeWage ?? 0);
  const newEmployees = Math.max(0, s.employees + (c.employees ?? 0));
  const totalExpenses = newEmployees * employeeWage + (s.dailyExpenses + (c.dailyExpenses ?? 0));

  return {
    stats: {
      ...s,
      money: s.money + (c.money ?? 0),
      dailyProfit: s.dailyProfit + (c.dailyProfit ?? 0),
      dailyExpenses: s.dailyExpenses + (c.dailyExpenses ?? 0),
      employees: newEmployees,
      employeeWage: employeeWage,
      totalExpenses: totalExpenses,
      safety: newSafety,
      security: newSecurity,
      cleanliness: newClean,
      environment: newEnv,
      employeeWellbeing: newWellbeing,
      customerSatisfaction: clampAndRound(
        s.customerSatisfaction +
          (c.customerSatisfaction ?? 0) *
            (c.customerSatisfaction && c.customerSatisfaction > 0 ? satM : 2 - satM),
      ),
    },
  };
};
