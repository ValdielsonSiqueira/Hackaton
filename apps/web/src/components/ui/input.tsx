import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[56px] min-h-[56px] w-full border-0 border-b border-[#8c8c8c] bg-[#f4f4f4] px-4 font-sans text-[var(--font-base)] text-[#161616] placeholder:#8c8c8c focus-visible:bg-[#f4f4f4] focus-visible:border-b-2 focus-visible:border-[#0f62fe] focus-visible:outline-2 focus-visible:outline-[#0f62fe] focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors rounded-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
