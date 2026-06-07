"use client";

import { useDispatch, useNav } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/types";

const roles: {
  id: Role;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  label: string;
}[] = [
  {
    id: "startup",
    icon: "🚀",
    tag: "Startup",
    title: "Quiero presentar una solución de IA",
    desc: "Acceso a perfil, promoción, challenge, awards y reuniones con agencias/marcas.",
    label: "Start",
  },
  {
    id: "agency",
    icon: "🔎",
    tag: "Agencia",
    title: "Quiero actuar como scout",
    desc: "Descubre startups, recomienda soluciones, crea briefs y conecta clientes.",
    label: "Scout",
  },
  {
    id: "brand",
    icon: "🎯",
    tag: "Marca",
    title: "Quiero lanzar retos reales",
    desc: "Publica challenges, vota propuestas, pide reuniones y selecciona pilotos.",
    label: "Brief",
  },
  {
    id: "institutional",
    icon: "🌐",
    tag: "Institucional",
    title: "Quiero activar mi ecosistema",
    desc: "Aceleradoras, incubadoras, hubs y comunidades invitan startups y compiten por impacto.",
    label: "Hub",
  },
];

export function Onboarding() {
  const dispatch = useDispatch();
  const { go } = useNav();

  function selectRole(role: Role) {
    dispatch({ type: "SET_ROLE", role });
    dispatch({ type: "ADD_BADGE", badge: "Candidato" });
    go("home");
  }

  return (
    <div>
      <div
        className="rounded-[28px] border p-5 mb-4"
        style={{
          background:
            "linear-gradient(145deg,rgba(255,212,0,.14),rgba(68,215,255,.08) 45%,rgba(255,79,216,.09))",
          border: "1px solid rgba(255,255,255,.09)",
        }}
      >
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">
          Onboarding
        </small>
        <h2 className="text-[22px] font-black tracking-tight mt-2 mb-2 leading-tight">
          ¿Cómo quieres actuar en AI4Brands?
        </h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed">
          Elige tu rol principal. Esto activa tus funciones, quests, badges,
          permisos de colaboración y campos de base de datos.
        </p>
        <div className="flex gap-2 flex-wrap mt-3">
          {["🔐 Accesos por rol", "🏅 Badges automáticos", "💬 Telegram roles"].map(
            (p) => (
              <span
                key={p}
                className="border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] rounded-full px-[10px] py-[8px] text-[11px] font-black text-[#EAF0FF]"
              >
                {p}
              </span>
            )
          )}
        </div>
      </div>

      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          Selecciona tu rol
        </h3>
        <button
          onClick={() => go("role-matrix")}
          className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0"
        >
          Ver permisos
        </button>
      </div>

      <div className="grid gap-[10px]">
        {roles.map((r) => (
          <Card
            key={r.id}
            clickable
            onClick={() => selectRole(r.id)}
            className="flex gap-3 items-center"
          >
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">
              {r.icon}
            </div>
            <div className="flex-1">
              <span className="inline-flex rounded-full border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] px-[9px] py-[6px] text-[10px] font-black text-[#DCE3FF] mb-2">
                {r.tag}
              </span>
              <h4 className="m-0 mb-1 text-[14px] font-semibold">{r.title}</h4>
              <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">
                {r.desc}
              </p>
            </div>
            <div className="ml-auto text-[#FFD400] font-black text-[12px] whitespace-nowrap">
              {r.label}
            </div>
          </Card>
        ))}

        <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
          <h3 className="m-0 text-[17px] font-bold tracking-tight">
            Rol de soporte
          </h3>
        </div>

        <Card
          clickable
          onClick={() => selectRole("curator")}
          className="flex gap-3 items-center"
        >
          <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">
            ⚖️
          </div>
          <div className="flex-1">
            <span className="inline-flex rounded-full border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] px-[9px] py-[6px] text-[10px] font-black text-[#DCE3FF] mb-2">
              Yellow / Sponsor / Jurado
            </span>
            <h4 className="m-0 mb-1 text-[14px] font-semibold">
              Quiero curar, validar o patrocinar
            </h4>
            <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">
              Acceso a recomendaciones, awards, reportes, retos patrocinados y
              validación.
            </p>
          </div>
          <div className="ml-auto text-[#FFD400] font-black text-[12px]">
            Admin
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h4 className="m-0 mb-2 text-[14px] font-semibold">
          Después de elegir
        </h4>
        <div className="grid gap-2">
          {[
            {
              title: "Tu home se personaliza",
              sub: "Se prioriza tu quest y tus CTAs.",
              status: "✓",
              color: "#4DFF9D",
            },
            {
              title: "Telegram asigna rol",
              sub: "Canal para anuncios, grupo para colaboración.",
              status: "✓",
              color: "#4DFF9D",
            },
            {
              title: "Colaboración controlada",
              sub: "Cada usuario puede actuar donde aporta valor.",
              status: "Role based",
              color: "#FFD400",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="grid items-center border border-[rgba(255,255,255,.09)] rounded-[15px] p-[10px] bg-[rgba(255,255,255,.04)] text-[12px]"
              style={{ gridTemplateColumns: "1fr auto" }}
            >
              <div>
                <b className="text-[12px]">{item.title}</b>
                <br />
                <span className="text-[var(--muted)] text-[11px]">
                  {item.sub}
                </span>
              </div>
              <div style={{ color: item.color }} className="font-black">
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
