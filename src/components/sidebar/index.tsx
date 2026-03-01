import { useGameStore } from "~/stores/game/index";
import { SubwayStats } from "./stats";
import { generateMultipleDynamicEvents } from "~/stores/game/gemini";
import { cn } from "~/lib/utils";
import { PlayBig } from "../icons/play-big";
import { EventLog } from "./event-log";
import { SubwayStationToLine } from "~/stores/game/location";
import { useTransition } from "react";
import { Ai01 } from "../icons/ai-01";

export function Sidebar({ className }: { className?: string }) {
  const newDay = useGameStore((s) => s.newDay);
  const day = useGameStore((s) => s.day);
  const stats = useGameStore((s) => s.stats);
  const lines = useGameStore((s) => s.lines);
  const addEvent = useGameStore((s) => s.addEvent);

  const [isGenerating, startGenerating] = useTransition();

  const eventsCompleted = useGameStore(
    (s) =>
      s.currentEvents.filter((event) => s.lines[SubwayStationToLine[event.location]]).length === 0,
  );

  return (
    <div className={cn("flex w-[300px] flex-col h-full justify-between", className)}>
      <div className="flex flex-col gap-3">
        <SubwayStats />

        <button
          // Disable Start Day if currently generating
          disabled={!eventsCompleted || isGenerating}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-bold text-white transition-all duration-200 shadow-lg",
            "bg-red-500 hover:bg-red-600 hover:scale-102 active:scale-98",
            "disabled:bg-red-500/60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none",
          )}
          onClick={() => newDay()}
        >
          <PlayBig variant="solid" className="size-4" />
          <span>Start Day {day + 1}</span>
        </button>

        <button
          // Disable the Generate button itself while waiting
          disabled={isGenerating}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-bold text-white transition-all duration-200 shadow-lg",
            "bg-sky-500 hover:bg-sky-600 hover:scale-102 active:scale-98",
            "disabled:bg-sky-300 disabled:cursor-wait",
          )}
          onClick={() => {
            startGenerating(async () => {
              try {
                const events = await generateMultipleDynamicEvents({
                  stats,
                  day,
                  lines,
                });

                if (events && events.length > 0) {
                  console.group("AI Event Generation Results");

                  events.forEach((event) => {
                    addEvent(event);
                    console.log("Event Added:", event);
                  });

                  console.groupEnd();
                }
              } catch (error) {
                console.error("Failed to generate events", error);
              }
            });
          }}
        >
          <Ai01 variant="solid" className="size-4" />
          <span>{isGenerating ? "Generating Events" : "Generate Events"}</span>
        </button>
      </div>

      <EventLog />
    </div>
  );
}
