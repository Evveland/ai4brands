"use client";

import { useAppState, useNav } from "@/lib/store";
import type { Screen } from "@/types";

const navItems: { icon: string; label: string; screen: Screen }[] = [
  { icon: "🏠", label: "Home", screen: "home" },
  { icon: "🚀", label: "Quest", screen: "quests" },
  { icon: "🎯", label: "Retos", screen: "challenges" },
  { icon: "🔎", label: "Scout", screen: "scout" },
  { icon: "🏆", label: "Trofeos", screen: "rewards" },
];

export function BottomNav() {
  const { screen } = useAppState();
  const { go } = useNav();

  return (
    <nav
      className="fixed left-1/2 bottom-[14px] -translate-x-1/2 w-[calc(100%-28px)] max-w-[402px] rounded-[24px] p-2 grid z-50"
      style={{
        gridTemplateColumns: "repeat(5,1fr)",
        gap: "4px",
        background: "rgba(18,23,42,.88)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,.09)",
        boxShadow: "0 18px 50px rgba(0,0,0,.45)",
      }}
    >
      {navItems.map((item) => {
        const active = item.screen === screen;
        return (
          <button
            key={item.screen}
            onClick={() => go(item.screen)}
            className="border-0 text-[10px] font-bold px-1 py-2 rounded-[16px] cursor-pointer transition-colors"
            style={{
              background: active ? "rgba(255,212,0,.15)" : "transparent",
              color: active ? "#FFD400" : "var(--soft)",
            }}
          >
            <span className="block text-[18px] mb-0.5">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
