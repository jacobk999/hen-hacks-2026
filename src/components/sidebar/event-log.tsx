import { useGameStore } from "../../stores/game";
import { cn } from "~/lib/utils";

export function EventLog({ className }: { className?: string }) {
  const eventLog = useGameStore((s) => s.eventLog);
  const day = useGameStore((s) => s.day);

  return (
    <div
      className={cn(
        "flex flex-col bg-slate-200 border border-slate-200 w-full h-[300px] rounded-lg overflow-hidden shadow-inner",
        className,
      )}
    >
      <div className="bg-slate-300 p-2 border-b border-slate-200 flex justify-between items-center">
        <p className="font-bold text-xs uppercase">System Log</p>
        <span className="font-bold text-xs">DAY {day}</span>
      </div>

      <div className="grow overflow-y-auto p-2 space-y-3 select-none scrollbar">
        {eventLog.length === 0 && (
          <p className="text-slate-black text-xs text-center mt-1.5">
            No data recorded...
          </p>
        )}

        {eventLog.map((event, index) => {
          const isNewDay = event.title === "New Day Started";

          return (
            <div
              key={index}
              className={cn(
                "text-[11px] leading-tight border-l-2 pl-1.5 animate-in fade-in slide-in-from-left-2 duration-300",
                isNewDay ? "border-black mt-0.5" : "border-black",
              )}
            >
              <p className="font-bold uppercase tracking-tight">
                {event.title}
              </p>

              {!isNewDay && <p className="italic">{event.choiceTitle}</p>}

              <div className="mt-0.5 flex flex-col gap-0.5">
                {event.effects.map((effect, eIndex) => {
                  const statKey = effect.stat.toLowerCase();
                  const isNeutral = effect.change === 0;

                  const moneyStats = [
                    "money",
                    "dailyprofit",
                    "dailyexpenses",
                    "totalexpenses",
                    "employeewage",
                  ];
                  const expenseStats = [
                    "dailyexpenses",
                    "totalexpenses",
                    "employeewage",
                  ];

                  // Color logic
                  const isExpense = expenseStats.includes(statKey);
                  const isGoodChange = isExpense
                    ? effect.change < 0
                    : effect.change > 0;
                  const isBadChange = isExpense
                    ? effect.change > 0
                    : effect.change < 0;

                  const formattedName = effect.stat
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();

                  let displayValue: string | number = effect.change;

                  // Formatting logic
                  if (moneyStats.includes(statKey)) {
                    displayValue = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(Math.abs(effect.change));
                  }
                  // NEW: Handle raw employee counts
                  else if (statKey === "employees") {
                    displayValue = Math.abs(effect.change);
                  } else {
                    // Percentage for everything else (Happiness, Safety, etc.)
                    const percentChange =
                      Math.round(effect.change * 20 * 10) / 10;
                    displayValue = `${Math.abs(percentChange)}%`;
                  }

                  return (
                    <span
                      key={eIndex}
                      className={cn(
                        "font-mono font-bold",
                        isGoodChange
                          ? "text-green-500"
                          : isBadChange
                            ? "text-red-500"
                            : "text-slate-500",
                      )}
                    >
                      {formattedName}{" "}
                      {effect.change > 0 ? "+" : isNeutral ? "" : "-"}
                      {displayValue}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
