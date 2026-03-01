import type { ReactElement } from "react";
import { Dialog } from "../ui/dialog";
import { useGameStore } from "~/stores/game";

export function KatDrugsDialog({ children }: { children: ReactElement }) {
  const onEventUpdate = useGameStore((s) => s.onEventUpdate);

  // choices: [
  //   {
  //     id: "Run",
  //     label: "Let the dog run ahead",
  //     onSelect: (state) => ({
  //       stats: {
  //         ...state.stats,
  //       },
  //     }),
  //   },
  //   {
  //     id: "Stop",
  //     label: "Stop the dog",
  //     onSelect: (state) => ({
  //       stats: {
  //         ...state.stats,
  //       },
  //     }),
  //   },
  // ],

  return (
    <Dialog>
      <Dialog.Trigger
        className="relative rounded-full flex outline-4 outline-white h-full w-full"
        render={children}
      />
      <Dialog.Content className="flex flex-col gap-1">
        <Dialog.Title className="font-bold text-lg capitalize">
          Kat, the Drug Sniffing Dog
        </Dialog.Title>
        <Dialog.Description>
          Kat, the Drug Sniffing Dog, has started pulling torwards a group of
          suspicous individuals, what should we do?
        </Dialog.Description>
        <div className="flex flex-col gap-1 pt-2">
          {/*{event.choices.map((choice) => (
            <Dialog.Close
              key={choice.id}
              onClick={() => onEventUpdate(event, choice)}
              className="bg-red-500 rounded-lg p-2 font-medium text-white"
            >
              {choice.label}
            </Dialog.Close>
          ))}*/}
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
