"use client";

import { useState } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, SaveButton, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";

const STEP_ID = "startup-pilot";
const XP = 300;

export function Step3Pilot() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);

  const [p30, setP30] = useState(org?.pilot_30 ?? "");
  const [p60, setP60] = useState(org?.pilot_60 ?? "");
  const [p90, setP90] = useState(org?.pilot_90 ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id) return;
    setLoading(true);
    await completeStep(org.id, dbUser.id, STEP_ID, XP, {
      pilot_30: p30.trim(),
      pilot_60: p60.trim(),
      pilot_90: p90.trim(),
    });
    dispatch({ type: "ADD_XP", amount: XP });
    dispatch({ type: "ADD_BADGE", badge: "Constructor de Retos" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("startup-quest"), 1000);
  }

  return (
    <StepShell title="Propuesta 30/60/90" subtitle="Startup Quest · Paso 3" stepNumber={3} totalSteps={5} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Define tu piloto concreto para una gran marca. Agencias y marcas usarán esto
        para evaluar si tu solución es viable para sus proyectos.
      </p>

      <form onSubmit={handleSave} className="grid gap-1">
        <div className="rounded-[16px] border p-4 mb-2"
          style={{ background: "rgba(255,212,0,.07)", border: "1px solid rgba(255,212,0,.2)" }}>
          <div className="font-black text-[12px] text-[#FFD400] mb-1">📅 Día 30 — Prueba de valor</div>
          <p className="text-[11px] text-[#737D9D] m-0 mb-2">
            ¿Qué puedes entregar en el primer mes? Define el entregable concreto y medible.
          </p>
          <textarea required value={p30} onChange={e => setP30(e.target.value)} rows={3}
            placeholder="Ej: Implementar AI agent en un flujo de soporte seleccionado. KPI: tiempo de respuesta y CSAT."
            className={`${inputCls} resize-y`} />
        </div>

        <div className="rounded-[16px] border p-4 mb-2"
          style={{ background: "rgba(68,215,255,.06)", border: "1px solid rgba(68,215,255,.2)" }}>
          <div className="font-black text-[12px] text-[#44D7FF] mb-1">📅 Día 60 — Integración</div>
          <p className="text-[11px] text-[#737D9D] m-0 mb-2">
            ¿Cómo escalas y conectas con los sistemas del cliente?
          </p>
          <textarea required value={p60} onChange={e => setP60(e.target.value)} rows={3}
            placeholder="Ej: Conectar CRM, analítica y reporting. Expandir a 3 flujos adicionales."
            className={`${inputCls} resize-y`} />
        </div>

        <div className="rounded-[16px] border p-4 mb-2"
          style={{ background: "rgba(77,255,157,.06)", border: "1px solid rgba(77,255,157,.2)" }}>
          <div className="font-black text-[12px] text-[#4DFF9D] mb-1">📅 Día 90 — Escalado</div>
          <p className="text-[11px] text-[#737D9D] m-0 mb-2">
            ¿Cuál es el estado final del piloto y cómo se mide el éxito?
          </p>
          <textarea required value={p90} onChange={e => setP90(e.target.value)} rows={3}
            placeholder="Ej: Piloto completo con ROI medido. Propuesta de expansión a toda la organización."
            className={`${inputCls} resize-y`} />
        </div>

        <SaveButton loading={loading} saved={saved} xp={XP} label="Enviar propuesta 30/60/90" />
      </form>
    </StepShell>
  );
}
