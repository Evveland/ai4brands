"use client";

import { useState } from "react";
import { useNav } from "@/lib/store";
import { BackBar } from "@/components/BackBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createOrg, updateOrg } from "@/lib/db/orgs";
import { useOrgQuest, NoOrgEntry, StatusBanner, InviteCard, MembersList } from "@/components/quest/OrgQuestShell";

const inputCls = "w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors font-sans";
const labelCls = "block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5";

const verticals = ["Content AI","Customer Experience","Data & Insights","Loyalty & Gamification","Retail Media","Automation"];

function CreateStartupForm({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("Content AI");
  const [oneLiner, setOneLiner] = useState("");
  const [idealClient, setIdealClient] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createOrg(userId, { type: "startup", name, vertical, one_liner: oneLiner, ideal_client: idealClient, contact_email: email, website });
    setLoading(false);
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div><label className={labelCls}>Nombre de la startup *</label>
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: CXFlow AI" className={inputCls} /></div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div><label className={labelCls}>Vertical</label>
          <select value={vertical} onChange={e => setVertical(e.target.value)} className={inputCls}>
            {verticals.map(v => <option key={v}>{v}</option>)}
          </select></div>
        <div><label className={labelCls}>Email de contacto</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hola@startup.com" className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Pitch en una frase *</label>
        <textarea required value={oneLiner} onChange={e => setOneLiner(e.target.value)} rows={2}
          placeholder="Ayudamos a marcas a… con IA…" className={`${inputCls} resize-y`} /></div>
      <div><label className={labelCls}>Cliente ideal</label>
        <input value={idealClient} onChange={e => setIdealClient(e.target.value)} placeholder="Ej: retail, banca, gran consumo" className={inputCls} /></div>
      <div><label className={labelCls}>Web</label>
        <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://startup.com" className={inputCls} /></div>
      <button type="submit" disabled={loading}
        className="rounded-[14px] py-3 font-black text-[14px] border-0 cursor-pointer mt-1"
        style={{ background: loading ? "rgba(255,212,0,.4)" : "#FFD400", color: "#10131F" }}>
        {loading ? "Enviando solicitud…" : "Enviar para revisión →"}
      </button>
    </form>
  );
}

const steps = [
  { icon: "🧾", title: "Ficha básica", desc: "Nombre, vertical, pitch y cliente ideal.", xp: "+220 XP", screen: "profile-page" as const },
  { icon: "🧠", title: "Mapa de capacidades IA", desc: "Selecciona en qué tecnologías eres fuerte.", xp: "+120 XP", screen: "capabilities-page" as const },
  { icon: "🎯", title: "Propuesta 30/60/90", desc: "Define tu piloto para una gran marca.", xp: "+300 XP", screen: "pilot-page" as const },
  { icon: "📣", title: "Promoción", desc: "Invita actores clave y comparte con trazabilidad.", xp: "+400 XP", screen: "promotion-page" as const },
  { icon: "🏆", title: "Responde un Brand Challenge", desc: "Participa en un reto de sponsor, agencia o marca.", xp: "+500 XP", screen: "challenge-page" as const },
];

export function StartupQuestPage() {
  const { go } = useNav();
  const { org, loading, view, setView, reload, dbUser } = useOrgQuest();
  const [members, setMembers] = useState<any[]>([]);

  const approved = org?.status === "approved";

  if (loading) return (
    <div>
      <BackBar title="Startup Quest" subtitle="Cargando…" />
      <div className="grid gap-3">{[1,2,3].map(i => <div key={i} className="rounded-[20px] h-[70px] animate-pulse" style={{ background: "rgba(255,255,255,.06)" }} />)}</div>
    </div>
  );

  if (view === "no-org") return (
    <div>
      <BackBar title="Startup Quest" subtitle="Ruta de acceso para startups" />
      <NoOrgEntry roleName="Startup" userId={dbUser?.id ?? ""} onCreateClick={() => setView("create")} onJoined={reload} />
    </div>
  );

  if (view === "create") return (
    <div>
      <BackBar title="Registrar startup" subtitle="Tu solicitud será revisada por AI4Brands" />
      <CreateStartupForm userId={dbUser?.id ?? ""} onCreated={() => { setView("quest"); reload(); }} />
    </div>
  );

  // Quest view
  return (
    <div>
      <BackBar title={org?.name ?? "Startup Quest"} subtitle={`${org?.vertical ?? "Startup"} · ${org?.role_in_org === "owner" ? "Responsable" : "Miembro"}`} />

      <StatusBanner status={org?.status ?? "pending"} reason={org?.rejection_reason} />

      {org?.invite_code && <InviteCard code={org.invite_code} />}

      {/* Org data card */}
      <div className="rounded-[18px] border p-4 mb-4" style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="text-[13px] font-black text-white mb-2">Perfil de la startup</div>
        {[
          { label: "Nombre", value: org?.name },
          { label: "Vertical", value: org?.vertical },
          { label: "Pitch", value: org?.one_liner },
          { label: "Cliente ideal", value: org?.ideal_client },
          { label: "Web", value: org?.website },
          { label: "Contacto", value: org?.contact_email },
        ].filter(r => r.value).map(r => (
          <div key={r.label} className="flex justify-between text-[12px] py-[7px] border-b border-[rgba(255,255,255,.06)] last:border-0">
            <span className="text-[#737D9D]">{r.label}</span>
            <span className="text-white font-semibold text-right max-w-[55%] truncate">{r.value}</span>
          </div>
        ))}
        {(org?.xp ?? 0) > 0 && (
          <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,.06)] flex justify-between items-center">
            <span className="text-[12px] text-[#737D9D]">XP acumulado</span>
            <span className="text-[14px] font-black text-[#FFD400]">{(org?.xp ?? 0).toLocaleString()} XP</span>
          </div>
        )}
      </div>

      <MembersList members={members} />

      {/* Quest steps */}
      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Pasos del Quest</h3>
        <span className="text-[12px] text-[#737D9D]">{approved ? "Activo" : "Bloqueado hasta aprobación"}</span>
      </div>

      <div className="grid gap-[10px]">
        {steps.map((s) => (
          <div
            key={s.screen}
            onClick={() => approved && go(s.screen)}
            className="rounded-[22px] border p-[14px] flex gap-3 items-center transition-all"
            style={{
              background: "rgba(23,29,52,.86)",
              border: "1px solid rgba(255,255,255,.09)",
              cursor: approved ? "pointer" : "default",
              opacity: approved ? 1 : 0.45,
              filter: approved ? "none" : "grayscale(0.3)",
            }}>
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">{s.icon}</div>
            <div className="flex-1">
              <h4 className="m-0 mb-1 text-[14px] font-semibold">{s.title}</h4>
              <p className="m-0 text-[var(--muted)] text-[12px]">{s.desc}</p>
            </div>
            <div className="text-[#FFD400] font-black text-[12px] whitespace-nowrap">{s.xp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
