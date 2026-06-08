"use client";

import { useState } from "react";
import { useNav } from "@/lib/store";
import { BackBar } from "@/components/BackBar";
import { createOrg } from "@/lib/db/orgs";
import { useOrgQuest, NoOrgEntry, StatusBanner, InviteCard } from "@/components/quest/OrgQuestShell";

const inputCls = "w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors font-sans";
const labelCls = "block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5";

const investorTypes = ["Venture Capital", "Business Angel", "Corporate Venture", "Family Office", "Fondo de Inversión", "Aceleradora con inversión", "Otro"];
const verticalOptions = ["AI / IA", "MarTech", "AdTech", "SaaS", "Data & Analytics", "CreatorTech", "Retail Tech", "Otro"];

function CreateInvestorForm({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Venture Capital");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [verticals, setVerticals] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const vArr = verticals.split(",").map(s => s.trim()).filter(Boolean);
    await createOrg(userId, { type: "investor", name, ecosystem_tag: type, contact_email: email, website, verticals_interest: vArr, description });
    setLoading(false);
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div><label className={labelCls}>Nombre del fondo / inversor *</label>
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Kibo Ventures, Seedrocket…" className={inputCls} /></div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div><label className={labelCls}>Tipo</label>
          <select value={type} onChange={e => setType(e.target.value)} className={inputCls}>
            {investorTypes.map(t => <option key={t}>{t}</option>)}
          </select></div>
        <div><label className={labelCls}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deal@fondo.com" className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Verticales de interés</label>
        <input value={verticals} onChange={e => setVerticals(e.target.value)} placeholder="AI, MarTech, SaaS…" className={inputCls} />
        <div className="flex gap-1.5 flex-wrap mt-2">
          {verticalOptions.map(v => (
            <span key={v} onClick={() => setVerticals(p => p ? `${p}, ${v}` : v)}
              className="text-[10px] px-2 py-1 rounded-full border border-[rgba(255,255,255,.1)] text-[#737D9D] cursor-pointer hover:border-[rgba(255,212,0,.4)] hover:text-[#FFD400]">{v}</span>
          ))}
        </div>
      </div>
      <div><label className={labelCls}>Web</label>
        <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://fondo.com" className={inputCls} /></div>
      <div><label className={labelCls}>Tesis de inversión</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
          placeholder="Etapa, ticket medio, sectores y qué buscas en AI4Brands…" className={`${inputCls} resize-y`} /></div>
      <button type="submit" disabled={loading}
        className="rounded-[14px] py-3 font-black text-[14px] border-0 cursor-pointer mt-1"
        style={{ background: loading ? "rgba(255,212,0,.4)" : "#FFD400", color: "#10131F" }}>
        {loading ? "Enviando…" : "Enviar para revisión →"}
      </button>
    </form>
  );
}

const steps = [
  { icon: "🔎", title: "Descubre startups de IA", desc: "Accede al directorio de startups aprobadas en el ecosistema.", xp: "+200 XP", screen: "scout" as const },
  { icon: "⭐", title: "Señala interés en startups", desc: "Marca las startups que más te interesan para un follow-up.", xp: "+300 XP", screen: "awards-recommend" as const },
  { icon: "🤝", title: "Solicita reunión", desc: "Conecta directamente con fundadores de startups seleccionadas.", xp: "+500 XP", screen: "meeting-page" as const },
  { icon: "🏆", title: "Vota los AI4Brands Awards", desc: "Tu criterio como inversor influye en los ganadores.", xp: "+150 XP", screen: "awards-vote" as const },
];

export function InvestorQuestPage() {
  const { go } = useNav();
  const { org, loading, view, setView, reload, dbUser } = useOrgQuest();
  const approved = org?.status === "approved";

  if (loading) return <div><BackBar title="Investor Quest" subtitle="Cargando…" /><div className="grid gap-3">{[1,2,3].map(i => <div key={i} className="rounded-[20px] h-[70px] animate-pulse" style={{ background: "rgba(255,255,255,.06)" }} />)}</div></div>;
  if (view === "no-org") return <div><BackBar title="Investor Quest" subtitle="Descubre las mejores startups de IA para marketing" /><NoOrgEntry roleName="Inversor" userId={dbUser?.id ?? ""} onCreateClick={() => setView("create")} onJoined={reload} /></div>;
  if (view === "create") return <div><BackBar title="Registrar inversor" subtitle="Tu solicitud será revisada por AI4Brands" /><CreateInvestorForm userId={dbUser?.id ?? ""} onCreated={() => { setView("quest"); reload(); }} /></div>;

  return (
    <div>
      <BackBar title={org?.name ?? "Investor Quest"} subtitle={`${org?.ecosystem_tag ?? "Inversor"} · ${org?.role_in_org === "owner" ? "Responsable" : "Miembro"}`} />
      <StatusBanner status={org?.status ?? "pending"} reason={org?.rejection_reason} onRefresh={reload} />
      {org?.invite_code && <InviteCard code={org.invite_code} />}
      <div className="rounded-[18px] border p-4 mb-4" style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="text-[13px] font-black text-white mb-2">Perfil inversor</div>
        {[{ label: "Nombre", value: org?.name }, { label: "Tipo", value: org?.ecosystem_tag }, { label: "Verticales", value: org?.verticals_interest?.join(", ") }, { label: "Tesis", value: org?.description }, { label: "Web", value: org?.website }, { label: "Contacto", value: org?.contact_email }]
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
