"use client";

import { useState } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, SaveButton, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";
import { createClient } from "@/lib/supabase/client";

/* ─── Step 1: Publish a challenge ─── */
export function BrandStep1Challenge() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const STEP_ID = "brand-challenge"; const XP = 350;
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vertical, setVertical] = useState("Customer Experience");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("challenges").insert([{
      type: "brand",
      title: title.trim(),
      description: description.trim(),
      vertical,
      xp_reward: 500,
      created_by: dbUser.id,
    }]);
    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    dispatch({ type: "ADD_BADGE", badge: "Dueño del Reto" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("brand-quest"), 1000);
  }

  return (
    <StepShell title="Publica un Brand Challenge" subtitle="Brand Quest · Paso 1" stepNumber={1} totalSteps={3} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Un reto concreto atrae mejores propuestas. Define el problema real que quieres resolver con IA.
      </p>
      <form onSubmit={handleSave} className="grid gap-1">
        <label className={labelCls}>Título del reto *</label>
        <input required value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Ej: Reducir fricción en atención al cliente con IA" className={inputCls} />
        <label className={labelCls}>Descripción del reto *</label>
        <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4}
          placeholder="Contexto, objetivo de negocio, KPIs esperados y tipo de solución buscada."
          className={`${inputCls} resize-y`} />
        <label className={labelCls}>Vertical de IA</label>
        <select value={vertical} onChange={e => setVertical(e.target.value)} className={inputCls}>
          {["Customer Experience","Content AI","Data & Insights","Loyalty & Gamification","Automation","Retail Media"].map(v => <option key={v}>{v}</option>)}
        </select>
        <div className="rounded-[14px] border border-[rgba(68,215,255,.2)] bg-[rgba(68,215,255,.06)] px-4 py-3 mt-2">
          <div className="text-[11px] text-[#44D7FF]">
            💡 Tu reto será publicado y visible para todas las startups del ecosistema AI4Brands.
            Recibirás propuestas de pilotos 30/60/90.
          </div>
        </div>
        <SaveButton loading={loading} saved={saved} xp={XP} label="Publicar Brand Challenge" />
      </form>
    </StepShell>
  );
}

/* ─── Step 2: Vote proposals ─── */
export function BrandStep2Vote() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const STEP_ID = "brand-vote"; const XP = 150;
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);
  const [category, setCategory] = useState("Mejor Caso de Uso de IA en Marketing");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  const CATEGORIES = [
    "🏆 Mejor Caso de Uso de IA en Marketing",
    "🎨 Creatividad + IA",
    "📊 Mejor Estrategia Data-Driven con IA",
    "⚡ Premio Prompt-a-thon",
    "🚀 Mejor Startup AI4Brands",
  ];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("votes").upsert([{
      voter_id: dbUser.id,
      category,
      reason: reason.trim(),
    }], { onConflict: "voter_id,category" });
    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("brand-quest"), 1000);
  }

  return (
    <StepShell title="Vota propuestas" subtitle="Brand Quest · Paso 2" stepNumber={2} totalSteps={3} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Tu voto como marca tiene peso especial en la selección de finalistas de los AI4Brands Awards.
      </p>
      <form onSubmit={handleSave} className="grid gap-1">
        <label className={labelCls}>Categoría a votar</label>
        <div className="grid gap-[6px] mb-2">
          {CATEGORIES.map(c => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className="rounded-[14px] border px-4 py-2.5 text-left text-[12px] font-semibold transition-all cursor-pointer"
              style={{
                background: category === c ? "rgba(255,212,0,.12)" : "rgba(255,255,255,.04)",
                border: category === c ? "1px solid rgba(255,212,0,.4)" : "1px solid rgba(255,255,255,.07)",
                color: category === c ? "#FFD400" : "#A9B1CB",
              }}>
              {c}
            </button>
          ))}
        </div>
        <label className={labelCls}>Justificación del voto *</label>
        <textarea required value={reason} onChange={e => setReason(e.target.value)} rows={3}
          placeholder="¿Por qué esta categoría es importante para tu sector? ¿Qué impacto esperas?"
          className={`${inputCls} resize-y`} />
        <SaveButton loading={loading} saved={saved} xp={XP} label="Emitir voto" />
      </form>
    </StepShell>
  );
}

/* ─── Step 3: Request meeting ─── */
export function BrandStep3Meeting() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const STEP_ID = "brand-meeting"; const XP = 400;
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);
  const [objective, setObjective] = useState("Explorar piloto");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("meetings").insert([{
      requester_id: dbUser.id,
      objective,
      message: message.trim(),
    }]);
    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    dispatch({ type: "ADD_BADGE", badge: "Comprador de Innovación" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("brand-quest"), 1000);
  }

  return (
    <StepShell title="Solicita reunión con startup" subtitle="Brand Quest · Paso 3" stepNumber={3} totalSteps={3} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Conecta directamente con una startup que ha respondido tu challenge. Convierte el evento en pipeline real de pilotos.
      </p>
      <form onSubmit={handleSave} className="grid gap-1">
        <label className={labelCls}>Tipo de reunión</label>
        <select value={objective} onChange={e => setObjective(e.target.value)} className={inputCls}>
          {["Explorar piloto","Demo de producto","Evaluar propuesta 30/60/90","Definir alcance piloto"].map(o => <option key={o}>{o}</option>)}
        </select>
        <label className={labelCls}>Describe qué buscas *</label>
        <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4}
          placeholder="Startup de interés, caso de uso concreto y qué necesitas ver en la reunión."
          className={`${inputCls} resize-y`} />
        <SaveButton loading={loading} saved={saved} xp={XP} label="Solicitar reunión de piloto" />
      </form>
    </StepShell>
  );
}
