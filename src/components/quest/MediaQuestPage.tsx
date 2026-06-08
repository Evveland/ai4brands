"use client";

import { useState } from "react";
import { useNav } from "@/lib/store";
import { BackBar } from "@/components/BackBar";
import { createOrg } from "@/lib/db/orgs";
import { useOrgQuest, NoOrgEntry, StatusBanner, InviteCard } from "@/components/quest/OrgQuestShell";

const inputCls = "w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors font-sans";
const labelCls = "block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5";

const mediaTypes = ["Medio digital", "Revista / Publicación", "Podcast / YouTube", "Newsletter", "Radio / TV", "Agencia de contenidos", "Blog especializado", "Otro"];

function CreateMediaForm({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Medio digital");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createOrg(userId, { type: "media", name, ecosystem_tag: type, contact_email: email, website, description });
    setLoading(false);
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div><label className={labelCls}>Nombre del medio *</label>
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Marketing4Ecommerce, El Referente…" className={inputCls} /></div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div><label className={labelCls}>Tipo</label>
          <select value={type} onChange={e => setType(e.target.value)} className={inputCls}>
            {mediaTypes.map(t => <option key={t}>{t}</option>)}
          </select></div>
        <div><label className={labelCls}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="editorial@medio.com" className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Web / Canal</label>
        <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://medio.com" className={inputCls} /></div>
      <div><label className={labelCls}>Audiencia y cobertura</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
          placeholder="Describe tu audiencia, alcance y tipo de contenido sobre IA y marketing…" className={`${inputCls} resize-y`} /></div>
      <button type="submit" disabled={loading}
        className="rounded-[14px] py-3 font-black text-[14px] border-0 cursor-pointer mt-1"
        style={{ background: loading ? "rgba(255,212,0,.4)" : "#FFD400", color: "#10131F" }}>
        {loading ? "Enviando…" : "Enviar para revisión →"}
      </button>
    </form>
  );
}

const steps = [
  { icon: "📰", title: "Perfil editorial", desc: "Comparte tu línea editorial e intereses de cobertura.", xp: "+150 XP", screen: "event-page" as const },
  { icon: "🎤", title: "Acredítate al evento", desc: "Solicita acreditación de prensa para AI4Brands 2026.", xp: "+200 XP", screen: "community-page" as const },
  { icon: "📢", title: "Crea contenido", desc: "Publica sobre AI4Brands en tu medio y valida el link.", xp: "+300 XP", screen: "promotion-page" as const },
  { icon: "🏆", title: "Cubre los Awards", desc: "Cobertura de los AI4Brands Awards y resultados.", xp: "+400 XP", screen: "awards-vote" as const },
];

export function MediaQuestPage() {
  const { go } = useNav();
  const { org, loading, view, setView, reload, dbUser } = useOrgQuest();
  const approved = org?.status === "approved";

  if (loading) return <div><BackBar title="Media Quest" subtitle="Cargando…" /><div className="grid gap-3">{[1,2,3].map(i => <div key={i} className="rounded-[20px] h-[70px] animate-pulse" style={{ background: "rgba(255,255,255,.06)" }} />)}</div></div>;
  if (view === "no-org") return <div><BackBar title="Media Quest" subtitle="Cobertura y difusión de AI4Brands" /><NoOrgEntry roleName="Medio" userId={dbUser?.id ?? ""} onCreateClick={() => setView("create")} onJoined={reload} /></div>;
  if (view === "create") return <div><BackBar title="Registrar medio" subtitle="Tu solicitud será revisada por AI4Brands" /><CreateMediaForm userId={dbUser?.id ?? ""} onCreated={() => { setView("quest"); reload(); }} /></div>;

  return (
    <div>
      <BackBar title={org?.name ?? "Media Quest"} subtitle={`${org?.ecosystem_tag ?? "Medio"} · ${org?.role_in_org === "owner" ? "Responsable" : "Miembro"}`} />
      <StatusBanner status={org?.status ?? "pending"} reason={org?.rejection_reason} onRefresh={reload} />
      {org?.invite_code && <InviteCard code={org.invite_code} />}
      <div className="rounded-[18px] border p-4 mb-4" style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="text-[13px] font-black text-white mb-2">Perfil del medio</div>
        {[{ label: "Nombre", value: org?.name }, { label: "Tipo", value: org?.ecosystem_tag }, { label: "Descripción", value: org?.description }, { label: "Web", value: org?.website }, { label: "Contacto", value: org?.contact_email }]
          .filter(r => r.value).map(r => (
          <div key={r.label} className="flex justify-between text-[12px] py-[7px] border-b border-[rgba(255,255,255,.06)] last:border-0">
            <span className="text-[#737D9D]">{r.label}</span>
            <span className="text-white font-semibold text-right max-w-[60%] truncate">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">Pasos del Quest</h3>
        <span className="text-[12px] text-[#737D9D]">{approved ? "Activo" : "Pendiente aprobación"}</span>
      </div>
      <div className="grid gap-[10px]">
        {steps.map(s => (
          <div key={s.screen} onClick={() => approved && go(s.screen)}
            className="rounded-[22px] border p-[14px] flex gap-3 items-center"
            style={{ background: "rgba(23,29,52,.86)", border: "1px solid rgba(255,255,255,.09)", cursor: approved ? "pointer" : "default", opacity: approved ? 1 : 0.45 }}>
            <div className="min-w-[42px] h-[42px] rounded-[15px] grid place-items-center text-[20px] bg-[rgba(255,255,255,.08)]">{s.icon}</div>
            <div className="flex-1"><h4 className="m-0 mb-1 text-[14px] font-semibold">{s.title}</h4><p className="m-0 text-[var(--muted)] text-[12px]">{s.desc}</p></div>
            <div className="text-[#FFD400] font-black text-[12px] whitespace-nowrap">{s.xp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
