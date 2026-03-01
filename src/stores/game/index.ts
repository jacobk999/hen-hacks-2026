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

export type GameState = {
  eventOccurences: EventOccurence[];
  events: Event[];
  currentEvents: CurrentEvent[];
  characters: Character[];
  stats: Stats;
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
  day: 0,

  // actions
  newDay: () =>
    set((s) => {
      const money = s.stats.money + 20_000;

      const possibleEvents = s.events.filter((event) => event.criteria(s));

      const numberOfEvents = Math.floor(Math.random() * 3) + 2;
      const chosenEvents = selectUniqueEvents(possibleEvents, numberOfEvents);
      const currentEvents: CurrentEvent[] = chosenEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        choices: event.choices,
        location: chooseRandomlyFromList(event.locations),
        repeatable: event.repeatable,
      }));

      return {
        stats: { ...s.stats, money },
        day: s.day + 1,
        currentEvents,
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

const selectUniqueEvents = (events: Event[], x: number): Event[] => {
  const selected: Event[] = [];
  const pool = [...events];

  // Track specific stations that are already "busy" this turn
  const occupiedStations = new Set<string>();

  // Use a while loop to ensure we try to fill 'x' slots
  while (selected.length < x && pool.length > 0) {
    const totalWeight = pool.reduce((acc, e) => acc + e.weight, 0);
    let random = Math.random() * totalWeight;

    let pickedIndex = -1;
    for (let j = 0; j < pool.length; j++) {
      if (random < pool[j].weight) {
        pickedIndex = j;
        break;
      }
      random -= pool[j].weight;
    }

    if (pickedIndex !== -1) {
      // Extract the event from the pool
      const [event] = pool.splice(pickedIndex, 1);

      // Find which of this event's locations are actually free
      const freeLocations = event.locations.filter(
        (loc) => !occupiedStations.has(loc),
      );

      if (freeLocations.length > 0) {
        // Pick one of the locations
        const finalLocation =
          freeLocations[Math.floor(Math.random() * freeLocations.length)];

        // Push a copy of the event, but force its locations array to only be the one station we picked.
        selected.push({
          ...event,
          locations: [finalLocation],
        });

        // Mark that station as taken
        occupiedStations.add(finalLocation);
      }
      // If no locations were free, the event is simply discarded from the pool and the loop continues to the next candidate.
    }
  }

  return selected;
};
