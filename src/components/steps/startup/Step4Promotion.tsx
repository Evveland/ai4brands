"use client";

import { useState } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, SaveButton, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";
import { createClient } from "@/lib/supabase/client";

const STEP_ID = "startup-promotion";
const XP = 400;

const ACTIONS = [
  { id: "linkedin",  icon: "💼", label: "Post de LinkedIn", desc: "Publica sobre tu startup y AI4Brands", xp: 100 },
  { id: "startup",   icon: "🚀", label: "Invita una startup", desc: "Comparte el código de tu organización", xp: 150 },
  { id: "agency",    icon: "🔎", label: "Invita una agencia", desc: "Conecta un scout de innovación", xp: 200 },
  { id: "brand",     icon: "🎯", label: "Invita una marca", desc: "Propón un reto de innovación real", xp: 300 },
];

export function Step4Promotion() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, dbUser, reload } = useOrgQuest();
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);

  const [actionType, setActionType] = useState("linkedin");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [entries, setEntries] = useState<{ type: string; link: string }[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link.trim()) return;
    setEntries(prev => [...prev, { type: actionType, link }]);
    setLink("");
    setSubmitting(false);
    setSubmitted(true);
  }

  async function handleComplete() {
    if (!org?.id || !dbUser?.id || entries.length === 0) return;
    setSubmitting(true);

    // Save promotion links to invitations table
    const supabase = createClient();
    for (const e of entries) {
      await supabase.from("invitations").insert([{
        inviter_id: dbUser.id,
        ecosystem_tag: e.type,
        uses: 0,
      }]);
    }

    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    await reload();
    setSubmitting(false);
    setTimeout(() => go("startup-quest"), 1000);
  }

  return (
    <StepShell title="Promoción" subtitle="Startup Quest · Paso 4" stepNumber={4} totalSteps={5} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Cada acción trae un actor útil al ecosistema. Valida al menos una acción para ganar los XP.
      </p>

      {/* Action cards */}
      <div className="grid gap-[8px] mb-4">
        {ACTIONS.map(a => (
          <button key={a.id} type="button" onClick={() => setActionType(a.id)}
            className="rounded-[16px] border px-4 py-3 text-left flex items-center gap-3 transition-all cursor-pointer"
            style={{
              background: actionType === a.id ? "rgba(255,212,0,.12)" : "rgba(255,255,255,.05)",
              border: actionType === a.id ? "1px solid rgba(255,212,0,.4)" : "1px solid rgba(255,255,255,.08)",
            }}>
            <span className="text-[20px]">{a.icon}</span>
            <div className="flex-1">
              <div className="font-black text-[13px] text-white">{a.label}</div>
              <div className="text-[11px] text-[#737D9D]">{a.desc}</div>
            </div>
            <span className="font-black text-[12px]" style={{ color: "#FFD400" }}>+{a.xp} XP</span>
          </button>
        ))}
      </div>

      {/* Link validator */}
      <form onSubmit={handleSubmit}>
        <label className={labelCls}>Pega el enlace de la acción</label>
        <input value={link} onChange={e => setLink(e.target.value)}
          placeholder="https://linkedin.com/posts/… o t.me/…" className={inputCls} />
        <button type="submit"
          className="w-full mt-2 rounded-[14px] py-2.5 font-black text-[13px] border-0 cursor-pointer"
          style={{ background: "rgba(255,255,255,.08)", color: "#A9B1CB" }}>
          + Añadir acción
        </button>
      </form>

      {/* Logged entries */}
      {entries.length > 0 && (
        <div className="mt-4 grid gap-2">
          <div className="text-[11px] font-black text-[#737D9D] uppercase tracking-wider">Acciones registradas</div>
          {entries.map((e, i) => (
            <div key={i} className="flex items-center gap-2 rounded-[12px] border border-[rgba(77,255,157,.2)] bg-[rgba(77,255,157,.06)] px-3 py-2">
              <span className="text-[14px]">{ACTIONS.find(a => a.id === e.type)?.icon}</span>
              <div className="flex-1 text-[11px] text-[#4DFF9D] truncate">{e.link || e.type}</div>
              <span className="text-[10px] font-black text-[#4DFF9D]">✓</span>
            </div>
          ))}
          <button onClick={handleComplete} disabled={submitting}
            className="w-full mt-2 rounded-[14px] py-3 font-black text-[14px] border-0 cursor-pointer"
            style={{ background: "#FFD400", color: "#10131F", boxShadow: "0 10px 25px rgba(255,212,0,.2)" }}>
            {submitting ? "Guardando…" : `Completar paso · +${XP} XP`}
          </button>
        </div>
      )}
    </StepShell>
  );
}
