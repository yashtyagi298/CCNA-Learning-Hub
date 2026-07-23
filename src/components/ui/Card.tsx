import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-zinc-950/62 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
