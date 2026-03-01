import { cn } from "~/lib/utils";
import { LocationMarker } from "./location";
import { useGameStore } from "~/stores/game";

export function SubwayMap() {
  const lines = useGameStore((s) => s.lines);

  return (
    <div className="grow flex flex-col h-full">
      <div className="grid grid-cols-10 grid-rows-10 grow aspect-square mx-auto">
        <div
          className={cn(
            "row-start-1 col-start-3 col-span-1 bg-red-400 rounded-l-2xl grid",
            !lines.red && "bg-red-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="North Plaza" />
        </div>
        <div
          className={cn(
            "row-start-1 col-start-4 row-span-10 bg-red-400 rounded-tr-2xl rounded-bl-2xl",
            !lines.red && "bg-red-600 opacity-50 pointer-events-none",
          )}
        />
        <div
          className={cn(
            "row-start-10 col-start-5 row-span-2 bg-red-400 rounded-r-2xl grid",
            !lines.red && "bg-red-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="Riverside Terminal" />
        </div>
        <div
          className={cn(
            "row-start-3 col-start-1 row-span-3 bg-blue-400 rounded-t-2xl rounded-bl-2xl grid grid-rows-3",
            !lines.blue && "bg-blue-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="Wild Hen Stadium" />
        </div>
        <div
          className={cn(
            "row-start-5 col-start-2 col-span-8 bg-blue-400 rounded-tr-2xl grid grid-cols-8",
            !lines.blue && "bg-blue-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="Central Station" className="col-start-3" />
        </div>
        <div
          className={cn(
            "row-start-6 col-start-9 row-span-3 bg-blue-400 rounded-b-2xl grid grid-rows-3",
            !lines.blue && "bg-blue-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="Eastside" className="row-start-3" />
        </div>
        <div
          className={cn(
            "row-start-8 col-start-1 col-span-6 bg-green-400 rounded-l-2xl grid grid-cols-6",
            !lines.green && "bg-green-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="West End Junction" />
          <LocationMarker location="Old Town Square" className="col-start-4" />
        </div>
        <div
          className={cn(
            "row-start-2 col-start-7 row-span-7 bg-green-400 rounded-tl-2xl rounded-br-2xl grid grid-rows-7",
            !lines.green && "bg-green-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="Leo's Landing" className="row-start-4" />
        </div>
        <div
          className={cn(
            "row-start-2 col-start-8 col-span-3 bg-green-400 rounded-r-2xl grid grid-cols-3",
            !lines.green && "bg-green-600 opacity-50 pointer-events-none",
          )}
        >
          <LocationMarker location="Three Stop" className="col-start-3" />
        </div>
      </div>
    </div>
  );
}
