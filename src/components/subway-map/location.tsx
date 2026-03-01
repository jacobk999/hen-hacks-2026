import type { CurrentEvent, Location } from "~/stores/game/events";
import { useGameStore } from "~/stores/game/index";
import { Dialog } from "~/components/ui/dialog";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export const LocationMarker = ({
  location,
  className,
}: {
  location: Location;
  className?: string;
}) => {
  const currentEvents = useGameStore((s) => s.currentEvents);
  const event = currentEvents.find((event) => event.location === location);

  return (
    <div className={cn("m-4 relative", className)}>
      {event ? (
        <EventDialog event={event}></EventDialog>
      ) : (
        <div className="rounded-full bg-slate-200 outline-4 outline-white w-full h-full" />
      )}

      <div className="absolute text-nowrap -translate-x-1/2 left-1/2 translate-y-2 font-medium p-1 bg-slate-900 text-white rounded-lg">
        {location}
      </div>
    </div>
  );
};

const EventDialog = ({ event }: { event: CurrentEvent }) => {
  const onEventUpdate = useGameStore((s) => s.onEventUpdate);

  return (
    <Dialog>
      <Dialog.Trigger className="relative rounded-full flex outline-4 outline-white h-full w-full">
        <span className="absolute inline-flex w-full h-full animate-ping rounded-full bg-red-400 opacity-60"></span>
        <span className="relative inline-flex w-full h-full rounded-full bg-red-400"></span>
      </Dialog.Trigger>
      <Dialog.Content className="flex flex-col gap-1">
        <Dialog.Title className="font-bold text-lg capitalize">
          {event.title}
        </Dialog.Title>
        <Dialog.Description>{event.description}</Dialog.Description>
        <div className="flex flex-col gap-1 pt-2">
          {event.choices.map((choice) => (
            <Dialog.Close
              key={choice.id}
              onClick={() => onEventUpdate(event, choice)}
              className="bg-red-400 rounded-lg p-2 font-medium text-white"
            >
              {choice.label}
            </Dialog.Close>
          ))}
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
