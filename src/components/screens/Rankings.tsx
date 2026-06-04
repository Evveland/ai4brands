"use client";

import { useNav } from "@/lib/store";
import { Card } from "@/components/ui/Card";

const rankings = [
  { rank: 1, name: "Madrid-in-Game Team", meta: "22 startups · 9 propuestas · 14 reuniones", xp: "8,940 XP", screen: "ecosystem-detail" as const },
  { rank: 2, name: "Yellow Innovation Network", meta: "18 startups · 7 retos · 11 reuniones", xp: "7,620 XP", screen: null },
  { rank: 3, name: "Basque Innovation Team", meta: "15 startups · 6 propuestas · 8 reuniones", xp: "6,480 XP", screen: null },
  { rank: 4, name: "South Summit Alumni", meta: "13 startups · 5 propuestas · 9 reuniones", xp: "5,930 XP", screen: null },
];

export function Rankings() {
  const { go } = useNav();

  return (
    <div>
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          Innovation Rankings
        </h3>
        <button
          onClick={() => go("ecosystem-dashboard")}
          className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0"
        >
          Panel ecosistema
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-0.5 mb-[14px]">
        {["Ecosistemas", "Startups", "Agencias"].map((tab, i) => (
          <button
            key={tab}
            className="border border-[rgba(255,255,255,.09)] rounded-full px-3 py-[9px] whitespace-nowrap text-[12px] font-bold cursor-pointer"
            style={{
              background: i === 0 ? "#FFD400" : "rgba(255,255,255,.06)",
              color: i === 0 ? "#10131F" : "var(--muted)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-[10px] mb-4">
        {rankings.map((r) => (
          <Card
            key={r.rank}
            clickable={!!r.screen}
            onClick={() => r.screen && go(r.screen)}
            className="flex items-center gap-[11px]"
          >
            <div className="w-[32px] h-[32px] rounded-[12px] bg-[rgba(255,255,255,.07)] grid place-items-center font-black text-[#FFD400] flex-none">
              {r.rank}
            </div>
            <div className="flex-1">
              <h4 className="m-0 text-[13px] font-semibold">{r.name}</h4>
              <p className="m-0 mt-[3px] text-[11px] text-[var(--muted)]">{r.meta}</p>
            </div>
            <div className="text-[12px] font-black text-[#4DFF9D] whitespace-nowrap">
              {r.xp}
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-[var(--soft)] text-[11px] my-[18px]">
        Ranking basado en acciones verificadas: perfiles, propuestas, briefs y
        reuniones.
      </p>
    </div>
  );
}
