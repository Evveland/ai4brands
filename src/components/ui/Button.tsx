"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "small" | "small-primary";
  full?: boolean;
}

export function Button({
  variant = "primary",
  full,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-[16px] border-0 px-[14px] py-[12px] font-extrabold text-[13px] cursor-pointer",
        variant === "primary" &&
          "bg-[#FFD400] text-[#10131F] shadow-[0_10px_25px_rgba(255,212,0,.22)]",
        variant === "secondary" &&
          "bg-[rgba(255,255,255,.08)] text-[var(--text)] border border-[rgba(255,255,255,.09)]",
        variant === "small" &&
          "flex-1 border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] text-[var(--text)] rounded-[14px] py-[10px] text-[12px]",
        variant === "small-primary" &&
          "flex-1 bg-[#FFD400] text-[#10131F] border-transparent rounded-[14px] py-[10px] text-[12px]",
        full && "w-full mt-3",
        className
      )}
      {...props}
    />
  );
}
