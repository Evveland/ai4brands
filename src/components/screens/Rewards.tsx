"use client";

import { useAppState, useNav } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Rewards() {
  const { xp, badges } = useAppState();
  const { go } = useNav();

  return (
    <div>
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Trofeos</h3>
        <button
          onClick={() => go("access-flow")}
          className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0"
        >
          Acceso
        </button>
      </div>

      <Card className="mb-4">
        <div className="flex justify-between text-[12px] text-[var(--muted)] mb-[7px]">
          <span>Tu acceso gratuito</span>
          <b>{xp} / 1,000 XP</b>
        </div>
        <div className="h-[10px] bg-[rgba(255,255,255,.08)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg,#FFD400,#44D7FF)",
              width: `${Math.min((xp / 1000) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap mt-[10px]">
          <span className="border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] rounded-full px-[9px] py-[7px] text-[11px] font-black text-[#DCE3FF]">
            {badges.length} badges
          </span>
          <span className="border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] rounded-full px-[9px] py-[7px] text-[11px] font-black text-[#DCE3FF]">
            12 votos emitidos
          </span>
          <span className="border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] rounded-full px-[9px] py-[7px] text-[11px] font-black text-[#DCE3FF]">
            2 recomendaciones
          </span>
        </div>
      </Card>

      {/* Leaderboard */}
      <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden mb-[10px] shadow-[0_8px_28px_rgba(0,0,0,.18)]" open>
        <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">🏁</div>
          <div className="flex-1">
            <h4 className="m-0 mb-1 text-[14px] font-semibold">Leaderboards</h4>
            <p className="m-0 text-[var(--muted)] text-[12px]">Ecosistemas, startups y scouts en una vista compacta.</p>
          </div>
          <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black">⌄</div>
        </summary>
        <div className="p-[14px] border-t border-[rgba(255,255,255,.09)]">
          {[
            { rank: 1, name: "Madrid-in-Game Team", meta: "22 startups · 9 propuestas · 14 reuniones", xp: "8,940 XP" },
            { rank: 2, name: "Yellow Innovation Network", meta: "18 startups · 7 retos · 11 reuniones", xp: "7,620 XP" },
            { rank: 3, name: "Basque Innovation Team", meta: "15 startups · 6 propuestas · 8 reuniones", xp: "6,480 XP" },
          ].map((r) => (
            <Card key={r.rank} clickable onClick={() => go("ecosystem-detail")} className="flex items-center gap-[11px] mb-[10px]">
              <div className="w-[32px] h-[32px] rounded-[12px] bg-[rgba(255,255,255,.07)] grid place-items-center font-black text-[#FFD400] flex-none">{r.rank}</div>
              <div className="flex-1">
                <h4 className="m-0 text-[13px] font-semibold">{r.name}</h4>
                <p className="m-0 mt-[3px] text-[11px] text-[var(--muted)]">{r.meta}</p>
              </div>
              <div className="text-[12px] font-black text-[#4DFF9D] whitespace-nowrap">{r.xp}</div>
            </Card>
          ))}
          <Button full variant="secondary" onClick={() => go("rankings")}>Ver ranking completo</Button>
        </div>
      </details>

      {/* Awards */}
      <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden mb-[10px] shadow-[0_8px_28px_rgba(0,0,0,.18)]">
        <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">🏆</div>
          <div className="flex-1">
            <h4 className="m-0 mb-1 text-[14px] font-semibold">AI4Brands Awards</h4>
            <p className="m-0 text-[var(--muted)] text-[12px]">Categorías basadas en los retos del challenge.</p>
          </div>
          <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black">⌄</div>
        </summary>
        <div className="p-[14px] border-t border-[rgba(255,255,255,.09)] grid gap-[10px]">
          {[
            { screen: "award-content-ai" as const, type: "sponsor", typeLabel: "Award", title: "Best Content AI Pilot", desc: "Piloto medible para marcas.", votes: "312 votos", rec: "18 recomendaciones" },
            { screen: "award-cx-ai" as const, type: "brand", typeLabel: "Award", title: "Best Customer Experience AI", desc: "Agentes, automatización o analítica para clientes.", votes: "284 votos", rec: "21 recomendaciones" },
            { screen: "award-ecosystem" as const, type: "agency", typeLabel: "Award", title: "Ecosystem Activation Award", desc: "Hub con más oportunidades reales.", votes: "Ranking vivo", rec: "Startups + agencias" },
          ].map((a) => {
            const colors: Record<string, { bg: string; text: string }> = {
              brand: { bg: "rgba(68,215,255,.14)", text: "#44D7FF" },
              agency: { bg: "rgba(255,79,216,.14)", text: "#FF4FD8" },
              sponsor: { bg: "rgba(255,212,0,.16)", text: "#FFD400" },
            };
            const c = colors[a.type];
            return (
              <Card key={a.title} clickable onClick={() => go(a.screen)} className="relative overflow-hidden">
                <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px]" style={{ background: c.bg, color: c.text }}>{a.typeLabel}</span>
                <h4 className="m-0 mb-1 text-[14px] font-semibold">{a.title}</h4>
                <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">{a.desc}</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  <Badge variant="gold">{a.votes}</Badge>
                  <Badge>{a.rec}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </details>

      {/* Voting */}
      <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden mb-[10px] shadow-[0_8px_28px_rgba(0,0,0,.18)]">
        <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">🗳️</div>
          <div className="flex-1">
            <h4 className="m-0 mb-1 text-[14px] font-semibold">Votación y recomendación</h4>
            <p className="m-0 text-[var(--muted)] text-[12px]">Vota finalistas o recomienda startups con potencial de piloto.</p>
          </div>
          <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black">⌄</div>
        </summary>
        <div className="p-[14px] border-t border-[rgba(255,255,255,.09)] grid gap-[9px]">
          {[
            { title: "Voto público", sub: "1 voto por categoría y usuario validado", icon: "🗳️", screen: "awards-vote" as const },
            { title: "Recomendación profesional", sub: "Agencias y marcas justifican favoritos", icon: "⭐", screen: "awards-recommend" as const },
            { title: "Jurado AI4Brands", sub: "Valida finalistas y selecciona ganadores", icon: "🏅", screen: null },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => item.screen && go(item.screen)}
              className="flex items-center justify-between border border-[rgba(255,255,255,.09)] rounded-[17px] p-3 bg-[rgba(255,255,255,.04)] cursor-pointer"
            >
              <div>
                <div className="text-[13px] font-black">{item.title}</div>
                <span className="text-[11px] text-[var(--muted)]">{item.sub}</span>
              </div>
              <span className="text-[18px]">{item.icon}</span>
            </div>
          ))}
        </div>
      </details>

      {/* Badge System */}
      <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden mb-[10px] shadow-[0_8px_28px_rgba(0,0,0,.18)]">
        <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">🏅</div>
          <div className="flex-1">
            <h4 className="m-0 mb-1 text-[14px] font-semibold">Badge System</h4>
            <p className="m-0 text-[var(--muted)] text-[12px]">Insignias por tipo de usuario y participación en Telegram.</p>
          </div>
          <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black">⌄</div>
        </summary>
        <div className="p-[14px] border-t border-[rgba(255,255,255,.09)] grid gap-[9px]">
          {[
            { title: "Startup Badges", sub: "Applicant, Startup Ready, Challenge Finalist, Pilot Ready", icon: "🚀", screen: "badges-page" as const },
            { title: "Agency Badges", sub: "Scout, Recommender, Brief Builder, Top Connector", icon: "🔎", screen: "badges-page" as const },
            { title: "Brand Badges", sub: "Challenge Owner, Innovation Buyer, Pilot Sponsor", icon: "🎯", screen: "badges-page" as const },
            { title: "Ecosystem Badges", sub: "Community Partner, Talent Activator, Ecosystem Champion", icon: "🌐", screen: "badges-page" as const },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => go(item.screen)}
              className="flex items-center justify-between border border-[rgba(255,255,255,.09)] rounded-[17px] p-3 bg-[rgba(255,255,255,.04)] cursor-pointer"
            >
              <div>
                <div className="text-[13px] font-black">{item.title}</div>
                <span className="text-[11px] text-[var(--muted)]">{item.sub}</span>
              </div>
              <span className="text-[18px]">{item.icon}</span>
            </div>
          ))}
        </div>
      </details>

      {/* Unlockables */}
      <details className="border border-[rgba(255,255,255,.09)] bg-[rgba(23,29,52,.86)] rounded-[22px] overflow-hidden mb-[10px] shadow-[0_8px_28px_rgba(0,0,0,.18)]">
        <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">🎁</div>
          <div className="flex-1">
            <h4 className="m-0 mb-1 text-[14px] font-semibold">Desbloqueables</h4>
            <p className="m-0 text-[var(--muted)] text-[12px]">Badges, entrada gratuita, pitch slot y reuniones.</p>
          </div>
          <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[rgba(255,255,255,.07)] text-[#FFD400] font-black">⌄</div>
        </summary>
        <div className="p-[14px] border-t border-[rgba(255,255,255,.09)] grid gap-[9px]">
          {[
            { title: "Applicant Badge", sub: "Completar registro", icon: "✅" },
            { title: "Entrada gratuita", sub: "1,000 XP", icon: "🔒" },
            { title: "Pitch Slot", sub: "2,000 XP + selección agencia", icon: "🔒" },
            { title: "Reunión con sponsor", sub: "Top 20 startups", icon: "🔒" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between border border-[rgba(255,255,255,.09)] rounded-[17px] p-3 bg-[rgba(255,255,255,.04)]"
            >
              <div>
                <div className="text-[13px] font-black">{item.title}</div>
                <span className="text-[11px] text-[var(--muted)]">{item.sub}</span>
              </div>
              <span className="text-[18px]">{item.icon}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
