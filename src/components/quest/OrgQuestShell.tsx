"use client";

import { useState, useEffect } from "react";
import { useDBUser } from "@/components/UserProvider";
import { getUserOrg, joinOrgByCode, type Organization, type OrgRole } from "@/lib/db/orgs";

/* ─── Status banner ──────────────────────────────────────────────── */
function StatusBanner({ status, reason }: { status: string; reason?: string | null }) {
  const cfg = {
    pending: {
      bg: "rgba(255,212,0,.12)", border: "rgba(255,212,0,.3)", color: "#FFD400",
      icon: "⏳", text: "Solicitud en revisión",
      sub: "El equipo de AI4Brands está verificando tu organización. Recibirás acceso completo una vez aprobado.",
    },
    approved: {
      bg: "rgba(77,255,157,.1)", border: "rgba(77,255,157,.3)", color: "#4DFF9D",
      icon: "✅", text: "Organización verificada",
      sub: "Tu organización está activa. Completa los pasos de tu Quest para ganar XP.",
    },
    rejected: {
      bg: "rgba(255,92,122,.1)", border: "rgba(255,92,122,.3)", color: "#FF5C7A",
      icon: "❌", text: "Solicitud rechazada",
      sub: reason ?? "El equipo revisará tu caso. Puedes contactar a AI4Brands para más información.",
    },
  }[status] ?? null;

  if (!cfg) return null;

  return (
    <div className="rounded-[18px] border p-4 mb-4 flex gap-3 items-start"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <span className="text-[22px] flex-none">{cfg.icon}</span>
      <div>
        <div className="font-black text-[14px] mb-1" style={{ color: cfg.color }}>{cfg.text}</div>
        <p className="text-[12px] m-0" style={{ color: "#DCE3FF" }}>{cfg.sub}</p>
      </div>
    </div>
  );
}

/* ─── Invite code card ───────────────────────────────────────────── */
function InviteCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-[18px] border p-4 mb-4"
      style={{ background: "rgba(68,215,255,.08)", border: "1px solid rgba(68,215,255,.25)" }}>
      <div className="text-[12px] font-bold text-[#A9B1CB] mb-2">Código de invitación</div>
      <div className="flex items-center gap-3">
        <span className="font-black text-[22px] tracking-[0.2em] text-white flex-1">{code}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border-0 transition-all"
          style={{ background: copied ? "rgba(77,255,157,.2)" : "rgba(68,215,255,.2)", color: copied ? "#4DFF9D" : "#44D7FF" }}>
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
      <p className="text-[11px] text-[#737D9D] mt-2 mb-0">
        Comparte este código con tu equipo para que se unan a la misma organización.
      </p>
    </div>
  );
}

/* ─── Join existing org ──────────────────────────────────────────── */
function JoinOrgForm({ userId, onJoined }: { userId: string; onJoined: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const org = await joinOrgByCode(userId, code);
    setLoading(false);
    if (!org) { setError("Código no encontrado. Verifica el código con el responsable de tu organización."); return; }
    onJoined();
  }

  return (
    <form onSubmit={handleJoin} className="grid gap-3">
      <div>
        <label className="block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5">
          Código de organización
        </label>
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Ej: A1B2C3D4"
          maxLength={8}
          className="w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[14px] font-black tracking-widest text-white outline-none text-center font-mono"
        />
        {error && <p className="text-[11px] text-[#FF5C7A] mt-1 mb-0">{error}</p>}
      </div>
      <button type="submit" disabled={loading}
        className="rounded-[12px] py-2.5 text-[13px] font-black cursor-pointer border-0"
        style={{ background: "#FFD400", color: "#10131F" }}>
        {loading ? "Buscando…" : "Unirme a la organización"}
      </button>
    </form>
  );
}

/* ─── Members list ───────────────────────────────────────────────── */
export function MembersList({ members }: { members: any[] }) {
  const roleLabel: Record<string, string> = { owner: "Responsable", admin: "Admin", member: "Miembro" };
  const roleColor: Record<string, string> = { owner: "#FFD400", admin: "#44D7FF", member: "#A9B1CB" };

  if (!members.length) return null;

  return (
    <div className="rounded-[18px] border p-4 mb-4"
      style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,255,255,.08)" }}>
      <div className="text-[13px] font-black text-white mb-3">
        Equipo · {members.length} {members.length === 1 ? "persona" : "personas"}
      </div>
      <div className="grid gap-2">
        {members.map((m: any) => (
          <div key={m.id} className="flex items-center gap-3">
            <div className="w-[32px] h-[32px] rounded-full grid place-items-center font-black text-[13px] flex-none"
              style={{ background: "linear-gradient(135deg,rgba(255,212,0,.3),rgba(68,215,255,.3))" }}>
              {(m.users?.first_name ?? m.users?.telegram_handle ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-white truncate">
                {m.users?.first_name ?? (m.users?.telegram_handle ? `@${m.users.telegram_handle}` : "Usuario")}
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: `${roleColor[m.role_in_org]}18`, color: roleColor[m.role_in_org] }}>
              {roleLabel[m.role_in_org]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main shell hook ────────────────────────────────────────────── */

export function useOrgQuest() {
  const dbUser = useDBUser();
  const [org, setOrg] = useState<(Organization & { role_in_org: OrgRole }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"loading" | "no-org" | "create" | "join" | "quest">("loading");

  async function reload() {
    if (!dbUser?.id) return;
    setLoading(true);
    const o = await getUserOrg(dbUser.id);
    setOrg(o);
    setView(o ? "quest" : "no-org");
    setLoading(false);
  }

  useEffect(() => { reload(); }, [dbUser?.id]);

  return { org, loading, view, setView, reload, dbUser };
}

/* ─── No-org entry screen ────────────────────────────────────────── */

export function NoOrgEntry({
  roleName,
  onCreateClick,
  onJoined,
  userId,
}: {
  roleName: string;
  onCreateClick: () => void;
  onJoined: () => void;
  userId: string;
}) {
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div>
      <div className="rounded-[24px] border p-5 mb-4"
        style={{ background: "linear-gradient(145deg,rgba(255,212,0,.12),rgba(68,215,255,.06))", border: "1px solid rgba(255,255,255,.09)" }}>
        <small className="text-[#FFD400] font-black uppercase tracking-widest text-[11px]">
          {roleName} Quest
        </small>
        <h2 className="text-[22px] font-black tracking-tight mt-2 mb-2 leading-tight">
          Registra tu organización
        </h2>
        <p className="m-0 text-[#DCE3FF] text-[13px] leading-relaxed">
          El acceso requiere verificación por el equipo de AI4Brands. Una vez aprobado, tu equipo completo tiene acceso.
        </p>
      </div>

      <div className="grid gap-3 mb-4">
        <div className="rounded-[18px] border p-4"
          style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,255,255,.08)" }}>
          {[
            { icon: "📝", title: "Completa el perfil", sub: "Datos de tu organización y contacto" },
            { icon: "⏳", title: "Revisión por AI4Brands", sub: "El equipo verifica y aprueba (24–48h)" },
            { icon: "🚀", title: "Acceso completo", sub: "Quest, XP, badges y conexiones activados" },
          ].map((s, i) => (
            <div key={i} className={`flex gap-3 items-start ${i < 2 ? "mb-3 pb-3 border-b border-[rgba(255,255,255,.07)]" : ""}`}>
              <span className="text-[20px] flex-none">{s.icon}</span>
              <div>
                <div className="text-[13px] font-black text-white">{s.title}</div>
                <div className="text-[11px] text-[#737D9D]">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showJoin ? (
        <div className="rounded-[18px] border p-4 mb-4"
          style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,255,255,.08)" }}>
          <div className="text-[14px] font-black text-white mb-3">Unirme con código</div>
          <JoinOrgForm userId={userId} onJoined={onJoined} />
          <button onClick={() => setShowJoin(false)}
            className="w-full mt-2 text-[12px] text-[#737D9D] bg-transparent border-0 cursor-pointer py-1">
            Cancelar
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          <button onClick={onCreateClick}
            className="w-full rounded-[16px] py-3 font-black text-[14px] border-0 cursor-pointer"
            style={{ background: "#FFD400", color: "#10131F", boxShadow: "0 10px 25px rgba(255,212,0,.22)" }}>
            Registrar mi organización
          </button>
          <button onClick={() => setShowJoin(true)}
            className="w-full rounded-[16px] py-3 font-black text-[13px] cursor-pointer"
            style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.09)", color: "#A9B1CB" }}>
            Unirme a una organización existente
          </button>
        </div>
      )}
    </div>
  );
}

export { StatusBanner, InviteCard, JoinOrgForm };
