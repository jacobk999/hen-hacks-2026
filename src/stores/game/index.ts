import { create } from "zustand";
import { characters, type Character } from "./characters";
import {
  events,
  type Choice,
  type CurrentEvent,
  type Event,
  type EventOccurence,
} from "./events";
import { stats, type Stats } from "./stats";
import { lines, type Lines } from "./lines";

export type GameState = {
  eventOccurences: EventOccurence[];
  events: Event[];
  currentEvents: CurrentEvent[];
  characters: Character[];
  stats: Stats;
  lines: Lines;
  day: number;
};

type Actions = {
  newDay: () => void;
  onEventUpdate: (event: CurrentEvent, choice: Choice) => void;
  addEvent: (event: Event) => void;
};

export const useGameStore = create<GameState & Actions>((set) => ({
  eventOccurences: [],
  characters,
  events,
  currentEvents: [],
  stats,
  lines,
  day: 0,

  // actions
  newDay: () =>
    set((s) => {
      const stats = s.stats;

      // --- 1. Mass Resignation Logic ---
      // If wellbeing < 1.75 (35% of 5 stars), up to 20% leave
      let employeesLost = 0;
      const wellbeingPercent = stats.employeeWellbeing / 5;
      if (wellbeingPercent < 0.35) {
        // Linear scale: At 35% wellbeing -> 0% leave. At 0% wellbeing -> 20% leave.
        const leaveRate = ((0.35 - wellbeingPercent) / 0.35) * 0.2;
        employeesLost = Math.floor(stats.employees * leaveRate);
      }
      const finalEmployees = Math.max(0, stats.employees - employeesLost);

      // --- 2. Understaffing Decay ---
      // Below 30 employees, stats decay. Max decay at 10 employees.
      let decayMultiplier = 0;
      if (finalEmployees < 30) {
        // Scale from   30 (0% decay) down to 10 (100% of max decay)
        decayMultiplier = Math.min(1, (30 - finalEmployees) / 20);
      }

      const applyDecay = (val: number) => {
        if (decayMultiplier <= 0) return val;
        const amount = Math.max(val * 0.2, 0.2) * decayMultiplier;
        return Math.round(Math.max(0, val - amount) * 100) / 100;
      };

      // Economy
      const moneyMultiplier = 0.5 + stats.customerSatisfaction * 0.2;
      const dailyProfit = stats.dailyProfit * moneyMultiplier;
      const totalExpenses =
        finalEmployees * stats.employeeWage + stats.dailyExpenses;
      const money = stats.money + (dailyProfit - totalExpenses);

      // Event Selection
      const possibleEvents = s.events.filter((event) => event.criteria(s));
      const numberOfEvents = Math.floor(Math.random() * 3) + 2;
      const chosenEvents = selectUniqueEvents(
        possibleEvents,
        numberOfEvents,
        s.lines,
      );
      const currentEvents = chosenEvents.map((event) => ({
        ...event,
        location: chooseRandomlyFromList(event.locations),
      }));

      return {
        day: s.day + 1,
        currentEvents,
        stats: {
          ...stats,
          money,
          employees: finalEmployees,
          totalExpenses,
          // Apply decay to all quality stats
          safety: applyDecay(stats.safety),
          security: applyDecay(stats.security),
          cleanliness: applyDecay(stats.cleanliness),
          environment: applyDecay(stats.environment),
          customerSatisfaction: applyDecay(stats.customerSatisfaction),
          employeeWellbeing: applyDecay(stats.employeeWellbeing),
        },
      };
    }),

  onEventUpdate: (event, choice) =>
    set((state) => {
      const choiceUpdates = choice.onSelect(state) ?? {};
      const events = choiceUpdates?.events ?? state.events;

      return {
        ...choiceUpdates,
        events: event.repeatable
          ? events
          : events.filter((e) => e.id != event.id),
        currentEvents: state.currentEvents.filter(
          (currentEvent) => currentEvent != event,
        ),
      };
    }),

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
}));

const chooseRandomlyFromList = <T>(list: T[]) =>
  list[Math.floor(Math.random() * list.length)];

const STATION_LINES: Record<string, string[]> = {
  "North Plaza": ["red"],
  "Central Station": ["red", "blue"],
  "Old Town Square": ["red", "green"],
  "Riverside Terminal": ["red"],
  "Wild Hen Stadium": ["blue"],
  "Leo's Landing": ["blue", "green"],
  Eastside: ["blue"],
  "Three Stop": ["green"],
  "West End Junction": ["green"],
};

const selectUniqueEvents = (
  events: Event[],
  x: number,
  lines: any,
): Event[] => {
  const selected: Event[] = [];
  const pool = [...events];
  const occupiedStations = new Set<string>();

  while (selected.length < x && pool.length > 0) {
    const totalWeight = pool.reduce((acc, e) => acc + e.weight, 0);
    let random = Math.random() * totalWeight;

    const pickedIndex = pool.findIndex((e) => {
      if (random < e.weight) return true;
      random -= e.weight;
      return false;
    });

    if (pickedIndex !== -1) {
      const [event] = pool.splice(pickedIndex, 1);

      // Filter for stations that have at least one active line
      const reachableLocations = event.locations.filter((loc) => {
        const lineKeys = STATION_LINES[loc] || [];

        // A station is UP if ANY of its lines are true (enabled)
        const isAccessible = lineKeys.some((key) => {
          if (key === "red") return lines.red !== false;
          if (key === "blue") return lines.blue !== false;
          if (key === "green") return lines.green !== false;
          return true;
        });

        return isAccessible && !occupiedStations.has(loc);
      });

      if (reachableLocations.length > 0) {
        const finalLocation =
          reachableLocations[
            Math.floor(Math.random() * reachableLocations.length)
          ];

        selected.push({
          ...event,
          locations: [finalLocation],
        });

        occupiedStations.add(finalLocation);
      }
    }
  }

  return selected;
};
