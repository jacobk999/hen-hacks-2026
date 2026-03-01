import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Dialog({
  children,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

Dialog.Content = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <DialogPrimitive.Portal>
      {/* The backdrop blurs the background game map */}
      <DialogPrimitive.Backdrop className="fixed inset-0 min-h-dvh bg-black/70 backdrop-blur-md z-40 transition-all duration-150" />
      <DialogPrimitive.Popup
        className={cn(
          "fixed top-1/2 left-1/2 w-120 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 shadow-2xl z-50",
          className,
        )}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
};

Dialog.Title = DialogPrimitive.Title;
Dialog.Description = DialogPrimitive.Description;
