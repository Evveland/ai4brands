"use client";

import { useState } from "react";
import { useNav } from "@/lib/store";
import { BackBar } from "@/components/BackBar";
import { createOrg } from "@/lib/db/orgs";
import { useOrgQuest, NoOrgEntry, StatusBanner, InviteCard, MembersList } from "@/components/quest/OrgQuestShell";

const inputCls = "w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors font-sans";
const labelCls = "block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5";

const specialtyOptions = ["Content AI","Customer Experience","Data & Insights","Loyalty & Gamification","Retail Media","Automation","Creator Economy","Performance","Brand Strategy"];

function CreateAgencyForm({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const sArr = specialties.split(",").map(s => s.trim()).filter(Boolean);
    await createOrg(userId, { type: "agency", name, contact_email: email, website, specialties: sArr, description });
    setLoading(false);
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div><label className={labelCls}>Nombre de la agencia *</label>
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Yellow Strategy" className={inputCls} /></div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div><label className={labelCls}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hola@agencia.com" className={inputCls} /></div>
        <div><label className={labelCls}>Web</label>
          <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://agencia.com" className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Especialidades <span className="normal-case font-normal">(separadas por coma)</span></label>
        <input value={specialties} onChange={e => setSpecialties(e.target.value)} placeholder="Content AI, CX, Data…" className={inputCls} />
        <div className="flex gap-1.5 flex-wrap mt-2">
          {specialtyOptions.map(s => (
            <span key={s} onClick={() => setSpecialties(p => p ? `${p}, ${s}` : s)}
              className="text-[10px] px-2 py-1 rounded-full border border-[rgba(255,255,255,.1)] text-[#737D9D] cursor-pointer hover:border-[rgba(255,212,0,.4)] hover:text-[#FFD400]">{s}</span>
          ))}
        </div>
      </div>
      <div><label className={labelCls}>Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
          placeholder="Qué hace vuestra agencia…" className={`${inputCls} resize-y`} /></div>
      <button type="submit" disabled={loading}
        className="rounded-[14px] py-3 font-black text-[14px] border-0 cursor-pointer mt-1"
        style={{ background: loading ? "rgba(255,212,0,.4)" : "#FFD400", color: "#10131F" }}>
        {loading ? "Enviando…" : "Enviar para revisión →"}
      </button>
    </form>
  );
}

const steps = [
  { icon: "🔎", title: "Scout de startups", desc: "Busca y guarda startups por vertical y necesidad de cliente.", xp: "+200 XP", screen: "scout" as const },
  { icon: "⭐", title: "Recomienda una startup", desc: "Recomendaciones con criterio y justificación.", xp: "+250 XP", screen: "awards-recommend" as const },
  { icon: "🧾", title: "Crea un brief", desc: "Convierte una necesidad de cliente en challenge.", xp: "+300 XP", screen: "challenge-create" as const },
  { icon: "🤝", title: "Genera una reunión", desc: "Conecta una startup con tu cliente.", xp: "+500 XP", screen: "meeting-page" as const },
];

export function AgencyQuestPage() {
  const { go } = useNav();
  const { org, loading, view, setView, reload, dbUser } = useOrgQuest();
  const approved = org?.status === "approved";

  if (loading) return <div><BackBar title="Agency Quest" subtitle="Cargando…" /><div className="grid gap-3">{[1,2,3].map(i => <div key={i} className="rounded-[20px] h-[70px] animate-pulse" style={{ background: "rgba(255,255,255,.06)" }} />)}</div></div>;

  if (view === "no-org") return <div><BackBar title="Agency Quest" subtitle="Ruta de acceso para agencias" /><NoOrgEntry roleName="Agencia" userId={dbUser?.id ?? ""} onCreateClick={() => setView("create")} onJoined={reload} /></div>;

  if (view === "create") return <div><BackBar title="Registrar agencia" subtitle="Tu solicitud será revisada por AI4Brands" /><CreateAgencyForm userId={dbUser?.id ?? ""} onCreated={() => { setView("quest"); reload(); }} /></div>;

  return (
    <div>
      <BackBar title={org?.name ?? "Agency Quest"} subtitle={`Agencia · ${org?.role_in_org === "owner" ? "Responsable" : "Miembro"}`} />
      <StatusBanner status={org?.status ?? "pending"} reason={org?.rejection_reason} onRefresh={reload} />
      {org?.invite_code && <InviteCard code={org.invite_code} />}
      <div className="rounded-[18px] border p-4 mb-4" style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="text-[13px] font-black text-white mb-2">Perfil de la agencia</div>
        {[
          { label: "Nombre", value: org?.name },
          { label: "Especialidades", value: org?.specialties?.join(", ") },
          { label: "Descripción", value: org?.description },
          { label: "Web", value: org?.website },
          { label: "Contacto", value: org?.contact_email },
        ].filter(r => r.value).map(r => (
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
