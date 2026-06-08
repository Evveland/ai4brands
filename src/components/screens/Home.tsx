"use client";

import { useAppState, useNav } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Role, Screen } from "@/types";

const quests: { screen: Screen; icon: string; title: string; desc: string; xp: string; role: Role }[] = [
  { screen: "startup-quest",      icon: "🚀", title: "Startup Quest",      desc: "Registra tu startup, recibe aprobación y gana acceso con XP.", xp: "+1,000 XP", role: "startup" },
  { screen: "agency-quest",       icon: "🔎", title: "Agency Quest",       desc: "Registra tu agencia, haz scouting y crea briefs para clientes.", xp: "+850 XP", role: "agency" },
  { screen: "brand-quest",        icon: "🎯", title: "Brand Quest",        desc: "Registra tu marca, publica retos reales y solicita reuniones.", xp: "+900 XP", role: "brand" },
  { screen: "media-quest",        icon: "📺", title: "Media Quest",        desc: "Regístrate como medio, acredítate y cubre AI4Brands.", xp: "+600 XP", role: "media" },
  { screen: "university-quest",   icon: "🎓", title: "University Quest",   desc: "Conecta talento académico y forma equipo para el Prompt-a-thon.", xp: "+800 XP", role: "university" },
  { screen: "investor-quest",     icon: "💰", title: "Investor Quest",     desc: "Descubre startups de IA con potencial de inversión.", xp: "+700 XP", role: "investor" },
  { screen: "institutional-quest",icon: "🌐", title: "Institutional Quest",desc: "Registra tu ecosistema y activa tu comunidad de startups.", xp: "+1,200 XP", role: "institutional" },
  { screen: "institutional-quest",icon: "🏗️", title: "Hub & Lab Quest",   desc: "Activa tu hub de innovación y conecta con el ecosistema.", xp: "+800 XP", role: "hub" },
];

const roleHero: Record<Role, { title: string; desc: string; cta: string; ctaScreen: Screen }> = {
  startup: {
    title: "Construye tu piloto. Gana acceso.",
    desc: "Registra tu startup, recibe aprobación de AI4Brands y desbloquea tu Quest completo.",
    cta: "Ir a Startup Quest",
    ctaScreen: "startup-quest",
  },
  agency: {
    title: "Descubre IA para tus clientes.",
    desc: "Registra tu agencia, actúa como scout y conecta startups con las marcas que trabajas.",
    cta: "Ir a Agency Quest",
    ctaScreen: "agency-quest",
  },
  brand: {
    title: "Lanza retos reales de innovación.",
    desc: "Registra tu marca, publica un challenge y conecta con startups listas para pilotar.",
    cta: "Ir a Brand Quest",
    ctaScreen: "brand-quest",
  },
  institutional: {
    title: "Activa tu ecosistema de startups.",
    desc: "Registra tu organización, invita tu cohort y compite por el Ecosystem Champion Award.",
    cta: "Ir a Institutional Quest",
    ctaScreen: "institutional-quest",
  },
  media: {
    title: "Cubre la revolución de la IA en marketing.",
    desc: "Acredítate como medio oficial de AI4Brands y crea contenido sobre el ecosistema.",
    cta: "Ir a Media Quest",
    ctaScreen: "media-quest",
  },
  university: {
    title: "Conecta talento académico con la industria.",
    desc: "Activa tus startups alumni, forma equipo para el Prompt-a-thon y conecta con empresas.",
    cta: "Ir a University Quest",
    ctaScreen: "university-quest",
  },
  investor: {
    title: "Descubre las mejores startups de IA.",
    desc: "Accede al directorio verificado de startups y agenda reuniones directas con fundadores.",
    cta: "Ir a Investor Quest",
    ctaScreen: "investor-quest",
  },
  hub: {
    title: "Activa tu hub de innovación.",
    desc: "Conecta tu comunidad de startups con marcas y agencias en el ecosistema AI4Brands.",
    cta: "Ir a Hub Quest",
    ctaScreen: "institutional-quest",
  },
  curator: {
    title: "Valida, cuida y patrocina.",
    desc: "Acceso a recomendaciones, awards, reportes y retos patrocinados.",
    cta: "Ver Challenges",
    ctaScreen: "challenges",
  },
};

const communityItems: { icon: string; title: string; desc: string; xp: string; screen: Screen }[] = [
  { icon: "💬", title: "Canal y grupo de Telegram", desc: "Únete para recibir retos, conectar con perfiles validados y activar badges.", xp: "+150 XP", screen: "community-page" },
  { icon: "🏅", title: "Sistema de Badges", desc: "Roles visibles para startups, agencias, marcas, ecosistemas, mentores y jurado.", xp: "Ver", screen: "badges-page" },
  { icon: "🗂️", title: "Base de datos por rol", desc: "Campos, permisos y estados para controlar la colaboración.", xp: "DB", screen: "role-database" },
];

function ExpandCard({ icon, title, subtitle, children }: { icon: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <details
      className="rounded-[22px] border overflow-hidden mb-[10px]"
      style={{ background: "rgba(23,29,52,.86)", border: "1px solid rgba(255,255,255,.09)", boxShadow: "0 8px 28px rgba(0,0,0,.18)" }}
    >
      <summary className="list-none cursor-pointer p-[14px] flex gap-3 items-center">
        <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="m-0 mb-[3px] text-[14px] font-semibold">{title}</h4>
          <p className="m-0 text-[var(--muted)] text-[12px]">{subtitle}</p>
        </div>
        <div
          className="w-[28px] h-[28px] rounded-full grid place-items-center font-black text-[14px] flex-none transition-transform"
          style={{ background: "rgba(255,255,255,.07)", color: "#FFD400" }}
        >
          ⌄
        </div>
      </summary>
      <div className="border-t grid gap-[10px] p-[14px]" style={{ borderColor: "rgba(255,255,255,.09)" }}>
        {children}
      </div>
    </details>
  );
}

export function Home() {
  const { role, xp, badges } = useAppState();
  const { go } = useNav();

  const hero = role ? roleHero[role] : null;
  const visibleQuests = role ? quests.filter((q) => q.role === role) : quests;

  return (
    <div>
      {/* ── Event Promo Banner ── */}
      <div
        onClick={() => go("event-page")}
        className="rounded-[22px] border p-4 mb-4 cursor-pointer flex gap-4 items-center"
        style={{ background: "linear-gradient(135deg,rgba(255,212,0,.18),rgba(68,215,255,.08))", border: "1px solid rgba(255,212,0,.3)" }}
      >
        <div className="w-[52px] h-[52px] rounded-[16px] bg-[#FFD400] grid place-items-center text-[#111] font-black text-center flex-none" style={{ lineHeight: 1 }}>
          <div><div className="text-[22px] font-black">15</div><div className="text-[9px] uppercase">Dic</div></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-[14px] text-white truncate">AI4Brands 2026 · La Nave, Madrid</div>
          <div className="text-[11px] text-[#A9B1CB] mt-0.5">Ponencias · Prompt-a-thon · Awards · Networking</div>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {["🎤 Expertos", "⚡ Prompt-a-thon", "🏆 Awards"].map(t => (
              <span key={t} className="text-[9px] font-black px-2 py-0.5 rounded-full border border-[rgba(255,212,0,.3)] text-[#FFD400]">{t}</span>
            ))}
          </div>
        </div>
        <span className="text-[#FFD400] text-[18px] flex-none">→</span>
      </div>

      {/* ── Hero ── */}
      <div
        className="rounded-[28px] border p-5 mb-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg,rgba(255,212,0,.14),rgba(68,215,255,.08) 45%,rgba(255,79,216,.09))",
          border: "1px solid rgba(255,255,255,.09)",
          boxShadow: "0 18px 60px rgba(0,0,0,.35)",
        }}
      >
        <div className="absolute -right-10 -top-10 w-[140px] h-[140px] rounded-full pointer-events-none" style={{ background: "rgba(255,212,0,.22)", filter: "blur(2px)" }} />
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">
          AI4Brands Innovation League
        </small>
        <h2 className="text-[27px] font-black tracking-tight leading-none mt-2 mb-2 max-w-[320px]">
          {hero ? hero.title : "Construye con nosotros. Destaca en el ecosistema."}
        </h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed max-w-[340px]">
          {hero
            ? hero.desc
            : "Startups, agencias, marcas e instituciones ganan XP con misiones diseñadas para generar propuestas, scouting, retos y conexiones reales."}
        </p>

        {/* Pills — hide once role is chosen */}
        {!role && (
          <div className="flex gap-2 flex-wrap mt-3">
            {["🚀 Startups", "🔎 Agencias", "🎯 Marcas", "🌐 Institucional"].map((p) => (
              <span key={p} className="border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.07)] rounded-full px-[10px] py-[8px] text-[11px] font-black text-[#EAF0FF]">
                {p}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-[10px] mt-4">
          <Button onClick={() => go(hero ? hero.ctaScreen : "onboarding")}>
            {hero ? hero.cta : "Elegir mi camino"}
          </Button>
          <Button variant="secondary" onClick={() => go("event-page")}>
            Ver evento
          </Button>
        </div>
      </div>

      {/* ── Quest section ── */}
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          {role ? "Tu Quest" : "Elige tu Quest"}
        </h3>
        <button onClick={() => go("badges-page")} className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0">
          Ver badges
        </button>
      </div>

      <div className="grid gap-[10px] mb-4">
        {visibleQuests.map((q) => (
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

      {/* ── Retos Iniciales (collapsible) ── */}
      <ExpandCard icon="⚡" title="Retos Iniciales" subtitle="Gana XP respondiendo retos de marcas, agencias y el ecosistema.">
        <Card clickable onClick={() => go("founder-challenge")} className="relative overflow-hidden">
          <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px] bg-[rgba(255,79,216,.14)] text-[#FF4FD8]">
            Mensaje de Yellow
          </span>
          <h4 className="m-0 mb-1 text-[14px] font-semibold">El reto de Elena Bienes</h4>
          <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">
            Trae una oportunidad real de IA: una startup, una agencia, una marca o un ecosistema listo para colaborar.
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

        <Card clickable onClick={() => go("ecosystem-challenge")} className="relative overflow-hidden">
          <span className="inline-flex rounded-full px-[9px] py-[6px] text-[10px] font-black mb-[10px] bg-[rgba(255,212,0,.16)] text-[#FFD400]">
            Ecosystem Challenge
          </span>
          <h4 className="m-0 mb-1 text-[14px] font-semibold">Ranking de activación</h4>
          <p className="m-0 text-[var(--muted)] text-[12px] leading-snug">
            El ranking premia actividad útil: perfiles completos, briefs, propuestas, votos y reuniones.
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

        <button onClick={() => go("challenges")} className="w-full text-[12px] font-bold text-[#FFD400] bg-transparent border-0 cursor-pointer py-1">
          Ver todos los retos →
        </button>
      </ExpandCard>

      {/* ── Comunidad y Reputación (collapsible) ── */}
      <ExpandCard icon="🏅" title="Comunidad y Reputación" subtitle="Telegram, badges y base de datos por rol.">
        {communityItems.map((item) => (
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
      </ExpandCard>

      {/* ── Tu progreso ── */}
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Tu progreso</h3>
        <button onClick={() => go("access-flow")} className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0">
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
            style={{ background: "linear-gradient(90deg,#FFD400,#44D7FF)", width: `${Math.min((xp / 1000) * 100, 100)}%` }}
          />
        </div>
        <div className="flex gap-2 flex-wrap mt-3">
          {badges.map((b) => (
            <Badge key={b} variant={b === "Candidato" ? "gold" : b === "Perfil Iniciado" ? "green" : "default"}>
              {b}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
