import { cn } from "~/lib/utils";

export function EventLog({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col bg-slate-200 w-[250px] h-[250px] p-2 rounded-lg",
        className,
      )}
    >
      <p className="font-bold">Event Log</p>
    </div>
  );
}
