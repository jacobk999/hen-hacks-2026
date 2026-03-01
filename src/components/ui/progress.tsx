import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Progress({
  className,
  children,
  color,
  ...props
}: Omit<ComponentProps<typeof ProgressPrimitive.Root>, "className"> & {
  className?: string;
  color?: string;
}) {
  return (
    <ProgressPrimitive.Root {...props} className={cn("w-full grid grid-cols-2 gap-y-2", className)}>
      <ProgressPrimitive.Label className="text-nowrap">{children}</ProgressPrimitive.Label>
      <ProgressPrimitive.Value className="col-start-2 text-right" />
      <ProgressPrimitive.Track className="col-span-full h-3 overflow-hidden rounded bg-slate-300">
        <ProgressPrimitive.Indicator
          className={cn("block bg-slate-500 transition-all duration-500", color)}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}
