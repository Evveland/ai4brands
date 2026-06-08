"use client";

import { BackBar } from "@/components/BackBar";
import { useDispatch } from "@/lib/store";

interface StepShellProps {
  title: string;
  subtitle: string;
  stepNumber: number;
  totalSteps: number;
  xp: number;
  done: boolean;
  children: React.ReactNode;
}

export function StepShell({ title, subtitle, stepNumber, totalSteps, xp, done, children }: StepShellProps) {
  return (
    <div>
      <BackBar title={title} subtitle={subtitle} />

      {/* Step header */}
      <div className="rounded-[20px] border p-4 mb-4 flex items-center gap-3"
        style={{
          background: done ? "rgba(77,255,157,.08)" : "rgba(255,212,0,.08)",
          border: `1px solid ${done ? "rgba(77,255,157,.25)" : "rgba(255,212,0,.25)"}`,
        }}>
        <div className="w-[40px] h-[40px] rounded-full grid place-items-center font-black text-[16px] flex-none"
          style={{ background: done ? "#4DFF9D" : "#FFD400", color: "#0A1A0F" }}>
          {done ? "✓" : stepNumber}
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-black" style={{ color: done ? "#4DFF9D" : "#FFD400" }}>
            {done ? "Paso completado" : `Paso ${stepNumber} de ${totalSteps}`}
          </div>
          <div className="text-[11px] text-[#A9B1CB] mt-0.5">
            {done ? "Ya has ganado los XP de este paso." : `Complétalo para ganar +${xp} XP`}
          </div>
        </div>
        <div className="font-black text-[16px] flex-none" style={{ color: done ? "#4DFF9D" : "#FFD400" }}>
          +{xp} XP
        </div>
      </div>

      {children}
    </div>
  );
}

/* ─── Save/confirm button with XP flash ─── */
interface SaveButtonProps {
  loading: boolean;
  saved: boolean;
  xp: number;
  label?: string;
}

export function SaveButton({ loading, saved, xp, label = "Guardar y ganar XP" }: SaveButtonProps) {
  return (
    <button type="submit" disabled={loading || saved}
      className="w-full mt-3 rounded-[16px] py-3 font-black text-[14px] border-0 cursor-pointer transition-all"
      style={{
        background: saved ? "rgba(77,255,157,.2)" : loading ? "rgba(255,212,0,.4)" : "#FFD400",
        color: saved ? "#4DFF9D" : "#10131F",
        boxShadow: saved ? "none" : "0 10px 25px rgba(255,212,0,.2)",
      }}>
      {saved ? `✓ Guardado · +${xp} XP` : loading ? "Guardando…" : label}
    </button>
  );
}

export const inputCls = "w-full rounded-[14px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-4 py-3 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors font-sans";
export const labelCls = "block text-[12px] font-bold text-[#A9B1CB] mb-2 mt-4 first:mt-0";
