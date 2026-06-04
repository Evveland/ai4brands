"use client";

import { useNav } from "@/lib/store";

interface BackBarProps {
  title: string;
  subtitle?: string;
}

export function BackBar({ title, subtitle }: BackBarProps) {
  const { back } = useNav();

  return (
    <div className="flex gap-[10px] items-center my-1 mb-[14px]">
      <button
        onClick={back}
        className="w-[38px] h-[38px] rounded-[14px] border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] text-[var(--text)] text-[18px] cursor-pointer"
      >
        ‹
      </button>
      <div>
        <h2 className="text-[23px] font-black tracking-tight m-0 mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="m-0 text-[var(--muted)] text-[12px]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
