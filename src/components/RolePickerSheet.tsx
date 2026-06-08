"use client";

import { useDispatch } from "@/lib/store";
import { useDBUser } from "@/components/UserProvider";
import { updateUserRole, addUserBadge } from "@/lib/db";
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

  async function pick(role: Role) {
    dispatch({ type: "SET_ROLE", role });
    dispatch({ type: "ADD_BADGE", badge: "Candidato" });
    // Persist to DB
    if (dbUser?.id) {
      await updateUserRole(dbUser.id, role);
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
            Elige tu camino
          </h3>
          <p className="text-[12px] m-0 mb-3" style={{ color: "#A9B1CB" }}>
            Define tu rol en el ecosistema AI4Brands.
          </p>
        </div>

        {/* Scrollable role list */}
        <div className="overflow-y-auto flex-1 px-5 pb-2">
        <div className="grid gap-[8px]">
          {roles.map((r) => {
            const isSelected = current === r.id;
            return (
              <button
                key={r.id}
                onClick={() => pick(r.id)}
                className="flex items-center gap-3 w-full text-left rounded-[16px] px-4 py-3 border cursor-pointer transition-all"
                style={{
                  background: isSelected ? "rgba(255,212,0,.12)" : "rgba(255,255,255,.05)",
                  border: isSelected ? "1px solid rgba(255,212,0,.5)" : "1px solid rgba(255,255,255,.09)",
                }}
              >
                <span className="text-[22px] flex-none">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-black text-white leading-none">{r.tag}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "#A9B1CB" }}>{r.desc}</div>
                </div>
                {isSelected && (
                  <span className="text-[18px] flex-none">✓</span>
                )}
              </button>
            );
          })}
        </div>
        </div>{/* end scroll area */}

        {/* Fixed footer */}
        <div className="px-5 pt-2 pb-6 flex-none border-t" style={{ borderColor: "rgba(255,255,255,.07)" }}>
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
