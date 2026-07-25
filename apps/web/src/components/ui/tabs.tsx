import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props} />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex border-b border-[var(--hairline)] bg-[var(--surface-1)] border-t border-l border-r rounded-t-lg overflow-hidden", className)}
      role="tablist"
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, active, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn(
        "min-h-[44px] h-auto px-5 py-3 text-sm font-semibold tracking-wide text-[var(--ink-muted)] border-b-2 border-transparent bg-transparent rounded-none cursor-pointer transition-colors hover:text-[var(--ink)] hover:bg-[var(--canvas)] flex-1 justify-center",
        active && "text-[var(--primary)] font-bold border-b-[var(--primary)] bg-[var(--canvas)]",
        className
      )}
      role="tab"
      aria-selected={active}
      {...props}
    />
  )
);
TabsTrigger.displayName = "TabsTrigger";

export { Tabs, TabsList, TabsTrigger };
