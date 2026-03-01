import { useGameStore } from "~/stores/game/index";
import { SubwayStats } from "./stats";
import { generateDynamicEvent } from "~/stores/game/gemini";
import { cn } from "~/lib/utils";
import { PlayBig } from "../icons/play-big";
import { EventLog } from "../event-log";
import { SubwayStationToLine } from "~/stores/game/location";

export function Sidebar({ className }: { className?: string }) {
  const newDay = useGameStore((s) => s.newDay);
  const day = useGameStore((s) => s.day);
  const stats = useGameStore((s) => s.stats);
  const lines = useGameStore((s) => s.lines);
  const addEvent = useGameStore((s) => s.addEvent);

  const eventsCompleted = useGameStore(
    (s) =>
      s.currentEvents.filter(
        (event) => s.lines[SubwayStationToLine[event.location]],
      ).length === 0,
  );

  return (
    <div className={cn("flex w-[300px] flex-col gap-3", className)}>
      <SubwayStats />
      <button
        disabled={!eventsCompleted}
        className="bg-red-500 p-2 rounded-lg text-white font-semibold flex gap-1 items-center justify-center disabled:bg-red-500/80 disabled:cursor-not-allowed transition-colors"
        onClick={() => {
          newDay();
        }}
      >
        <PlayBig variant="solid" className="size-4" />
        <p>Start Day {day + 1}</p>
      </button>
      <button
        className="bg-blue-500 p-2 rounded-lg text-white font-semibold"
        onClick={async () => {
          try {
            const event = await generateDynamicEvent({ stats, day, lines });
            console.log(event);
            addEvent(event);
          } catch (error) {
            console.error("Failed to generate event", error);
          }
        }}
      >
        Generate
      </button>
      <EventLog />
    </div>
  );
}
