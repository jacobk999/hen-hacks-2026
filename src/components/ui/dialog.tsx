import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

Dialog.Trigger = DialogPrimitive.Trigger;

Dialog.Content = ({
  children,
  className,
  blur,
}: {
  children: ReactNode;
  className?: string;
  blur?: string;
}) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 min-h-dvh bg-black z-40 opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute",
          blur,
        )}
      />
      <DialogPrimitive.Popup
        className={cn(
          "fixed top-1/2 left-1/2 -mt-8 w-120 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300",
          className,
        )}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
};

Dialog.Title = (
  props: Omit<ComponentProps<typeof DialogPrimitive.Title>, "className"> & {
    className?: string;
  },
) => (
  <DialogPrimitive.Title
    {...props}
    className={cn("font-bold text-lg capitalize", props.className)}
  />
);

Dialog.Description = (
  props: Omit<ComponentProps<typeof DialogPrimitive.Description>, "className"> & {
    className?: string;
  },
) => <DialogPrimitive.Description {...props} className={cn("text-md", props.className)} />;

Dialog.Close = DialogPrimitive.Close;
