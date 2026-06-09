"use client";

import { deleteUser } from "@/lib/supabase/user-actions";

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  return (
    <form action={deleteUser} className="inline">
      <input type="hidden" name="id" value={userId} />
      <button
        type="submit"
        className="rounded-[8px] px-2.5 py-1 text-[10px] font-black cursor-pointer border-0 transition-colors"
        style={{ background: "rgba(255,92,122,.12)", color: "#FF5C7A" }}
        onClick={(e) => {
          if (!confirm(`¿Eliminar a ${userName}? Se borrarán todos sus datos (votos, reuniones, propuestas, membresías).`)) {
            e.preventDefault();
          }
        }}
      >
        🗑 Eliminar
      </button>
    </form>
  );
}
