"use client";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
}

export function Card({ className, clickable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[22px] border p-[14px] shadow-[0_8px_28px_rgba(0,0,0,.18)]",
        "bg-[rgba(23,29,52,.86)] border-[rgba(255,255,255,.09)]",
        clickable &&
          "cursor-pointer transition-transform active:scale-[.98] active:bg-[rgba(32,40,68,.95)]",
        className
      )}
      {...props}
    />
  );
}
