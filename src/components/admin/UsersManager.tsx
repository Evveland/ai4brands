"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { UserRow } from "@/components/admin/UserRow";
import { sendTelegramMessage } from "@/lib/supabase/user-actions";
import { COUNTRIES, countryLabel } from "@/lib/countries";

const ROLES = ["", "startup", "agency", "brand", "media", "university", "investor", "hub", "institutional", "curator"];

const roleColors: Record<string, string> = {
  startup: "#FFD400", agency: "#FF4FD8", brand: "#44D7FF",
  media: "#4DFF9D", university: "#FFD400", investor: "#44D7FF",
  hub: "#4DFF9D", institutional: "#4DFF9D", curator: "#FF5C7A",
};

export function UsersManager({ users }: { users: any[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ sent: number; failed: number } | null>(null);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search || [u.first_name, u.telegram_handle, String(u.telegram_id)]
        .some(v => v?.toLowerCase().includes(search.toLowerCase()));
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchCountry = !countryFilter || u.country === countryFilter;
      return matchSearch && matchRole && matchCountry;
    });
  }, [users, search, roleFilter, countryFilter]);

  // Role breakdown
  const byRole = users.reduce((acc: Record<string, number>, u) => {
    const r = u.role ?? "sin rol";
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});

  function exportCSV() {
    const headers = ["telegram_id", "telegram_handle", "first_name", "role", "xp", "badges", "created_at"];
    const rows = filtered.map(u => [
      u.telegram_id, u.telegram_handle ?? "", u.first_name ?? "",
      u.role ?? "", u.xp ?? 0,
      (u.badges ?? []).join("|"), u.created_at,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai4brands-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function sendBulk() {
    if (!bulkMessage.trim() || filtered.length === 0) return;
    if (!confirm(`¿Enviar mensaje a ${filtered.length} usuario(s)?`)) return;
    setBulkSending(true);
    let sent = 0; let failed = 0;
    for (const u of filtered) {
      const fd = new FormData();
      fd.set("telegram_id", String(u.telegram_id));
      fd.set("message", bulkMessage);
      const res = await sendTelegramMessage(fd);
      if (res?.ok) sent++; else failed++;
    }
    setBulkSending(false);
    setBulkResult({ sent, failed });
    setBulkMessage("");
    setTimeout(() => setBulkResult(null), 5000);
  }

  return (
    <div>
      {/* Stats row */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))" }}>
        <div className="rounded-[14px] border p-3 text-center" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
          <div className="text-[20px] font-black text-white">{users.length}</div>
          <div className="text-[9px] text-[#737D9D] mt-0.5 uppercase tracking-wider">Total</div>
        </div>
        {Object.entries(byRole).slice(0, 6).map(([role, count]) => (
          <div key={role} className="rounded-[14px] border p-3 text-center" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
            <div className="text-[20px] font-black" style={{ color: roleColors[role] ?? "#737D9D" }}>{count as number}</div>
            <div className="text-[9px] text-[#737D9D] mt-0.5 capitalize truncate">{role}</div>
          </div>
        ))}
      </div>

      {/* Search + filter toolbar */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Buscar por nombre, @handle o ID…"
          className="flex-1 min-w-[200px] rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.4)]"
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2 text-[12px] text-white outline-none"
        >
          {ROLES.map(r => <option key={r} value={r}>{r ? r : "Todos los roles"}</option>)}
        </select>
        <select
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
          className="rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2 text-[12px] text-white outline-none"
        >
          <option value="">🌍 Todos los países</option>
          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
        </select>
        <button onClick={exportCSV}
          className="rounded-[12px] px-4 py-2 text-[12px] font-black cursor-pointer border-0 whitespace-nowrap"
          style={{ background: "rgba(255,255,255,.08)", color: "#A9B1CB" }}>
          ⬇ CSV ({filtered.length})
        </button>
      </div>

      {/* Bulk message */}
      <details className="mb-4 rounded-[14px] border overflow-hidden"
        style={{ border: "1px solid rgba(68,215,255,.2)", background: "rgba(23,29,52,.85)" }}>
        <summary className="list-none cursor-pointer px-4 py-3 flex items-center gap-2">
          <span className="text-[14px]">✉️</span>
          <span className="text-[13px] font-black text-white">Mensaje masivo</span>
          <span className="ml-auto text-[11px] text-[#737D9D]">
            {filtered.length} destinatario{filtered.length !== 1 ? "s" : ""} {roleFilter ? `(${roleFilter})` : ""} {search ? `(filtro activo)` : ""}
          </span>
        </summary>
        <div className="px-4 pb-4 pt-1 border-t border-[rgba(255,255,255,.08)]">
          <textarea
            value={bulkMessage}
            onChange={e => setBulkMessage(e.target.value)}
            rows={3}
            placeholder="Escribe el mensaje para enviar a todos los usuarios filtrados…"
            className="w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none resize-y mt-2"
          />
          {bulkResult && (
            <p className="text-[12px] mt-2 mb-0" style={{ color: bulkResult.failed > 0 ? "#FFD400" : "#4DFF9D" }}>
              ✓ {bulkResult.sent} enviados · {bulkResult.failed} fallidos
            </p>
          )}
          <button onClick={sendBulk} disabled={bulkSending || !bulkMessage.trim()}
            className="mt-2 rounded-[12px] px-4 py-2 text-[12px] font-black cursor-pointer border-0"
            style={{ background: bulkSending ? "rgba(42,171,238,.3)" : "#2AABEE", color: "white" }}>
            {bulkSending ? `Enviando a ${filtered.length}…` : `Enviar a ${filtered.length} usuarios`}
          </button>
        </div>
      </details>

      {/* Result count */}
      {(search || roleFilter) && (
        <p className="text-[12px] text-[#737D9D] mb-3">
          {filtered.length} de {users.length} usuarios
          {search && <> · búsqueda: "<span className="text-white">{search}</span>"</>}
          {roleFilter && <> · rol: <span className="text-white">{roleFilter}</span></>}
          <button onClick={() => { setSearch(""); setRoleFilter(""); }}
            className="ml-2 text-[#FFD400] cursor-pointer bg-transparent border-0 text-[11px] font-bold">
            Limpiar filtros ×
          </button>
        </p>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-[18px] border p-10 text-center" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
          <p className="text-[#737D9D] text-[13px] m-0">Sin resultados para este filtro.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[18px] border" style={{ border: "1px solid rgba(255,255,255,.08)" }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Telegram", "Nombre", "Rol", "XP", "Badges", "Registro", "Acciones"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-wider text-[#737D9D] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <UserRow key={u.id} user={u} detailUrl={`/admin/users/${u.id}`} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
