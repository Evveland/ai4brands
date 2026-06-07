"use client";

import { rejectOrgAction } from "@/lib/supabase/approval-actions";
import { useState } from "react";

export function RejectOrgButton({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border border-[rgba(255,92,122,.3)] bg-[rgba(255,92,122,.08)] text-[#FF5C7A] hover:bg-[rgba(255,92,122,.18)] transition-colors">
      Rechazar
    </button>
  );

  return (
    <form action={rejectOrgAction} className="flex gap-2 items-center mt-2">
      <input type="hidden" name="org_id" value={orgId} />
      <input
        name="reason"
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Motivo del rechazo (opcional)"
        className="flex-1 rounded-[10px] border border-[rgba(255,92,122,.3)] bg-[rgba(255,255,255,.06)] px-3 py-1.5 text-[12px] text-white outline-none"
      />
      <button type="submit"
        className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border-0 bg-[#FF5C7A] text-white">
        Confirmar
      </button>
      <button type="button" onClick={() => setOpen(false)}
        className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border border-[rgba(255,255,255,.1)] bg-transparent text-[#737D9D]">
        Cancelar
      </button>
    </form>
  );
}
