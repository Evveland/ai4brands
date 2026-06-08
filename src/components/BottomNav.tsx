"use client";

import { useAppState, useNav } from "@/lib/store";
import type { Screen, Role } from "@/types";

// Quest screens that belong to each role
const QUEST_SCREENS: Record<Role, Screen> = {
  startup:      "startup-quest",
  agency:       "agency-quest",
  brand:        "brand-quest",
  media:        "media-quest",
  university:   "university-quest",
  investor:     "investor-quest",
  institutional:"institutional-quest",
  hub:          "institutional-quest",
  curator:      "challenges",
};

// All quest-related screens (so the Quest tab stays highlighted on any of them)
const QUEST_FAMILY = new Set<Screen>([
  "quests", "role-quest",
  "startup-quest", "agency-quest", "brand-quest",
  "media-quest", "university-quest", "investor-quest", "institutional-quest",
  "profile-page", "capabilities-page", "pilot-page", "promotion-page", "challenge-page",
  "agency-quest-page", "brand-quest-page", "institutional-quest-page",
]);

export function BottomNav() {
  const { screen, role } = useAppState();
  const { go } = useNav();

  // Quest tab destination depends on selected role
  const questScreen: Screen = role ? QUEST_SCREENS[role] : "quests";

  const navItems: { icon: string; label: string; screen: Screen; key: string }[] = [
    { icon: "🏠", label: "Home",    screen: "home",       key: "home" },
    { icon: "🚀", label: "Quest",   screen: questScreen,  key: "quest" },
    { icon: "🎯", label: "Retos",   screen: "challenges", key: "challenges" },
    { icon: "🔎", label: "Scout",   screen: "scout",      key: "scout" },
    { icon: "🏆", label: "Trofeos", screen: "rewards",    key: "rewards" },
  ];

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
        const active =
          item.key === "quest"
            ? QUEST_FAMILY.has(screen)
            : item.screen === screen;

        return (
          <button
            key={item.key}
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
