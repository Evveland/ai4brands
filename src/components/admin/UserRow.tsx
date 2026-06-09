"use client";

import { useState } from "react";
import Link from "next/link";
import { updateUser, sendTelegramMessage } from "@/lib/supabase/user-actions";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";

const inputCls = "w-full rounded-[10px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2 text-[12px] text-white outline-none focus:border-[rgba(255,212,0,.4)] transition-colors font-sans";
const labelCls = "block text-[10px] font-bold text-[#737D9D] uppercase tracking-wider mb-1";

const ALL_ROLES = ["startup","agency","brand","media","university","investor","hub","institutional","curator"];
const ALL_BADGES = ["Candidato","Comunidad Unida","Perfil Iniciado","Startup Listo","Constructor de Retos","Finalista","Listo para Piloto","Scout de Agencia","Recomendador","Creador de Briefs","Conector Top"];

const roleColors: Record<string, { bg: string; text: string }> = {
  startup:      { bg: "rgba(255,212,0,.15)",  text: "#FFD400" },
  agency:       { bg: "rgba(255,79,216,.15)", text: "#FF4FD8" },
  brand:        { bg: "rgba(68,215,255,.15)", text: "#44D7FF" },
  media:        { bg: "rgba(77,255,157,.15)", text: "#4DFF9D" },
  university:   { bg: "rgba(255,212,0,.15)",  text: "#FFD400" },
  investor:     { bg: "rgba(68,215,255,.15)", text: "#44D7FF" },
  hub:          { bg: "rgba(77,255,157,.15)", text: "#4DFF9D" },
  institutional:{ bg: "rgba(77,255,157,.15)", text: "#4DFF9D" },
  curator:      { bg: "rgba(255,92,122,.15)", text: "#FF5C7A" },
};

export function UserRow({ user, detailUrl }: { user: any; detailUrl?: string }) {
  const [tab, setTab] = useState<"edit" | "message" | null>(null);
  const [msgSent, setMsgSent] = useState(false);
  const [msgError, setMsgError] = useState("");

  const rc = user.role ? (roleColors[user.role] ?? { bg: "rgba(255,255,255,.08)", text: "#A9B1CB" }) : null;

  async function handleMessage(fd: FormData) {
    const res = await sendTelegramMessage(fd);
    if (res?.error) setMsgError(res.error);
    else { setMsgSent(true); setTimeout(() => { setMsgSent(false); setTab(null); }, 2000); }
  }

  return (
    <>
      {/* Main row */}
      <tr className="border-b hover:bg-[rgba(255,255,255,.03)] transition-colors"
        style={{ borderColor: "rgba(255,255,255,.06)" }}>
        <td className="px-4 py-3">
          <span className="font-mono text-[12px]" style={{ color: "#44D7FF" }}>
            {user.telegram_handle ? `@${user.telegram_handle}` : `#${user.telegram_id}`}
          </span>
        </td>
        <td className="px-4 py-3 text-[12px] text-white">{user.first_name ?? "—"}</td>
        <td className="px-4 py-3">
          {rc ? (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: rc.bg, color: rc.text }}>{user.role}</span>
          ) : <span className="text-[#737D9D] text-[12px]">—</span>}
        </td>
        <td className="px-4 py-3">
          <span className="font-black text-[12px]" style={{ color: "#FFD400" }}>{user.xp ?? 0}</span>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-1 flex-wrap">
            {(user.badges ?? []).slice(0, 2).map((b: string) => (
              <span key={b} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(255,212,0,.12)] text-[#FFD400]">{b}</span>
            ))}
            {(user.badges ?? []).length > 2 && (
              <span className="text-[9px] text-[#737D9D]">+{user.badges.length - 2}</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-[11px] text-[#737D9D]">
          {new Date(user.created_at).toLocaleDateString("es-ES")}
        </td>
        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex gap-1.5 flex-wrap">
            {detailUrl && (
              <Link href={detailUrl}
                className="rounded-[8px] px-2.5 py-1 text-[10px] font-black cursor-pointer no-underline"
                style={{ background: "rgba(255,255,255,.08)", color: "#A9B1CB" }}>
                👤 Ver
              </Link>
            )}
            <button onClick={() => setTab(tab === "edit" ? null : "edit")}
              className="rounded-[8px] px-2.5 py-1 text-[10px] font-black cursor-pointer border-0 transition-colors"
              style={{ background: tab === "edit" ? "rgba(255,212,0,.25)" : "rgba(255,212,0,.12)", color: "#FFD400" }}>
              ✏️ Editar
            </button>
            <button onClick={() => { setTab(tab === "message" ? null : "message"); setMsgSent(false); setMsgError(""); }}
              className="rounded-[8px] px-2.5 py-1 text-[10px] font-black cursor-pointer border-0 transition-colors"
              style={{ background: tab === "message" ? "rgba(42,171,238,.25)" : "rgba(42,171,238,.12)", color: "#2AABEE" }}>
              ✉️ Mensaje
            </button>
            <DeleteUserButton
              userId={user.id}
              userName={user.first_name || (user.telegram_handle ? `@${user.telegram_handle}` : `#${user.telegram_id}`)}
            />
          </div>
        </td>
      </tr>

      {/* Expandable edit panel */}
      {tab === "edit" && (
        <tr style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <td colSpan={7} className="px-4 pb-4 pt-2">
            <form action={updateUser} className="grid gap-3"
              onSubmit={() => setTimeout(() => setTab(null), 200)}>
              <input type="hidden" name="id" value={user.id} />
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input name="first_name" defaultValue={user.first_name ?? ""} placeholder="Nombre" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>@handle</label>
                  <input name="telegram_handle" defaultValue={user.telegram_handle ?? ""} placeholder="sin @" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Rol</label>
                  <select name="role" defaultValue={user.role ?? ""} className={inputCls}>
                    <option value="">— Sin rol —</option>
                    {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>XP</label>
                  <input type="number" name="xp" defaultValue={user.xp ?? 0} min={0} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Badges (separados por coma)</label>
                <input name="badges" defaultValue={(user.badges ?? []).join(", ")} className={inputCls}
                  placeholder="Candidato, Startup Listo…" />
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                  {ALL_BADGES.map(b => (
                    <span key={b} className="text-[9px] px-1.5 py-0.5 rounded-full border border-[rgba(255,255,255,.1)] text-[#737D9D] cursor-default">{b}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit"
                  className="rounded-[10px] px-4 py-2 text-[11px] font-black cursor-pointer border-0"
                  style={{ background: "#4DFF9D", color: "#0A1A0F" }}>
                  Guardar cambios
                </button>
                <button type="button" onClick={() => setTab(null)}
                  className="rounded-[10px] px-4 py-2 text-[11px] font-black cursor-pointer border-0"
                  style={{ background: "rgba(255,255,255,.07)", color: "#737D9D" }}>
                  Cancelar
                </button>
              </div>
            </form>
          </td>
        </tr>
      )}

      {/* Expandable message panel */}
      {tab === "message" && (
        <tr style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <td colSpan={7} className="px-4 pb-4 pt-2">
            {msgSent ? (
              <div className="rounded-[12px] px-4 py-3 text-[13px] font-black text-center"
                style={{ background: "rgba(77,255,157,.15)", color: "#4DFF9D" }}>
                ✓ Mensaje enviado correctamente
              </div>
            ) : (
              <form action={handleMessage} className="grid gap-3">
                <input type="hidden" name="telegram_id" value={user.telegram_id} />
                <div>
                  <label className={labelCls}>
                    Mensaje para {user.first_name || (user.telegram_handle ? `@${user.telegram_handle}` : `#${user.telegram_id}`)}
                  </label>
                  <textarea name="message" required rows={3} className={`${inputCls} resize-y`}
                    placeholder="Escribe un mensaje personalizado. Llegará con el botón de Abrir AI4Brands." />
                </div>
                {msgError && (
                  <p className="text-[11px] text-[#FF5C7A] m-0">{msgError}</p>
                )}
                <div className="flex gap-2 items-center">
                  <button type="submit"
                    className="rounded-[10px] px-4 py-2 text-[11px] font-black cursor-pointer border-0"
                    style={{ background: "#2AABEE", color: "white" }}>
                    ✉️ Enviar por Telegram
                  </button>
                  <button type="button" onClick={() => setTab(null)}
                    className="rounded-[10px] px-4 py-2 text-[11px] font-black cursor-pointer border-0"
                    style={{ background: "rgba(255,255,255,.07)", color: "#737D9D" }}>
                    Cancelar
                  </button>
                  <span className="text-[10px] text-[#737D9D]">
                    El usuario debe haber iniciado @ai4brands_bot
                  </span>
                </div>
              </form>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
