"use client";

import { deleteAgency, deleteBrand } from "@/lib/supabase/profile-actions";

type ProfileType = "agency" | "brand";

export function DeleteProfileButton({ id, type }: { id: string; type: ProfileType }) {
  const action = type === "agency" ? deleteAgency : deleteBrand;
  const label = type === "agency" ? "agencia" : "marca";

  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border border-[rgba(255,92,122,.3)] bg-[rgba(255,92,122,.08)] text-[#FF5C7A] hover:bg-[rgba(255,92,122,.18)] transition-colors"
        onClick={(e) => {
          if (!confirm(`¿Eliminar esta ${label}? Esta acción no se puede deshacer.`)) {
            e.preventDefault();
          }
        }}
      >
        Eliminar
      </button>
    </form>
  );
}
