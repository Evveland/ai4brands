"use client";

import { useState } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, SaveButton, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";

const STEP_ID = "startup-profile";
const XP = 220;
const VERTICALS = ["Content AI","Customer Experience","Data & Insights","Loyalty & Gamification","Retail Media","Automation","Creatividad + IA"];

export function Step1BasicProfile() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);

  const [name, setName] = useState(org?.name ?? "");
  const [vertical, setVertical] = useState(org?.vertical ?? "Content AI");
  const [pitch, setPitch] = useState(org?.one_liner ?? "");
  const [idealClient, setIdealClient] = useState(org?.ideal_client ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id) return;
    setLoading(true);
    await completeStep(org.id, dbUser.id, STEP_ID, XP, {
      name: name.trim(),
      vertical,
      one_liner: pitch.trim(),
      ideal_client: idealClient.trim(),
    });
    dispatch({ type: "ADD_XP", amount: XP });
    dispatch({ type: "ADD_BADGE", badge: "Perfil Iniciado" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("startup-quest"), 1000);
  }

  return (
    <StepShell title="Ficha básica" subtitle="Startup Quest · Paso 1" stepNumber={1} totalSteps={5} xp={XP} done={done}>
      <form onSubmit={handleSave} className="grid gap-1">
        <label className={labelCls}>Nombre de la startup *</label>
        <input required value={name} onChange={e => setName(e.target.value)}
          placeholder="Ej: CXFlow AI" className={inputCls} />

        <label className={labelCls}>Vertical principal</label>
        <select value={vertical} onChange={e => setVertical(e.target.value)} className={inputCls}>
          {VERTICALS.map(v => <option key={v}>{v}</option>)}
        </select>

        <label className={labelCls}>Pitch en una frase *</label>
        <textarea required value={pitch} onChange={e => setPitch(e.target.value)}
          rows={3} placeholder="Ayudamos a marcas a… con IA…" className={`${inputCls} resize-y`} />

        <label className={labelCls}>Cliente ideal</label>
        <input value={idealClient} onChange={e => setIdealClient(e.target.value)}
          placeholder="Ej: retail, banca, gran consumo" className={inputCls} />

        <SaveButton loading={loading} saved={saved} xp={XP} />
      </form>
    </StepShell>
  );
}
