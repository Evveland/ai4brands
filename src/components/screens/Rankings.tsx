"use client";

import { useEffect, useState } from "react";
import { useNav, useAppState } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { fetchEcosystemRankings } from "@/lib/db";
import { COUNTRIES, countryLabel } from "@/lib/countries";

type RankUser = {
  id: string;
  telegram_handle: string | null;
  first_name: string | null;
  xp: number;
  role: string;
  country: string | null;
};

export function Rankings() {
  const { go } = useNav();
  const { country: userCountry } = useAppState();
  const [rankings, setRankings] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "startup" | "agency">("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  useEffect(() => {
    fetchEcosystemRankings().then((data) => {
      setRankings(data as RankUser[]);
      setLoading(false);
    });
  }, []);

  const filtered = rankings
    .filter(r => tab === "all" || r.role === tab)
    .filter(r => countryFilter === "all" || r.country === countryFilter);

  return (
    <div>
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Innovation Rankings</h3>
        <button onClick={() => go("ecosystem-dashboard")} className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0">
          Panel ecosistema
        </button>
      </div>

      {/* Role tabs */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 mb-2">
        {[
          { key: "all", label: "Todos" },
          { key: "startup", label: "Startups" },
          { key: "agency", label: "Agencias" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className="border border-[rgba(255,255,255,.09)] rounded-full px-3 py-[9px] whitespace-nowrap text-[12px] font-bold cursor-pointer"
            style={{ background: tab === t.key ? "#FFD400" : "rgba(255,255,255,.06)", color: tab === t.key ? "#10131F" : "var(--muted)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Country filter */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 mb-[14px]">
        <button onClick={() => setCountryFilter("all")}
          className="border border-[rgba(255,255,255,.09)] rounded-full px-3 py-[7px] whitespace-nowrap text-[11px] font-bold cursor-pointer"
          style={{ background: countryFilter === "all" ? "rgba(68,215,255,.2)" : "rgba(255,255,255,.05)", color: countryFilter === "all" ? "#44D7FF" : "var(--muted)" }}>
          🌍 Global
        </button>
        {COUNTRIES.map(c => (
          <button key={c.code} onClick={() => setCountryFilter(c.code)}
            className="border border-[rgba(255,255,255,.09)] rounded-full px-3 py-[7px] whitespace-nowrap text-[11px] font-bold cursor-pointer"
            style={{ background: countryFilter === c.code ? "rgba(68,215,255,.2)" : "rgba(255,255,255,.05)", color: countryFilter === c.code ? "#44D7FF" : "var(--muted)" }}>
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-[10px]">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-[22px] border border-[rgba(255,255,255,.09)] p-[14px] animate-pulse" style={{ background: "rgba(23,29,52,.86)", height: 70 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-[13px] text-[var(--muted)] text-center py-4 m-0">
            Sin participantes todavía. ¡Sé el primero en el ranking!
          </p>
        </Card>
      ) : (
        <div className="grid gap-[10px] mb-4">
          {filtered.map((r, i) => (
            <Card key={r.id} className="flex items-center gap-[11px]">
              <div className="w-[32px] h-[32px] rounded-[12px] bg-[rgba(255,255,255,.07)] grid place-items-center font-black text-[#FFD400] flex-none">
                {i + 1}
              </div>
              <div className="flex-1">
                <h4 className="m-0 text-[13px] font-semibold">
                  {r.telegram_handle ? `@${r.telegram_handle}` : r.first_name ?? `Usuario #${i + 1}`}
                </h4>
                <p className="m-0 mt-[3px] text-[11px] text-[var(--muted)] capitalize">
                  {r.role ?? "—"}
                  {r.country && <span className="ml-1">{COUNTRIES.find(c => c.code === r.country)?.flag}</span>}
                </p>
              </div>
              <div className="text-[12px] font-black text-[#4DFF9D] whitespace-nowrap">
                {(r.xp ?? 0).toLocaleString()} XP
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="text-center text-[var(--soft)] text-[11px] my-[18px]">
        Ranking basado en acciones verificadas: perfiles, propuestas, briefs y reuniones.
      </p>
    </div>
  );
}
