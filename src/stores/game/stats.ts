import type { GameState } from ".";

export type Stats = {
  money: number;
  minimumDailyExpenses: number;
  customerSatisfaction: number;
  employees: number;
  employeeWellbeing: number;
  security: number;
  safety: number;
  cleanliness: number;
  environment: number;
};

export const stats: Stats = {
  money: 100_000,
  minimumDailyExpenses: 10_000,
  employees: 50,
  customerSatisfaction: 2.5,
  employeeWellbeing: 2.5,
  security: 2.5,
  safety: 2.5,
  cleanliness: 2.5,
  environment: 2.5,
};

export const updateStats = (
  state: GameState,
  changes: Partial<Stats>,
): Partial<GameState> => {
  const round = (num: number) => Math.round(num * 100) / 100;
  const clampAndRound = (val: number) => round(Math.min(5, Math.max(0, val)));

  const s = state.stats;
  const c = changes;

  const newEmployees = Math.max(0, s.employees + (c.employees ?? 0));
  const newExpenses = newEmployees * 200 + 10000;

  return {
    stats: {
      ...s,
      money: s.money + (c.money ?? 0),
      employees: newEmployees,
      minimumDailyExpenses: newExpenses,

      // Star Ratings
      customerSatisfaction: clampAndRound(
        s.customerSatisfaction + (c.customerSatisfaction ?? 0),
      ),
      employeeWellbeing: clampAndRound(
        s.employeeWellbeing + (c.employeeWellbeing ?? 0),
      ),
      security: clampAndRound(s.security + (c.security ?? 0)),
      safety: clampAndRound(s.safety + (c.safety ?? 0)),
      cleanliness: clampAndRound(s.cleanliness + (c.cleanliness ?? 0)),
      environment: clampAndRound(s.cleanliness + (c.cleanliness ?? 0)),
    },
  };
};
