import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "pending";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[0.7rem] leading-tight font-semibold tracking-wide transition-colors shrink-0",
          variant === "default" && "bg-[var(--primary)] text-white",
          variant === "secondary" && "bg-[var(--surface-1)] text-[var(--ink)] border border-[var(--hairline)]",
          variant === "destructive" && "bg-[var(--error)] text-white",
          variant === "outline" && "border border-[var(--hairline)] text-[var(--ink)] bg-transparent",
          variant === "success" && "bg-[#24a148]/15 text-[#145c29] dark:bg-[#42be65]/25 dark:text-[#42be65]",
          variant === "pending" && "bg-[#f1c21b]/25 text-[#684e00] dark:bg-[#f1c21b]/30 dark:text-[#f1c21b]",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
