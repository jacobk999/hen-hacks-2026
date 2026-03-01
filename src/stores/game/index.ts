import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { characters, type Character } from "./characters";
import {
  events,
  type Choice,
  type CurrentEvent,
  type Event,
  type EventOccurence,
  type EventLog,
} from "./events";
import { stats as initialStats, type Stats } from "./stats";
import { lines as initialLines, type Lines } from "./lines";

export type GameState = {
  eventOccurences: EventOccurence[];
  eventLog: EventLog[];
  events: Event[];
  currentEvents: CurrentEvent[];
  characters: Character[];
  stats: Stats;
  lines: Lines;
  day: number;
  isGameOver: boolean;
  failReason: string;
  score: number;
};

type Actions = {
  newDay: () => void;
  onEventUpdate: (event: CurrentEvent, choice: Choice) => void;
  addEvent: (event: Event) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState & Actions>()(
  persist(
    (set) => ({
      eventOccurences: [],
      eventLog: [],
      characters,
      events,
      currentEvents: [],
      stats: initialStats,
      lines: initialLines,
      day: 0,
      isGameOver: false,
      failReason: "",
      score: 0,

      resetGame: () =>
        set({
          day: 0,
          isGameOver: false,
          failReason: "",
          score: 0,
          stats: initialStats,
          lines: initialLines,
          currentEvents: [],
          eventOccurences: [],
          eventLog: [],
        }),

      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),

      onEventUpdate: (event, choice) =>
        set((state) => {
          const previousStats = state.stats;
          const choiceResult = choice.onSelect(state) ?? {};

          const newStats = choiceResult.stats
            ? { ...previousStats, ...choiceResult.stats }
            : previousStats;

          let effects: { stat: string; change: number }[] = [];
          const changedKeys = choiceResult.stats
            ? Object.keys(choiceResult.stats)
            : [];

          effects = changedKeys
            .map((key) => {
              const k = key as keyof Stats;
              const delta =
                Math.round(
                  ((newStats[k] ?? 0) - (previousStats[k] ?? 0)) * 100,
                ) / 100;
              return { stat: k, change: delta };
            })
            .filter((e) => e.change !== 0);

          const eventsList = choiceResult?.events ?? state.events;

          const logMessage = choiceResult.customMessage || choice.label;
          const newLogEntry = {
            title: event.title,
            choiceTitle: logMessage,
            effects: effects,
          };

          return {
            ...choiceResult,
            stats: newStats,
            eventLog: [...state.eventLog, newLogEntry],
            events: event.repeatable
              ? eventsList
              : eventsList.filter((e) => e.id !== event.id),
            currentEvents: state.currentEvents.filter(
              (ce) => ce.id !== event.id,
            ),
          };
        }),

      newDay: () =>
        set((s) => {
          const stats = s.stats;

          // Mass Resignation Logic
          let employeesLost = 0;
          const wellbeingPercent = stats.employeeWellbeing / 5;
          if (wellbeingPercent < 0.35) {
            const leaveRate = ((0.35 - wellbeingPercent) / 0.35) * 0.2;
            employeesLost = Math.floor(stats.employees * leaveRate);
          }
          const finalEmployees = Math.max(0, stats.employees - employeesLost);

          // Understaffing Decay
          let decayMultiplier = 0;
          if (finalEmployees < 30) {
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

          // Check Failure Conditions
          let failReason = "";
          if (money < 0) {
            failReason = "BANKRUPTCY: Your have lost all your money.";
          } else if (finalEmployees <= 10) {
            failReason = "ABANDONMENT: No one is left to operate the subway.";
          } else if (stats.customerSatisfaction <= 0) {
            failReason =
              "RIOTS: The city has shuttered your station due to public outcry.";
          }

          if (failReason) {
            return {
              isGameOver: true,
              failReason,
              score: s.day * 1000,
              stats: { ...stats, money, employees: finalEmployees },
            };
          }

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

          const dayMarker = {
            title: "New Day Started",
            choiceTitle: `Day ${s.day + 1}`,
            effects: [], // You can list daily profits/expenses here!
          };

          return {
            day: s.day + 1,
            eventLog: [...s.eventLog, dayMarker],
            currentEvents,
            stats: {
              ...stats,
              money,
              employees: finalEmployees,
              totalExpenses,
              safety: applyDecay(stats.safety),
              security: applyDecay(stats.security),
              cleanliness: applyDecay(stats.cleanliness),
              environment: applyDecay(stats.environment),
              customerSatisfaction: applyDecay(stats.customerSatisfaction),
              employeeWellbeing: applyDecay(stats.employeeWellbeing),
            },
          };
        }),
    }),
    // Saving Data
    {
      name: "metro-mgmt-save-v1",
      storage: createJSONStorage(() => localStorage),

      // Save important info and current events
      partialize: (state) => ({
        stats: state.stats,
        lines: state.lines,
        day: state.day,
        currentEvents: state.currentEvents,
        eventOccurences: state.eventOccurences,
        eventLog: state.eventLog,
        isGameOver: state.isGameOver,
        failReason: state.failReason,
        score: state.score,
      }),

      // Reattach functions to current events by ID
      onRehydrateStorage: () => (state) => {
        if (!state || !state.currentEvents) return;

        state.currentEvents = state.currentEvents.map((persistedEvent) => {
          const original = events.find((e) => e.id === persistedEvent.id);

          if (original) {
            // Merge the saved location data with the original's functions
            return {
              ...original,
              location: persistedEvent.location,
            };
          }
          return persistedEvent;
        });
      },
    },
  ),
);

// --- Helpers ---
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
  lines: Lines,
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
      const reachableLocations = event.locations.filter((loc) => {
        const lineKeys = STATION_LINES[loc] || [];
        const isAccessible = lineKeys.some(
          (key) => lines[key as keyof Lines] !== false,
        );
        return isAccessible && !occupiedStations.has(loc);
      });

      if (reachableLocations.length > 0) {
        const finalLocation = chooseRandomlyFromList(reachableLocations);
        selected.push({ ...event, locations: [finalLocation] });
        occupiedStations.add(finalLocation);
      }
    }
  }
  return selected;
};
