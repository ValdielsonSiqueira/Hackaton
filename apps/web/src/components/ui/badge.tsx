import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "pending" | "urgent";
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
          variant === "success" && "bg-[#24a148] text-white font-bold border border-[#1f8b3e] shadow-xs",
          variant === "pending" && "bg-[#f1c21b] text-[#161616] font-bold border border-[#d4aa15] shadow-xs",
          variant === "urgent" && "bg-[#da1e28] text-white font-bold border border-[#b21018] shadow-xs",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
