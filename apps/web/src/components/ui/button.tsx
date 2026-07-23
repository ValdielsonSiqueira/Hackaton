import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "tertiary" | "nav" | "navOut" | "ctaInverse" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", style, ...props }, ref) => {
    const isIcon = size === "icon";
    const defaultPaddingStyle = isIcon ? { padding: 0 } : { paddingLeft: "1.5rem", paddingRight: "1.5rem" };

    return (
      <button
        ref={ref}
        style={{ ...defaultPaddingStyle, ...style }}
        className={cn(
          "inline-flex items-center justify-between font-sans text-base leading-tight tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f62fe] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-0 rounded-none",
          
          // Senior Touch Target Sizes (56px default min-height que cresce com a fonte)
          size === "default" && "min-h-[56px] h-auto justify-between px-6 py-3",
          size === "sm" && "min-h-[40px] h-auto justify-center px-4 py-2 text-sm",
          size === "lg" && "min-h-[64px] h-auto justify-between px-8 py-4 text-lg",
          size === "icon" && "h-[56px] w-[56px] min-w-[56px] p-0 justify-center flex items-center shrink-0",

          // IBM Carbon Variants
          variant === "primary" && "bg-[#0f62fe] text-white hover:bg-[#0050e6] active:bg-[#002d9c]",
          variant === "tertiary" && "bg-white text-[#0f62fe] border border-[#0f62fe] hover:bg-[#f4f4f4] active:bg-[#e0e0e0]",
          variant === "nav" && "bg-[#0f62fe] text-white hover:bg-[#0050e6] min-h-[40px] h-auto px-5 py-2 text-sm",
          variant === "navOut" && "bg-[#161616] text-white hover:bg-[#262626] min-h-[32px] h-auto px-4 py-1.5 text-sm",
          variant === "ctaInverse" && "bg-white text-[#0f62fe] hover:bg-[#f4f4f4] min-h-[56px] h-auto px-8 py-3 text-base",
          variant === "ghost" && "bg-transparent text-[#161616] hover:bg-[#f4f4f4] px-4 py-2",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
