"use client";

import { deleteChallenge } from "@/lib/supabase/challenge-actions";

export function DeleteChallengeButton({ id }: { id: string }) {
  return (
    <form action={deleteChallenge} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border border-[rgba(255,92,122,.3)] bg-[rgba(255,92,122,.08)] text-[#FF5C7A] hover:bg-[rgba(255,92,122,.18)] transition-colors"
        onClick={(e) => {
          if (!confirm("¿Eliminar este challenge? Esta acción no se puede deshacer.")) {
            e.preventDefault();
          }
        }}
      >
        Eliminar
      </button>
    </form>
  );
}
