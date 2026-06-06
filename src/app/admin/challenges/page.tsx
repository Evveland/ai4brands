import { getChallenges } from "@/lib/supabase/admin-queries";
import {
  SectionHeader,
  StatusPill,
  AdminCard,
} from "@/components/admin/AdminCard";
import {
  createChallenge,
  updateChallenge,
} from "@/lib/supabase/challenge-actions";
import { DeleteChallengeButton } from "@/components/admin/DeleteChallengeButton";

/* ─── Shared field styles ─── */
const inputCls =
  "w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors";

const labelCls = "block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5";

const types = ["sponsor", "brand", "agency", "ecosystem"] as const;
const verticals = [
  "", "Content AI", "Customer Experience", "Data & Insights",
  "Loyalty & Gamification", "Retail Media", "Automation",
];

/* ─── Inline form used for both create and edit ─── */
function ChallengeForm({
  action,
  defaults,
  submitLabel,
  submitColor = "#FFD400",
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    id?: string;
    type?: string;
    title?: string;
    description?: string;
    vertical?: string;
    xp_reward?: number;
  };
  submitLabel: string;
  submitColor?: string;
}) {
  return (
    <form action={action} className="grid gap-3">
      {defaults?.id && (
        <input type="hidden" name="id" value={defaults.id} />
      )}

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Type */}
        <div>
          <label className={labelCls}>Tipo</label>
          <select name="type" defaultValue={defaults?.type ?? "brand"} className={inputCls}>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* XP */}
        <div>
          <label className={labelCls}>XP reward</label>
          <input
            type="number"
            name="xp_reward"
            defaultValue={defaults?.xp_reward ?? 500}
            min={0}
            step={50}
            className={inputCls}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelCls}>Título</label>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaults?.title ?? ""}
          placeholder="Ej: IA para personalizar campañas a escala"
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Descripción</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ""}
          placeholder="Brief del reto para los participantes…"
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* Vertical */}
      <div>
        <label className={labelCls}>Vertical</label>
        <select name="vertical" defaultValue={defaults?.vertical ?? ""} className={inputCls}>
          {verticals.map((v) => (
            <option key={v} value={v}>{v || "— Sin vertical —"}</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="rounded-[12px] px-4 py-2.5 text-[13px] font-black cursor-pointer border-0 mt-1"
        style={{ background: submitColor, color: submitColor === "#FFD400" ? "#10131F" : "white" }}
      >
        {submitLabel}
      </button>
    </form>
  );
}


/* ─── Page ─── */
export default async function ChallengesPage() {
  const challenges = await getChallenges();

  const byType = challenges.reduce((acc: Record<string, number>, c: any) => {
    acc[c.type] = (acc[c.type] ?? 0) + 1;
    return acc;
  }, {});

  const totalResponses = challenges.reduce(
    (sum: number, c: any) => sum + (c.challenge_responses?.length ?? 0),
    0
  );

  const typeColors: Record<string, string> = {
    sponsor: "#FFD400",
    brand: "#44D7FF",
    agency: "#FF4FD8",
    ecosystem: "#4DFF9D",
  };

  return (
    <div>
      <SectionHeader
        title="Challenges"
        subtitle={`${challenges.length} retos · ${totalResponses} propuestas recibidas`}
      />

      {/* Type summary */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {types.map((type) => (
          <div
            key={type}
            className="rounded-[16px] border p-4 text-center"
            style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}
          >
            <div className="text-[22px] font-black" style={{ color: typeColors[type] }}>
              {byType[type] ?? 0}
            </div>
            <div className="text-[11px] text-[#737D9D] mt-0.5 capitalize">{type}</div>
          </div>
        ))}
      </div>

      {/* ── CREATE FORM ── */}
      <details className="mb-6 rounded-[18px] border overflow-hidden" style={{ border: "1px solid rgba(255,212,0,.3)", background: "rgba(23,29,52,.85)" }}>
        <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[18px]">➕</span>
            <span className="text-[14px] font-black text-white">Nuevo challenge</span>
          </div>
          <span className="text-[11px] font-bold rounded-full px-3 py-1" style={{ background: "rgba(255,212,0,.15)", color: "#FFD400" }}>
            Abrir formulario
          </span>
        </summary>
        <div className="px-5 pb-5 pt-1 border-t border-[rgba(255,255,255,.08)]">
          <ChallengeForm
            action={createChallenge}
            submitLabel="Crear challenge"
          />
        </div>
      </details>

      {/* ── CHALLENGE LIST ── */}
      {challenges.length === 0 ? (
        <AdminCard>
          <p className="text-[13px] text-[#737D9D] text-center py-6">Sin challenges todavía. Crea el primero arriba.</p>
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {challenges.map((c: any) => (
            <details
              key={c.id}
              className="rounded-[18px] border overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}
            >
              {/* Row header */}
              <summary className="list-none cursor-pointer px-5 py-4 flex items-center gap-3">
                {/* Type pill */}
                <StatusPill status={c.type} />

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-[14px] truncate">{c.title}</div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {c.vertical && (
                      <span className="text-[11px] text-[#737D9D]">{c.vertical}</span>
                    )}
                    <span className="text-[11px] font-black" style={{ color: "#FFD400" }}>
                      {c.xp_reward} XP
                    </span>
                    <span className="text-[11px] text-[#737D9D]">
                      {c.challenge_responses?.length ?? 0} propuestas
                    </span>
                  </div>
                </div>

                {/* Actions hint */}
                <span className="text-[11px] text-[#737D9D] flex-none">Editar ⌄</span>
              </summary>

              {/* Edit form */}
              <div className="px-5 pb-5 pt-1 border-t border-[rgba(255,255,255,.08)]">
                <p className="text-[11px] text-[#737D9D] mb-4 mt-2">
                  Edita los campos y guarda. Los cambios son inmediatos.
                </p>
                <ChallengeForm
                  action={updateChallenge}
                  defaults={{
                    id: c.id,
                    type: c.type,
                    title: c.title,
                    description: c.description,
                    vertical: c.vertical,
                    xp_reward: c.xp_reward,
                  }}
                  submitLabel="Guardar cambios"
                  submitColor="#44D7FF"
                />
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,.06)] flex justify-end">
                  <DeleteChallengeButton id={c.id} />
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
