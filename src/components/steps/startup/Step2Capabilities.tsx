"use client";

import { useState } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, SaveButton, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";

const STEP_ID = "startup-capabilities";
const XP = 120;

const ALL_CAPS = [
  "AI Agents","Content Automation","Personalization","Data & Analytics",
  "Computer Vision","NLP / LLM","Predictive Models","Recommendation Engines",
  "Workflow Automation","Voice AI","Generative AI","RAG / Knowledge Bases",
];

export function Step2Capabilities() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);

  const [selected, setSelected] = useState<string[]>(org?.capabilities ?? []);
  const [stack, setStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  function toggle(cap: string) {
    setSelected(prev =>
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id || selected.length === 0) return;
    setLoading(true);
    await completeStep(org.id, dbUser.id, STEP_ID, XP, {
      capabilities: selected,
      tech_stack: stack.trim() || null,
    });
    dispatch({ type: "ADD_XP", amount: XP });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("startup-quest"), 1000);
  }

  return (
    <StepShell title="Mapa de capacidades IA" subtitle="Startup Quest · Paso 2" stepNumber={2} totalSteps={5} xp={XP} done={done}>
      <form onSubmit={handleSave}>
        <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
          Selecciona las tecnologías y capacidades en las que tu startup es fuerte.
          Ayuda a agencias y marcas a encontrarte rápidamente.
        </p>

        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
          {ALL_CAPS.map(cap => {
            const active = selected.includes(cap);
            return (
              <button key={cap} type="button" onClick={() => toggle(cap)}
                className="rounded-[14px] border px-3 py-2.5 text-[12px] font-bold text-left transition-all cursor-pointer"
                style={{
                  background: active ? "rgba(255,212,0,.15)" : "rgba(255,255,255,.05)",
                  border: active ? "1px solid rgba(255,212,0,.5)" : "1px solid rgba(255,255,255,.09)",
                  color: active ? "#FFD400" : "#A9B1CB",
                }}>
                {active ? "✓ " : ""}{cap}
              </button>
            );
          })}
        </div>

        <label className={labelCls}>Stack tecnológico e integraciones (opcional)</label>
        <input value={stack} onChange={e => setStack(e.target.value)}
          placeholder="Ej: OpenAI, HubSpot, Salesforce, Shopify…" className={inputCls} />

        {selected.length === 0 && (
          <p className="text-[11px] text-[#FF5C7A] mt-2 mb-0">Selecciona al menos una capacidad.</p>
        )}

        <SaveButton loading={loading} saved={saved} xp={XP} label="Guardar capacidades" />
      </form>
    </StepShell>
  );
}
