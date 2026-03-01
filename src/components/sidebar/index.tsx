import { useGameStore } from "~/stores/game/index";
import { SubwayStats } from "./stats";
import { generateDynamicEvent } from "~/stores/game/gemini";
import { cn } from "~/lib/utils";
import { PlayBig } from "../icons/play-big";
import { EventLog } from "../event-log";

export function Sidebar({ className }: { className?: string }) {
  const newDay = useGameStore((s) => s.newDay);
  const day = useGameStore((s) => s.day);
  const stats = useGameStore((s) => s.stats);
  const addEvent = useGameStore((s) => s.addEvent);

  return (
    <div className={cn("flex w-[300px] flex-col gap-3", className)}>
      <SubwayStats />
      <button
        className="bg-red-400 p-2 rounded-lg text-white font-medium flex gap-1 items-center justify-center"
        onClick={() => {
          newDay();
        }}
      >
        <PlayBig variant="solid" className="size-4" />
        <p>Start Day {day + 1}</p>
      </button>
      <button
        className="bg-blue-300 p-2 rounded-lg text-white font-medium"
        onClick={async () => {
          try {
            const event = await generateDynamicEvent(stats);
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
