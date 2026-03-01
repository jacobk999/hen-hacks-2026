import {
  type Current,
  type CurrentEvent,
  type CustomDialogEvent,
  type Location,
  type MultipleChoiceEvent,
} from "~/stores/game/events";
import { SubwayStationToLine } from "~/stores/game/location";
import { useGameStore } from "~/stores/game/index";
import type { ReactElement } from "react";
import { cn } from "~/lib/utils";
import { MultipleChoiceEventDialog } from "../events/multiple-choice-event";

export const LocationMarker = ({
  location,
  className,
}: {
  location: Location;
  className?: string;
}) => {
  const currentEvents = useGameStore((s) => s.currentEvents);
  const lines = useGameStore((s) => s.lines);
  const event = currentEvents.find((event) => event.location === location);

  return (
    <div className={cn("m-4 relative", className)}>
      {event && lines[SubwayStationToLine[location]] ? (
        <EventDialog event={event}>
          <button
            type="button"
            className="relative rounded-full flex outline-4 outline-white h-full w-full"
          >
            <span className="absolute inline-flex w-full h-full animate-ping rounded-full bg-red-500 opacity-60"></span>
            <span className="relative inline-flex w-full h-full rounded-full bg-red-500"></span>
          </button>
        </EventDialog>
      ) : (
        <div className="rounded-full bg-slate-200 outline-4 outline-white w-full h-full" />
      )}

      <div className="absolute text-nowrap -translate-x-1/2 left-1/2 translate-y-2 font-medium p-1 bg-slate-900 text-white rounded-lg">
        {location}
      </div>
    </div>
  );
};

const EventDialog = ({
  event,
  children,
}: {
  event: CurrentEvent;
  children: ReactElement;
}) => {
  if ("choices" in event)
    return (
      <MultipleChoiceEventDialog event={event as Current<MultipleChoiceEvent>}>
        {children}
      </MultipleChoiceEventDialog>
    );

  const { dialog: Dialog } = event as Current<CustomDialogEvent>;

  return <Dialog>{children}</Dialog>;
};
