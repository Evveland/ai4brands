import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "green";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "border rounded-full px-[10px] py-[8px] text-[11px] font-bold",
        variant === "default" &&
          "border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] text-[#DCE3FF]",
        variant === "gold" &&
          "bg-[rgba(255,212,0,.16)] text-[#FFD400] border-[rgba(255,212,0,.3)]",
        variant === "green" &&
          "bg-[rgba(77,255,157,.12)] text-[#4DFF9D] border-[rgba(77,255,157,.25)]",
        className
      )}
    >
      {children}
    </span>
  );
}
