import { cn } from "@/lib/utils";

interface PillProps {
  children: React.ReactNode;
  variant?: "brand" | "agency" | "sponsor";
  className?: string;
}

export function Pill({ children, variant = "brand", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px]",
        variant === "brand" && "bg-[rgba(68,215,255,.14)] text-[#44D7FF]",
        variant === "agency" && "bg-[rgba(255,79,216,.14)] text-[#FF4FD8]",
        variant === "sponsor" && "bg-[rgba(255,212,0,.16)] text-[#FFD400]",
        className
      )}
    >
      {children}
    </span>
  );
}
