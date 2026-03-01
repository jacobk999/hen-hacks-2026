import { useGameStore } from "../../stores/game";
import { Refresh } from "../icons/refresh";
import { Dialog } from "./dialog";

export function ResetButton() {
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <Dialog>
      <Dialog.Trigger className="flex items-center gap-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-slate-50 shadow-lg transition-all hover:bg-red-600 hover:scale-102 active:scale-98">
        <Refresh variant="stroke" className="size-4" />
        <span>RESET DATA</span>
      </Dialog.Trigger>
      <Dialog.Content className="flex flex-col gap-1">
        <Dialog.Title>Reset Game</Dialog.Title>
        <Dialog.Description>
          Are you sure? This will wipe all of your progress and restart the simulation.
        </Dialog.Description>
        <div className="flex flex-col gap-1 pt-2">
          <Dialog.Close
            onClick={() => resetGame()}
            className="bg-red-500 rounded-lg p-2 font-medium text-white transition-all hover:bg-red-600 hover:scale-102 active:scale-98"
          >
            Reset Away
          </Dialog.Close>
          <Dialog.Close className="bg-slate-200 rounded-lg p-2 font-medium text-slate-950 transition-all hover:bg-slate-300 hover:scale-102 active:scale-98">
            Cancel
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
