"use client";

import { useState } from "react";
import { useNav, useDispatch } from "@/lib/store";
import { StepShell, inputCls, labelCls } from "@/components/steps/StepShell";
import { useOrgQuest } from "@/components/quest/OrgQuestShell";
import { completeStep, isStepDone } from "@/lib/db/steps";
import { createClient } from "@/lib/supabase/client";
import { useDBUser } from "@/components/UserProvider";

const STEP_ID = "startup-promotion";
const XP = 400;
const APP_URL = "https://t.me/ai4brands_bot/open";

type ActionId = "linkedin" | "startup" | "agency" | "brand";

const ACTIONS: { id: ActionId; icon: string; label: string; desc: string; xp: number }[] = [
  { id: "linkedin", icon: "💼", label: "Post de LinkedIn",  desc: "Publica sobre tu startup y AI4Brands", xp: 100 },
  { id: "startup",  icon: "🚀", label: "Invita una startup", desc: "Genera un link para que se registren", xp: 150 },
  { id: "agency",   icon: "🔎", label: "Invita una agencia", desc: "Genera un link de scout de innovación", xp: 200 },
  { id: "brand",    icon: "🎯", label: "Invita una marca",   desc: "Genera un link para lanzar retos", xp: 300 },
];

function generateInviteLink(userId: string, role: ActionId) {
  return `${APP_URL}?startapp=ref_${userId}_${role}`;
}

function LinkedInEntry({ userId, orgId, onAdded }: { userId: string; orgId: string; onAdded: (e: Entry) => void }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function handle() {
    if (!url.trim()) return;
    if (!url.includes("linkedin.com")) {
      setError("Introduce un enlace de LinkedIn válido.");
      return;
    }
    setError("");
    const supabase = createClient();
    await supabase.from("invitations").insert([{
      inviter_id: userId,
      ecosystem_tag: "linkedin",
      uses: 0,
    }]);
    onAdded({ type: "linkedin", value: url.trim() });
    setUrl("");
  }

  return (
    <div>
      <label className={labelCls}>Pega el enlace de tu post de LinkedIn</label>
      <input value={url} onChange={e => { setUrl(e.target.value); setError(""); }}
        placeholder="https://www.linkedin.com/posts/…" className={inputCls} />
      {error && <p className="text-[11px] text-[#FF5C7A] mt-1 mb-0">{error}</p>}
      <button type="button" onClick={handle}
        className="w-full mt-2 rounded-[14px] py-2.5 font-black text-[13px] border-0 cursor-pointer"
        style={{ background: "rgba(255,255,255,.08)", color: "#A9B1CB" }}>
        + Validar post de LinkedIn
      </button>
    </div>
  );
}

function InviteEntry({ userId, role, onAdded }: { userId: string; role: "startup" | "agency" | "brand"; onAdded: (e: Entry) => void }) {
  const link = generateInviteLink(userId, role);
  const [copied, setCopied] = useState(false);

  const roleLabel: Record<string, string> = {
    startup: "una startup",
    agency: "una agencia",
    brand: "una marca",
  };

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    const supabase = createClient();
    await supabase.from("invitations").insert([{
      inviter_id: userId,
      ecosystem_tag: role,
      uses: 0,
    }]);
    onAdded({ type: role, value: link });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <label className={labelCls}>Tu link de invitación para {roleLabel[role]}</label>
      <div className="flex gap-2 items-center rounded-[14px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5">
        <span className="flex-1 text-[11px] font-mono text-[#44D7FF] truncate">{link}</span>
        <button type="button" onClick={handleCopy}
          className="flex-none rounded-[10px] px-3 py-1 text-[11px] font-black border-0 cursor-pointer transition-colors"
          style={{ background: copied ? "rgba(77,255,157,.2)" : "rgba(68,215,255,.2)", color: copied ? "#4DFF9D" : "#44D7FF" }}>
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
      <p className="text-[11px] text-[#737D9D] mt-1.5 mb-0">
        Comparte este link. Cuando la persona abra AI4Brands y se registre, tú ganarás los XP.
      </p>
    </div>
  );
}

interface Entry { type: ActionId; value: string; }

export function Step4Promotion() {
  const { go } = useNav();
  const dispatch = useDispatch();
  const { org, reload } = useOrgQuest();
  const dbUser = useDBUser();
  const done = isStepDone(org?.completed_steps ?? [], STEP_ID);

  const [activeAction, setActiveAction] = useState<ActionId>("linkedin");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(done);

  function addEntry(e: Entry) {
    if (!entries.find(ex => ex.type === e.type)) {
      setEntries(prev => [...prev, e]);
    }
  }

  async function handleComplete() {
    if (!org?.id || !dbUser?.id || entries.length === 0) return;
    setCompleting(true);
    await completeStep(org.id, dbUser.id, STEP_ID, XP);
    dispatch({ type: "ADD_XP", amount: XP });
    await reload();
    setCompleting(false);
    setCompleted(true);
    setTimeout(() => go("startup-quest"), 1000);
  }

  return (
    <StepShell title="Promoción" subtitle="Startup Quest · Paso 4" stepNumber={4} totalSteps={5} xp={XP} done={done}>
      <p className="text-[13px] text-[#A9B1CB] mb-4 m-0">
        Cada acción trae un actor útil al ecosistema. Completa al menos una para ganar los XP.
      </p>

      {/* Action selector */}
      <div className="grid gap-[8px] mb-5">
        {ACTIONS.map(a => (
          <button key={a.id} type="button" onClick={() => setActiveAction(a.id)}
            className="rounded-[16px] border px-4 py-3 text-left flex items-center gap-3 transition-all cursor-pointer"
            style={{
              background: activeAction === a.id ? "rgba(255,212,0,.12)" : "rgba(255,255,255,.05)",
              border: activeAction === a.id ? "1px solid rgba(255,212,0,.4)" : "1px solid rgba(255,255,255,.08)",
            }}>
            <span className="text-[20px] flex-none">{a.icon}</span>
            <div className="flex-1">
              <div className="font-black text-[13px] text-white">{a.label}</div>
              <div className="text-[11px] text-[#737D9D]">{a.desc}</div>
            </div>
            <div className="flex items-center gap-2 flex-none">
              {entries.find(e => e.type === a.id) && (
                <span className="text-[12px] text-[#4DFF9D]">✓</span>
              )}
              <span className="font-black text-[12px]" style={{ color: "#FFD400" }}>+{a.xp} XP</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active action panel */}
      <div className="rounded-[18px] border p-4 mb-4"
        style={{ background: "rgba(23,29,52,.9)", border: "1px solid rgba(255,255,255,.1)" }}>
        {activeAction === "linkedin" && dbUser?.id && (
          <LinkedInEntry userId={dbUser.id} orgId={org?.id ?? ""} onAdded={addEntry} />
        )}
        {(activeAction === "startup" || activeAction === "agency" || activeAction === "brand") && dbUser?.id && (
          <InviteEntry userId={dbUser.id} role={activeAction} onAdded={addEntry} />
        )}
      </div>

      {/* Completed entries */}
      {entries.length > 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-black text-[#737D9D] uppercase tracking-wider mb-2">
            Acciones completadas ({entries.length})
          </div>
          <div className="grid gap-2">
            {entries.map((e, i) => {
              const action = ACTIONS.find(a => a.id === e.type);
              return (
                <div key={i} className="flex items-center gap-2 rounded-[12px] border border-[rgba(77,255,157,.2)] bg-[rgba(77,255,157,.06)] px-3 py-2">
                  <span className="text-[16px]">{action?.icon}</span>
                  <span className="flex-1 text-[11px] text-[#4DFF9D] font-semibold">{action?.label}</span>
                  <span className="text-[10px] font-black text-[#4DFF9D]">+{action?.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete step button */}
      <button
        onClick={handleComplete}
        disabled={entries.length === 0 || completing || completed}
        className="w-full rounded-[16px] py-3 font-black text-[14px] border-0 cursor-pointer transition-all"
        style={{
          background: completed ? "rgba(77,255,157,.2)" : entries.length === 0 ? "rgba(255,255,255,.08)" : "#FFD400",
          color: completed ? "#4DFF9D" : entries.length === 0 ? "#737D9D" : "#10131F",
          cursor: entries.length === 0 ? "default" : "pointer",
          boxShadow: entries.length > 0 && !completed ? "0 10px 25px rgba(255,212,0,.2)" : "none",
        }}>
        {completed
          ? `✓ Completado · +${XP} XP`
          : completing
          ? "Guardando…"
          : entries.length === 0
          ? "Completa al menos una acción primero"
          : `Completar paso · +${XP} XP`}
      </button>
    </StepShell>
  );
}
