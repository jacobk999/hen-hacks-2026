import { useGameStore } from "../../stores/game";
import { Dialog } from "../ui/lose"; // Import the blueprint we just made

export function LoseDialog() {
  const { isGameOver, score, day, failReason, resetGame } = useGameStore();

  return (
    <Dialog open={isGameOver}>
      {/* We don't need {isGameOver && ...} here because the 'open' prop handles it */}
      <Dialog.Content className="border-t-4 border-red-500 bg-slate-200">
        <Dialog.Title className="text-center text-4xl font-black text-red-500 uppercase italic tracking-tighter">
          Terminal Failure
        </Dialog.Title>

        <Dialog.Description className="mt-6 text-center text-lg font-semibold">
          {failReason}
        </Dialog.Description>

        <div className="my-8 grid grid-cols-2 gap-4 border-y border-gray-200 py-6 dark:border-gray-800">
          <div className="text-center">
            <span className="block text-sm uppercase font-bold">Days Managed</span>
            <span className="text-2xl font-bold">{day}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm uppercase font-bold">Final Score</span>
            <span className="text-2xl font-bold">{score.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full rounded-md bg-red-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-red-600 hover:scale-102 active:scale-98"
        >
          RESTART SIMULATION
        </button>
      </Dialog.Content>
    </Dialog>
  );
}
