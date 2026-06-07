"use client";

import { useDispatch } from "@/lib/store";
import type { Role } from "@/types";

const roles: { id: Role; icon: string; tag: string; desc: string }[] = [
  { id: "startup",      icon: "🚀", tag: "Startup",      desc: "Presento una solución de IA" },
  { id: "agency",       icon: "🔎", tag: "Agencia",      desc: "Actúo como scout para clientes" },
  { id: "brand",        icon: "🎯", tag: "Marca",        desc: "Lanzo retos reales de innovación" },
  { id: "institutional",icon: "🌐", tag: "Institucional",desc: "Activo mi ecosistema de startups" },
  { id: "curator",      icon: "⚖️", tag: "Yellow / Jurado","desc": "Curar, validar o patrocinar" },
];

interface Props {
  current: Role | null;
  onSelect: (role: Role) => void;
  onClose: () => void;
}

export function RolePickerSheet({ current, onSelect, onClose }: Props) {
  const dispatch = useDispatch();

  function pick(role: Role) {
    dispatch({ type: "SET_ROLE", role });
    dispatch({ type: "ADD_BADGE", badge: "Candidato" });
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

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 rounded-t-[28px] p-5 pb-8"
        style={{
          background: "rgba(18,23,42,.98)",
          border: "1px solid rgba(255,255,255,.1)",
          borderBottom: "none",
          boxShadow: "0 -20px 60px rgba(0,0,0,.5)",
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,.2)" }} />

        <h3 className="text-[18px] font-black tracking-tight text-white m-0 mb-1">
          Elige tu camino
        </h3>
        <p className="text-[12px] m-0 mb-4" style={{ color: "#A9B1CB" }}>
          Define tu rol en el ecosistema AI4Brands.
        </p>

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

        <button
          onClick={onClose}
          className="w-full mt-4 rounded-[14px] py-3 text-[13px] font-black cursor-pointer border-0"
          style={{ background: "rgba(255,255,255,.07)", color: "#A9B1CB" }}
        >
          Cancelar
        </button>
      </div>
    </>
  );
}
