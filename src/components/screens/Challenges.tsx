"use client";

import { useNav } from "@/lib/store";
import { Card } from "@/components/ui/Card";

const challenges = [
  {
    type: "sponsor" as const,
    typeLabel: "Ecosystem Challenge",
    title: "Ranking de activación",
    desc: "Un reto para medir qué comunidad genera más oportunidades antes del evento.",
    screen: "ecosystem-challenge" as const,
    actions: ["Reglas", "Sumar XP"],
  },
  {
    type: "agency" as const,
    typeLabel: "Founder Challenge",
    title: "Trae un caso real al evento",
    desc: "Reto personal de Yellow para convertir asistencia en oportunidades de innovación.",
    screen: "founder-challenge" as const,
    actions: ["Mensaje", "Aceptar"],
  },
  {
    type: "sponsor" as const,
    typeLabel: "Sponsor Challenge",
    title: "IA para personalizar campañas a escala",
    desc: "Buscamos startups capaces de generar, adaptar y medir contenido para distintos segmentos.",
    screen: "challenge-detail" as const,
    actions: ["Guardar", "Responder"],
  },
  {
    type: "brand" as const,
    typeLabel: "Brand Challenge",
    title: "Reducir fricción en atención al cliente",
    desc: "Soluciones de AI agents, automatización conversacional y analítica de satisfacción para retail.",
    screen: "challenge-retail" as const,
    actions: ["Ver brief", "Aplicar"],
  },
  {
    type: "agency" as const,
    typeLabel: "Agency Brief",
    title: "Creator Economy + IA para lanzamientos",
    desc: "Una agencia busca startups para activar comunidades, influencers y UGC con IA.",
    screen: "challenge-agency" as const,
    actions: ["Compartir", "Proponer"],
  },
];

const pillColors: Record<string, { bg: string; text: string }> = {
  brand: { bg: "rgba(68,215,255,.14)", text: "#44D7FF" },
  agency: { bg: "rgba(255,79,216,.14)", text: "#FF4FD8" },
  sponsor: { bg: "rgba(255,212,0,.16)", text: "#FFD400" },
};

const verticals = [
  "Content AI",
  "Customer Experience",
  "Retail Media",
  "Data & Insights",
  "Loyalty",
  "Automation",
];

export function Challenges() {
  const { go } = useNav();

  return (
    <div>
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          Brand Challenges
        </h3>
        <button
          onClick={() => go("challenge-create")}
          className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0"
        >
          Publicar reto
        </button>
      </div>

      <div className="grid gap-[10px] mb-4">
        {challenges.map((c) => {
          const colors = pillColors[c.type];
          return (
            <Card
              key={c.title}
              clickable
              onClick={() => go(c.screen)}
              className="relative overflow-hidden"
            >
              <span
                className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px]"
                style={{ background: colors.bg, color: colors.text }}
              >
                {c.typeLabel}
              </span>
              <h4 className="m-0 mb-1 text-[14px] font-semibold">{c.title}</h4>
              <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">
                {c.desc}
              </p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] text-[var(--text)] rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
                  {c.actions[0]}
                </button>
                <button className="flex-1 bg-[#FFD400] text-[#10131F] border-transparent rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
                  {c.actions[1]}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          Verticales calientes
        </h3>
      </div>
      <div
        className="grid gap-[9px]"
        style={{ gridTemplateColumns: "repeat(3,1fr)" }}
      >
        {verticals.map((v) => (
          <div
            key={v}
            className="rounded-[18px] border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.05)] p-3 text-[11px] font-black min-h-[70px] flex items-end"
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
