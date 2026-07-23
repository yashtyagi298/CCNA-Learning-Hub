import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 disabled:opacity-50",
        variant === "primary" && "bg-white text-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.18)] hover:bg-cyan-100",
        variant === "secondary" && "border border-white/10 bg-white/[0.06] text-zinc-100 hover:border-cyan-300/40 hover:bg-cyan-300/10",
        variant === "ghost" && "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
