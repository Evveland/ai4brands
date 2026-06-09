"use client";

import { useState, useEffect } from "react";
import { useDispatch, useAppState } from "@/lib/store";
import { useDBUser } from "@/components/UserProvider";
import { updateUserRole, addUserBadge, updateUserCountry } from "@/lib/db";
import { getUserOrg } from "@/lib/db/orgs";
import { COUNTRIES } from "@/lib/countries";
import type { Role } from "@/types";

const roles: { id: Role; icon: string; tag: string; desc: string }[] = [
  { id: "startup",      icon: "🚀", tag: "Startup",       desc: "Presento una solución de IA para marketing" },
  { id: "agency",       icon: "🔎", tag: "Agencia",       desc: "Actúo como scout de innovación para clientes" },
  { id: "brand",        icon: "🎯", tag: "Marca",         desc: "Lanzo retos reales de IA y busco pilotos" },
  { id: "media",        icon: "📺", tag: "Medio",         desc: "Cobertura, contenido y difusión del evento" },
  { id: "university",   icon: "🎓", tag: "Universidad",   desc: "Conecto talento académico con la industria" },
  { id: "investor",     icon: "💰", tag: "Inversor",      desc: "Descubro startups con potencial de inversión" },
  { id: "hub",          icon: "🏗️", tag: "Hub & Lab",     desc: "Activo mi comunidad de innovación" },
  { id: "institutional",icon: "🌐", tag: "Institucional", desc: "Aceleradora, incubadora o ecosistema de startups" },
  { id: "curator",      icon: "⚖️", tag: "Yellow / Jurado", desc: "Curar, validar o patrocinar AI4Brands" },
];

interface Props {
  current: Role | null;
  onSelect: (role: Role) => void;
  onClose: () => void;
}

export function RolePickerSheet({ current, onSelect, onClose }: Props) {
  const dispatch = useDispatch();
  const dbUser = useDBUser();
  const { country } = useAppState();
  const [selectedCountry, setSelectedCountry] = useState(country ?? "ES");
  const [hasOrg, setHasOrg] = useState(false);

  // Check if user already has a registered org (locks role switching)
  useEffect(() => {
    if (!dbUser?.id) return;
    getUserOrg(dbUser.id).then((org) => setHasOrg(!!org));
  }, [dbUser?.id]);

  async function pick(role: Role) {
    // If registered, only allow clicking the current role (to navigate to quest)
    if (hasOrg && role !== current) return;
    dispatch({ type: "SET_ROLE", role });
    dispatch({ type: "SET_COUNTRY", country: selectedCountry });
    dispatch({ type: "ADD_BADGE", badge: "Candidato" });
    if (dbUser?.id) {
      await updateUserRole(dbUser.id, role);
      await updateUserCountry(dbUser.id, selectedCountry);
      await addUserBadge(dbUser.id, "Candidato");
    }
    onSelect(role);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Sheet — max 85vh so it never overflows, inner list scrolls */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 rounded-t-[28px] flex flex-col"
        style={{
          maxHeight: "85dvh",
          background: "rgba(18,23,42,.98)",
          border: "1px solid rgba(255,255,255,.1)",
          borderBottom: "none",
          boxShadow: "0 -20px 60px rgba(0,0,0,.5)",
        }}
      >
        {/* Fixed header */}
        <div className="px-5 pt-5 pb-0 flex-none">
          <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,.2)" }} />
          <h3 className="text-[18px] font-black tracking-tight text-white m-0 mb-1">
            {hasOrg ? "Tu camino en AI4Brands" : "Elige tu camino"}
          </h3>
          <p className="text-[12px] m-0 mb-3" style={{ color: "#A9B1CB" }}>
            {hasOrg
              ? "Ya estás registrado. Tu rol queda fijo una vez que has enviado tu solicitud."
              : "Define tu rol en el ecosistema AI4Brands."}
          </p>
        </div>

        {/* Scrollable role list */}
        <div className="overflow-y-auto flex-1 px-5 pb-2">
        <div className="grid gap-[8px]">
          {roles.map((r) => {
            const isSelected = current === r.id;
            const isLocked = hasOrg && !isSelected;
            return (
              <button
                key={r.id}
                onClick={() => pick(r.id)}
                disabled={isLocked}
                className="flex items-center gap-3 w-full text-left rounded-[16px] px-4 py-3 border transition-all"
                style={{
                  background: isSelected ? "rgba(255,212,0,.12)" : "rgba(255,255,255,.04)",
                  border: isSelected ? "1px solid rgba(255,212,0,.5)" : "1px solid rgba(255,255,255,.07)",
                  cursor: isLocked ? "default" : "pointer",
                  opacity: isLocked ? 0.35 : 1,
                }}
              >
                <span className="text-[22px] flex-none" style={{ filter: isLocked ? "grayscale(1)" : "none" }}>
                  {r.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-black leading-none" style={{ color: isLocked ? "#737D9D" : "white" }}>
                    {r.tag}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: isLocked ? "#4a5068" : "#A9B1CB" }}>
                    {isLocked ? "No disponible" : r.desc}
                  </div>
                </div>
                {isSelected && <span className="text-[18px] flex-none">✓</span>}
                {isLocked && <span className="text-[14px] flex-none" style={{ color: "#4a5068" }}>🔒</span>}
              </button>
            );
          })}
        </div>
        </div>{/* end scroll area */}

        {/* Fixed footer */}
        <div className="px-5 pt-3 pb-6 flex-none border-t" style={{ borderColor: "rgba(255,255,255,.07)" }}>
          {/* Country selector */}
          {!hasOrg && (
            <div className="mb-3">
              <label className="block text-[10px] font-black text-[#737D9D] uppercase tracking-wider mb-1.5">
                País
              </label>
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full rounded-[14px] py-3 text-[13px] font-black cursor-pointer border-0"
            style={{ background: "rgba(255,255,255,.07)", color: "#A9B1CB" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
