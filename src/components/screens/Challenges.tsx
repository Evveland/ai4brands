"use client";

import { useEffect, useState } from "react";
import { useNav, useAppState } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { fetchChallenges } from "@/lib/db";
import type { Role } from "@/types";

// Which challenge types each role can RESPOND to (not just view)
const ROLE_CAN_RESPOND: Record<Role, string[]> = {
  startup:      ["brand", "sponsor", "ecosystem"],
  agency:       ["brand", "agency", "ecosystem"],
  brand:        ["sponsor", "ecosystem"],
  media:        ["ecosystem"],
  university:   ["sponsor", "ecosystem"],
  investor:     ["ecosystem"],
  hub:          ["ecosystem"],
  institutional:["ecosystem"],
  curator:      ["brand", "agency", "sponsor", "ecosystem"],
};

type Challenge = {
  id: string;
  type: "brand" | "agency" | "sponsor" | "ecosystem";
  title: string;
  description: string;
  vertical: string | null;
  xp_reward: number;
  challenge_responses?: { id: string }[];
};

const pillColors: Record<string, { bg: string; text: string }> = {
  brand:     { bg: "rgba(68,215,255,.14)",  text: "#44D7FF" },
  agency:    { bg: "rgba(255,79,216,.14)",  text: "#FF4FD8" },
  sponsor:   { bg: "rgba(255,212,0,.16)",   text: "#FFD400" },
  ecosystem: { bg: "rgba(77,255,157,.14)",  text: "#4DFF9D" },
};

const typeLabels: Record<string, string> = {
  brand:     "Brand Challenge",
  agency:    "Agency Brief",
  sponsor:   "Sponsor Challenge",
  ecosystem: "Ecosystem Challenge",
};

const actionLabels: Record<string, [string, string]> = {
  brand:     ["Ver brief",  "Aplicar"],
  agency:    ["Compartir",  "Proponer"],
  sponsor:   ["Guardar",    "Responder"],
  ecosystem: ["Ver reglas", "Participar"],
};

const screenMap: Record<string, "challenge-detail" | "challenge-retail" | "challenge-agency" | "ecosystem-challenge"> = {
  sponsor:   "challenge-detail",
  brand:     "challenge-retail",
  agency:    "challenge-agency",
  ecosystem: "ecosystem-challenge",
};

const verticals = [
  "Content AI", "Customer Experience", "Retail Media",
  "Data & Insights", "Loyalty", "Automation",
];

export function Challenges() {
  const { go } = useNav();
  const { role } = useAppState();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges().then((data) => {
      setChallenges(data as Challenge[]);
      setLoading(false);
    });
  }, []);

  // Filter challenges to ones this role can interact with
  const allowedTypes = role ? ROLE_CAN_RESPOND[role] : ["brand","agency","sponsor","ecosystem"];
  const visibleChallenges = challenges.filter(c => allowedTypes.includes(c.type));

  // Brands and agencies can create challenges; others just respond
  const canCreate = !role || role === "brand" || role === "agency" || role === "curator";

  return (
    <div>
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          {role === "agency" ? "Brand Challenges & Briefs" : "Challenges activos"}
        </h3>
        {canCreate && (
          <button onClick={() => go("challenge-create")} className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0">
            Publicar reto
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-[10px] mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[22px] border border-[rgba(255,255,255,.09)] p-[14px] animate-pulse" style={{ background: "rgba(23,29,52,.86)", height: 110 }} />
          ))}
        </div>
      ) : (
        <div className="grid gap-[10px] mb-4">
          {visibleChallenges.length === 0 && (
            <div className="rounded-[22px] border border-[rgba(255,255,255,.09)] p-5 text-center" style={{ background: "rgba(23,29,52,.86)" }}>
              <p className="text-[var(--muted)] text-[13px] m-0">Sin challenges disponibles para tu rol.</p>
            </div>
          )}
          {visibleChallenges.map((c) => {
            const colors = pillColors[c.type] ?? pillColors.brand;
            const labels = actionLabels[c.type] ?? ["Ver", "Participar"];
            const targetScreen = screenMap[c.type] ?? "challenge-detail";
            return (
              <Card key={c.id} clickable onClick={() => go(targetScreen)} className="relative overflow-hidden">
                <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px]"
                  style={{ background: colors.bg, color: colors.text }}>
                  {typeLabels[c.type] ?? c.type}
                </span>
                <h4 className="m-0 mb-1 text-[14px] font-semibold">{c.title}</h4>
                {c.description && (
                  <p className="m-0 text-[var(--muted)] text-[12px] leading-snug line-clamp-2">{c.description}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-black text-[#FFD400]">+{c.xp_reward} XP</span>
                  {c.vertical && <span className="text-[11px] text-[var(--muted)]">{c.vertical}</span>}
                  <span className="text-[11px] text-[var(--muted)]">{c.challenge_responses?.length ?? 0} propuestas</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] text-[var(--text)] rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
                    {labels[0]}
                  </button>
                  <button className="flex-1 bg-[#FFD400] text-[#10131F] border-transparent rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
                    {labels[1]}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Verticales calientes</h3>
      </div>
      <div className="grid gap-[9px]" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {verticals.map((v) => (
          <div key={v} className="rounded-[18px] border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.05)] p-3 text-[11px] font-black min-h-[70px] flex items-end">
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
