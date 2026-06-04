"use client";

import { useAppState, useNav } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const quests = [
  {
    screen: "quests" as const,
    icon: "🚀",
    title: "Startup Quest",
    desc: "Completa perfil, presenta un piloto IA y gana acceso con XP.",
    xp: "+1,000 XP",
    role: "startup",
  },
  {
    screen: "agency-quest-page" as const,
    icon: "🔎",
    title: "Agency Quest",
    desc: "Descubre startups, recomienda soluciones y crea briefs para clientes.",
    xp: "+850 XP",
    role: "agency",
  },
  {
    screen: "brand-quest-page" as const,
    icon: "🎯",
    title: "Brand Quest",
    desc: "Publica retos reales, vota propuestas y solicita reuniones de piloto.",
    xp: "+900 XP",
    role: "brand",
  },
  {
    screen: "institutional-quest-page" as const,
    icon: "🌐",
    title: "Institutional Quest",
    desc: "Aceleradoras, incubadoras y hubs compiten activando sus startups.",
    xp: "+1,200 XP",
    role: "institutional",
  },
];

export function Home() {
  const { role, xp, badges } = useAppState();
  const { go } = useNav();

  return (
    <div>
      <div
        className="rounded-[28px] border p-5 mb-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg,rgba(255,212,0,.14),rgba(68,215,255,.08) 45%,rgba(255,79,216,.09))",
          border: "1px solid rgba(255,255,255,.09)",
          boxShadow: "0 18px 60px rgba(0,0,0,.35)",
        }}
      >
        <div
          className="absolute -right-10 -top-10 w-[140px] h-[140px] rounded-full pointer-events-none"
          style={{
            background: "rgba(255,212,0,.22)",
            filter: "blur(2px)",
          }}
        />
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">
          AI4Brands Innovation League
        </small>
        <h2 className="text-[27px] font-black tracking-tight leading-none mt-2 mb-2 max-w-[320px]">
          Construye con nosotros. Destaca en el ecosistema.
        </h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed max-w-[340px]">
          Startups, agencias, marcas e instituciones ganan XP con misiones
          diseñadas para generar propuestas, scouting, retos y conexiones reales.
        </p>
        <div className="flex gap-2 flex-wrap mt-3">
          {["🚀 Startups", "🔎 Agencias", "🎯 Marcas", "🌐 Institucional"].map(
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
        <div className="flex gap-[10px] mt-4">
          <Button onClick={() => go("quests")}>Ir a mi Quest</Button>
          <Button variant="secondary" onClick={() => go("event-page")}>
            Ver evento
          </Button>
        </div>
      </div>

      <Card clickable onClick={() => go("onboarding")} className="flex gap-3 items-center mb-4">
        <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">
          🧭
        </div>
        <div className="flex-1">
          <h4 className="m-0 mb-1 text-[14px] font-semibold">
            {role ? `Rol: ${role}` : "Elige tu rol en el ecosistema"}
          </h4>
          <p className="m-0 text-[var(--muted)] text-[12px]">
            Tu selección define funciones, permisos, badges y dónde puedes
            colaborar.
          </p>
        </div>
        <div className="text-[#FFD400] font-black text-[12px]">Rol</div>
      </Card>

      <div className="grid gap-[10px] mb-4" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { value: "4", label: "rutas de participación" },
          { value: "1K", label: "XP para desbloquear acceso" },
          { value: "🏆", label: "badges, rankings y awards" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[18px] border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] p-3"
          >
            <b className="text-[18px] block">{s.value}</b>
            <span className="text-[10px] text-[var(--muted)] leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Elige tu Quest</h3>
        <button
          onClick={() => go("badges-page")}
          className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0"
        >
          Ver badges
        </button>
      </div>

      <div className="grid gap-[10px] mb-4">
        {quests.map((q) => (
          <Card key={q.screen} clickable onClick={() => go(q.screen)} className="flex gap-3 items-center">
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">
              {q.icon}
            </div>
            <div className="flex-1">
              <h4 className="m-0 mb-1 text-[14px] font-semibold">{q.title}</h4>
              <p className="m-0 text-[var(--muted)] text-[12px]">{q.desc}</p>
            </div>
            <div className="text-[#FFD400] font-black text-[12px] whitespace-nowrap">{q.xp}</div>
          </Card>
        ))}
      </div>

      <Card
        clickable
        onClick={() => go("founder-challenge")}
        className="mb-[10px] relative overflow-hidden"
      >
        <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px] bg-[rgba(255,79,216,.14)] text-[#FF4FD8]">
          Mensaje de Yellow
        </span>
        <h4 className="m-0 mb-1 text-[14px] font-semibold">El reto de Elena Bienes</h4>
        <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">
          Trae una oportunidad real de IA: una startup, una agencia, una marca o
          un ecosistema listo para colaborar.
        </p>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] text-[var(--text)] rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
            Leer mensaje
          </button>
          <button className="flex-1 bg-[#FFD400] text-[#10131F] border-transparent rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
            Aceptar reto
          </button>
        </div>
      </Card>

      <Card
        clickable
        onClick={() => go("ecosystem-challenge")}
        className="mb-4 relative overflow-hidden"
      >
        <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px] bg-[rgba(255,212,0,.16)] text-[#FFD400]">
          Ecosystem Challenge
        </span>
        <h4 className="m-0 mb-1 text-[14px] font-semibold">Ranking de activación</h4>
        <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">
          El ranking premia actividad útil: perfiles completos, briefs,
          propuestas, votos y reuniones.
        </p>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] text-[var(--text)] rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
            Ver reglas
          </button>
          <button className="flex-1 bg-[#FFD400] text-[#10131F] border-transparent rounded-[14px] py-[10px] text-[12px] font-black cursor-pointer">
            Participar
          </button>
        </div>
      </Card>

      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          Comunidad y reputación
        </h3>
      </div>

      <div className="grid gap-[10px] mb-4">
        {[
          { icon: "💬", title: "Canal y grupo de Telegram", desc: "Únete para recibir retos, conectar con perfiles validados y activar badges.", xp: "+150 XP", screen: "community-page" as const },
          { icon: "🏅", title: "Badge System", desc: "Roles visibles para startups, agencias, marcas, ecosistemas, mentores y jurado.", xp: "Ver", screen: "badges-page" as const },
          { icon: "🗂️", title: "Base de datos por rol", desc: "Campos, permisos y estados para controlar colaboración.", xp: "DB", screen: "role-database" as const },
        ].map((item) => (
          <Card key={item.screen} clickable onClick={() => go(item.screen)} className="flex gap-3 items-center">
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 className="m-0 mb-1 text-[14px] font-semibold">{item.title}</h4>
              <p className="m-0 text-[var(--muted)] text-[12px]">{item.desc}</p>
            </div>
            <div className="text-[#FFD400] font-black text-[12px]">{item.xp}</div>
          </Card>
        ))}
      </div>

      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Tu progreso</h3>
        <button
          onClick={() => go("access-flow")}
          className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0"
        >
          Desbloquear
        </button>
      </div>

      <Card>
        <div className="flex justify-between text-[12px] text-[var(--muted)] mb-[7px]">
          <span>Acceso AI4Brands</span>
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
        <div className="flex gap-2 flex-wrap mt-3">
          {badges.map((b) => (
            <Badge key={b} variant={b === "Applicant" ? "gold" : b === "Profile Started" ? "green" : "default"}>
              {b}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
