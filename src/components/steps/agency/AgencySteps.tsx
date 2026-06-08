"use client";

import { useState, useEffect } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, SaveButton, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";
import { fetchChallenges } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";

/* ─── Step 1: Scout startups ─── */
export function AgencyStep1Scout() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const STEP_ID = "agency-scout"; const XP = 200;
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);
  const [saved, setSaved] = useState(done);

  async function handle() {
    if (!org?.id || !dbUser?.id) return;
    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    await reload();
    setSaved(true);
    setTimeout(() => go("scout"), 800);
  }

  return (
    <StepShell title="Scout de startups" subtitle="Agency Quest · Paso 1" stepNumber={1} totalSteps={4} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-5 m-0">
        Busca soluciones de IA relevantes para tus clientes. Filtra por vertical, guarda favoritas
        y genera un shortlist que puedas presentar como agencia.
      </p>
      <div className="grid gap-[8px] mb-5">
        {[
          { icon: "🔍", title: "Filtro por vertical", desc: "Content AI, CX, Data, Loyalty, Automation" },
          { icon: "⭐", title: "Shortlist privada", desc: "Guarda startups para clientes o pitch interno" },
          { icon: "📊", title: "Match score", desc: "Ordenadas por encaje con tu necesidad de cliente" },
        ].map(f => (
          <div key={f.title} className="flex gap-3 items-center rounded-[14px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.04)] px-4 py-3">
            <span className="text-[20px]">{f.icon}</span>
            <div><div className="font-black text-[13px] text-white">{f.title}</div>
              <div className="text-[11px] text-[#737D9D]">{f.desc}</div></div>
          </div>
        ))}
      </div>
      {!done ? (
        <button onClick={handle}
          className="w-full rounded-[16px] py-3 font-black text-[14px] border-0 cursor-pointer"
          style={{ background: "#FFD400", color: "#10131F", boxShadow: "0 10px 25px rgba(255,212,0,.2)" }}>
          Abrir Agency Scout · +{XP} XP
        </button>
      ) : (
        <div className="w-full rounded-[16px] py-3 font-black text-[14px] text-center" style={{ background: "rgba(77,255,157,.15)", color: "#4DFF9D" }}>✓ Scout completado</div>
      )}
    </StepShell>
  );
}

/* ─── Step 2: Recommend a startup ─── */
export function AgencyStep2Recommend() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const STEP_ID = "agency-recommend"; const XP = 250;
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);
  const [startup, setStartup] = useState("");
  const [fit, setFit] = useState("Content AI");
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("recommendations").insert([{
      recommender_id: dbUser.id,
      justification: justification.trim(),
      fit,
      xp_awarded: XP,
    }]);
    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    dispatch({ type: "ADD_BADGE", badge: "Recomendador" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("agency-quest"), 1000);
  }

  return (
    <StepShell title="Recomienda una startup" subtitle="Agency Quest · Paso 2" stepNumber={2} totalSteps={4} xp={XP} done={done}>
      <form onSubmit={handleSave} className="grid gap-1">
        <label className={labelCls}>Nombre de la startup recomendada *</label>
        <input required value={startup} onChange={e => setStartup(e.target.value)}
          placeholder="Ej: CXFlow AI, UGC Forge…" className={inputCls} />
        <label className={labelCls}>Encaje con vertical</label>
        <select value={fit} onChange={e => setFit(e.target.value)} className={inputCls}>
          {["Content AI","Customer Experience","Data & Insights","Loyalty & Gamification","Automation","Retail Media"].map(v => <option key={v}>{v}</option>)}
        </select>
        <label className={labelCls}>¿Por qué la recomiendas? *</label>
        <textarea required value={justification} onChange={e => setJustification(e.target.value)} rows={4}
          placeholder="Describe el potencial de piloto, el cliente al que encaja y por qué crees que es la mejor opción."
          className={`${inputCls} resize-y`} />
        <SaveButton loading={loading} saved={saved} xp={XP} label="Enviar recomendación" />
      </form>
    </StepShell>
  );
}

/* ─── Step 3: Create a brief ─── */
export function AgencyStep3Brief() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const STEP_ID = "agency-brief"; const XP = 300;
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vertical, setVertical] = useState("Content AI");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("challenges").insert([{
      type: "agency",
      title: title.trim(),
      description: description.trim(),
      vertical,
      xp_reward: 400,
      created_by: dbUser.id,
    }]);
    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    dispatch({ type: "ADD_BADGE", badge: "Creador de Briefs" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("agency-quest"), 1000);
  }

  return (
    <StepShell title="Crea un brief para cliente" subtitle="Agency Quest · Paso 3" stepNumber={3} totalSteps={4} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Convierte una necesidad real de cliente en un challenge público. Las startups responderán con propuestas.
      </p>
      <form onSubmit={handleSave} className="grid gap-1">
        <label className={labelCls}>Título del brief *</label>
        <input required value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Ej: IA para personalizar contenido de producto en retail" className={inputCls} />
        <label className={labelCls}>Descripción de la necesidad *</label>
        <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4}
          placeholder="Contexto del cliente, objetivo, restricciones principales y tipo de solución buscada."
          className={`${inputCls} resize-y`} />
        <label className={labelCls}>Vertical</label>
        <select value={vertical} onChange={e => setVertical(e.target.value)} className={inputCls}>
          {["Content AI","Customer Experience","Data & Insights","Loyalty & Gamification","Automation","Retail Media"].map(v => <option key={v}>{v}</option>)}
        </select>
        <SaveButton loading={loading} saved={saved} xp={XP} label="Publicar brief" />
      </form>
    </StepShell>
  );
}

/* ─── Step 4: Request meeting ─── */
export function AgencyStep4Meeting() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const STEP_ID = "agency-meeting"; const XP = 500;
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
    dispatch({ type: "ADD_BADGE", badge: "Conector Top" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("agency-quest"), 1000);
  }

  return (
    <StepShell title="Solicita una reunión" subtitle="Agency Quest · Paso 4" stepNumber={4} totalSteps={4} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Conecta una startup con tu cliente. Una reunión calificada es el paso final que genera oportunidades reales de negocio.
      </p>
      <form onSubmit={handleSave} className="grid gap-1">
        <label className={labelCls}>Objetivo de la reunión</label>
        <select value={objective} onChange={e => setObjective(e.target.value)} className={inputCls}>
          {["Explorar piloto","Demo producto","Presentar a cliente","Evaluar propuesta"].map(o => <option key={o}>{o}</option>)}
        </select>
        <label className={labelCls}>Contexto y mensaje *</label>
        <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4}
          placeholder="Describe a qué startup y cliente quieres conectar, y qué resultado esperas de la reunión."
          className={`${inputCls} resize-y`} />
        <SaveButton loading={loading} saved={saved} xp={XP} label="Solicitar reunión" />
      </form>
    </StepShell>
  );
}
