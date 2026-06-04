"use client";

import { useNav } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Scout() {
  const { go } = useNav();

  return (
    <div>
      <div className="flex items-end justify-between mx-0.5 mt-[18px] mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          Agency Scout
        </h3>
        <button
          onClick={() => go("agency-dashboard")}
          className="text-[#FFD400] text-[12px] font-bold cursor-pointer bg-transparent border-0"
        >
          Panel agencia
        </button>
      </div>

      <Card className="mb-4">
        <label className="block text-[var(--muted)] text-[12px] mt-3 mb-[7px]">
          Buscar startups por vertical
        </label>
        <select className="w-full border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] rounded-[14px] p-3 text-[var(--text)] outline-none font-sans">
          <option>Content AI</option>
          <option>Customer Experience</option>
          <option>Data & Insights</option>
          <option>Gamification</option>
        </select>
        <label className="block text-[var(--muted)] text-[12px] mt-3 mb-[7px]">
          Necesidad del cliente
        </label>
        <textarea
          className="w-full border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] rounded-[14px] p-3 text-[var(--text)] outline-none font-sans min-h-[82px] resize-y"
          placeholder="Ej: Necesitamos una solución para automatizar contenido de producto para retail..."
        />
        <Button full onClick={() => go("startup-match")}>
          Encontrar startups
        </Button>
      </Card>

      <div className="flex items-end justify-between mx-0.5 mb-[10px]">
        <h3 className="m-0 text-[17px] font-bold tracking-tight">
          Startups recomendadas
        </h3>
      </div>

      <div className="grid gap-[10px]">
        <Card clickable onClick={() => go("startup-detail")} className="flex gap-3 items-center">
          <div
            className="w-[58px] h-[58px] rounded-[22px] grid place-items-center font-black text-[20px] flex-none"
            style={{ background: "linear-gradient(135deg,#44D7FF,#FF4FD8)" }}
          >
            CX
          </div>
          <div>
            <h4 className="m-0 font-semibold">CXFlow AI</h4>
            <p className="m-0 mt-1 text-[var(--muted)] text-[12px]">
              AI agents para atención y ventas. Piloto en 30 días.
            </p>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="gold">Match 94%</Badge>
              <Badge>Solicitar reunión</Badge>
            </div>
          </div>
        </Card>

        <Card clickable onClick={() => go("startup-ugc")} className="flex gap-3 items-center">
          <div
            className="w-[58px] h-[58px] rounded-[22px] grid place-items-center font-black text-[20px] flex-none"
            style={{ background: "linear-gradient(135deg,#44D7FF,#FF4FD8)" }}
          >
            UG
          </div>
          <div>
            <h4 className="m-0 font-semibold">UGC Forge</h4>
            <p className="m-0 mt-1 text-[var(--muted)] text-[12px]">
              Generación y scoring de contenido de creadores con IA.
            </p>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="gold">Match 88%</Badge>
              <Badge>Guardar</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
