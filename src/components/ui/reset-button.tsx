import { useGameStore } from "../../stores/game";

export function ResetButton() {
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure? This will wipe all progress and restart the simulation.")) {
          resetGame();
        }
      }}
      className="fixed top-22 left-8 z-30 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-600 hover:scale-102 active:scale-98"
      title="Hard Reset Simulation"
    >
      RESET DATA
    </button>
  );
}
