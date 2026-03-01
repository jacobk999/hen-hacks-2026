import { useGameStore } from "~/stores/game";
import type { Current, MultipleChoiceEvent } from "~/stores/game/events";
import { Dialog } from "../ui/dialog";
import type { ReactElement } from "react";

export function MultipleChoiceEventDialog({
  event,
  children,
}: {
  event: Current<MultipleChoiceEvent>;
  children: ReactElement;
}) {
  const onEventUpdate = useGameStore((s) => s.onEventUpdate);

  return (
    <Dialog>
      <Dialog.Trigger
        className="relative rounded-full flex outline-4 outline-white h-full w-full"
        render={children}
      />
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
              className="bg-red-500 rounded-lg p-2 font-medium text-white transition-all hover:bg-red-600 hover:scale-102 active:scale-98"
            >
              {choice.label}
            </Dialog.Close>
          ))}
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
