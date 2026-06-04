"use client";

import { useAppState, useNav } from "@/lib/store";

const roleLabels: Record<string, string> = {
  startup: "Startup",
  agency: "Agencia",
  brand: "Marca",
  institutional: "Institucional",
  curator: "Curador",
};

export function TopBar() {
  const { role } = useAppState();
  const { go } = useNav();

  return (
    <div className="flex items-center justify-between mb-4 gap-3">
      <div className="flex items-center gap-[10px]">
        <div
          className="w-[42px] h-[42px] rounded-[14px] grid place-items-center text-[#111] font-black shadow-[0_8px_25px_rgba(255,212,0,.25)]"
          style={{
            background: "linear-gradient(135deg,#FFD400,#fff2a3 45%,#44D7FF)",
          }}
        >
          AI
        </div>
        <div>
          <h1 className="text-[15px] m-0 font-black tracking-tight">AI4Brands</h1>
          <p className="text-[11px] text-[var(--muted)] mt-0.5 mb-0">
            Innovation League
          </p>
        </div>
      </div>
      <button
        onClick={() => go("onboarding")}
        className="border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] rounded-full px-[10px] py-[8px] text-[12px] text-[var(--muted)] flex items-center gap-1.5 cursor-pointer"
      >
        <span className="text-[#2AABEE] font-black">●</span>{" "}
        <strong className="text-[var(--text)]">
          {role ? roleLabels[role] : "Elegir rol"}
        </strong>
      </button>
    </div>
  );
}
