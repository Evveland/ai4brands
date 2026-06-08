"use client";

import { useState, useEffect } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, SaveButton, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";
import { fetchChallenges } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";

const STEP_ID = "startup-challenge";
const XP = 500;

export function Step5Challenge() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);

  const [challenges, setChallenges] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [proposal, setProposal] = useState("");
  const [kpi, setKpi] = useState("Conversión");
  const [demo, setDemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(done);

  useEffect(() => {
    fetchChallenges().then(data => {
      const relevant = (data as any[]).filter(c => ["brand","sponsor"].includes(c.type));
      setChallenges(relevant);
      if (relevant.length > 0) setSelected(relevant[0].id);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!org?.id || !dbUser?.id || !selected) return;
    setLoading(true);

    const supabase = createClient();

    // Find or create the startup record to link response
    let startupId: string | null = null;
    const { data: startupRow } = await supabase
      .from("startups")
      .select("id")
      .eq("user_id", dbUser.id)
      .maybeSingle();

    if (startupRow) {
      startupId = startupRow.id;
    } else {
      const { data: newStartup } = await supabase
        .from("startups")
        .insert([{ user_id: dbUser.id, name: org.name ?? "Mi startup", vertical: org.vertical }])
        .select("id")
        .single();
      startupId = newStartup?.id ?? null;
    }

    if (startupId) {
      await supabase.from("challenge_responses").insert([{
        challenge_id: selected,
        startup_id: startupId,
        proposal: proposal.trim(),
        kpi,
        demo_link: demo.trim() || null,
      }]);
    }

    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    dispatch({ type: "ADD_BADGE", badge: "Constructor de Retos" });
    await reload();
    setLoading(false);
    setSaved(true);
    setTimeout(() => go("startup-quest"), 1000);
  }

  const selectedChallenge = challenges.find(c => c.id === selected);

  return (
    <StepShell title="Responde un Brand Challenge" subtitle="Startup Quest · Paso 5" stepNumber={5} totalSteps={5} xp={XP} done={done}>
      <form onSubmit={handleSave} className="grid gap-1">

        {/* Challenge selector */}
        <label className={labelCls}>Elige el reto que vas a responder</label>
        <div className="grid gap-[8px] mb-3">
          {challenges.map(c => (
            <button key={c.id} type="button" onClick={() => setSelected(c.id)}
              className="rounded-[16px] border px-4 py-3 text-left transition-all cursor-pointer"
              style={{
                background: selected === c.id ? "rgba(255,212,0,.12)" : "rgba(255,255,255,.05)",
                border: selected === c.id ? "1px solid rgba(255,212,0,.4)" : "1px solid rgba(255,255,255,.08)",
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: c.type === "sponsor" ? "rgba(255,212,0,.16)" : "rgba(68,215,255,.14)", color: c.type === "sponsor" ? "#FFD400" : "#44D7FF" }}>
                  {c.type}
                </span>
                <span className="font-black text-[12px] text-[#FFD400]">+{c.xp_reward} XP</span>
              </div>
              <div className="font-semibold text-[13px] text-white">{c.title}</div>
              {c.vertical && <div className="text-[11px] text-[#737D9D] mt-0.5">{c.vertical}</div>}
            </button>
          ))}
        </div>

        {selectedChallenge && (
          <div className="rounded-[14px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.04)] px-4 py-3 mb-2">
            <p className="text-[12px] text-[#A9B1CB] m-0">{selectedChallenge.description}</p>
          </div>
        )}

        <label className={labelCls}>Tu propuesta *</label>
        <textarea required value={proposal} onChange={e => setProposal(e.target.value)}
          rows={4} placeholder="Describe cómo tu solución responde a este reto. Incluye el problema que resuelves, tu enfoque y los resultados esperados."
          className={`${inputCls} resize-y`} />

        <label className={labelCls}>KPI principal</label>
        <select value={kpi} onChange={e => setKpi(e.target.value)} className={inputCls}>
          {["Conversión","Retención","Reducción de costes","NPS / Satisfacción","Tiempo de respuesta","Engagement","Ingresos generados"].map(k => (
            <option key={k}>{k}</option>
          ))}
        </select>

        <label className={labelCls}>Link demo o evidencia (opcional)</label>
        <input type="url" value={demo} onChange={e => setDemo(e.target.value)}
          placeholder="https://demo.miastartup.com o vídeo de Loom" className={inputCls} />

        <SaveButton loading={loading} saved={saved} xp={XP} label="Enviar propuesta al reto" />
      </form>
    </StepShell>
  );
}
