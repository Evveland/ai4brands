import { createClient } from "@/lib/supabase/server";
import { SectionHeader, AdminCard } from "@/components/admin/AdminCard";
import { createBrand, updateBrand } from "@/lib/supabase/profile-actions";
import { DeleteProfileButton } from "@/components/admin/DeleteProfileButton";

const inputCls =
  "w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors font-sans";
const labelCls =
  "block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5";

const sectorOptions = [
  "Retail", "Banca & Finanzas", "Turismo", "Gran Consumo", "Telecomunicaciones",
  "Moda", "Automoción", "Alimentación", "Salud", "Media & Entretenimiento", "Otro",
];

const verticalOptions = [
  "Content AI", "Customer Experience", "Data & Insights",
  "Loyalty & Gamification", "Retail Media", "Automation", "Creator Economy",
];

function BrandForm({
  action,
  defaults,
  submitLabel,
  submitColor = "#FFD400",
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: Record<string, any>;
  submitLabel: string;
  submitColor?: string;
}) {
  return (
    <form action={action} className="grid gap-3">
      {defaults?.id && <input type="hidden" name="id" value={defaults.id} />}

      {/* Row 1: name + status */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr auto" }}>
        <div>
          <label className={labelCls}>Nombre de la marca *</label>
          <input
            type="text" name="name" required
            defaultValue={defaults?.name ?? ""}
            placeholder="Ej: Inditex, BBVA, Telefónica…"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Estado</label>
          <select name="status" defaultValue={defaults?.status ?? "pending"} className={inputCls}>
            <option value="pending">Pendiente</option>
            <option value="active">Activa</option>
            <option value="inactive">Inactiva</option>
          </select>
        </div>
      </div>

      {/* Row 2: contact + email */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label className={labelCls}>Persona de contacto</label>
          <input type="text" name="contact_name" defaultValue={defaults?.contact_name ?? ""} placeholder="Nombre Apellido" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" name="contact_email" defaultValue={defaults?.contact_email ?? ""} placeholder="innovacion@marca.com" className={inputCls} />
        </div>
      </div>

      {/* Row 3: website + sector */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label className={labelCls}>Web</label>
          <input type="url" name="website" defaultValue={defaults?.website ?? ""} placeholder="https://marca.com" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Sector</label>
          <select name="sector" defaultValue={defaults?.sector ?? ""} className={inputCls}>
            <option value="">— Sin sector —</option>
            {sectorOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Verticals of interest */}
      <div>
        <label className={labelCls}>Verticales de interés <span className="normal-case font-normal">(separadas por coma)</span></label>
        <input
          type="text" name="verticals"
          defaultValue={(defaults?.verticals ?? []).join(", ")}
          placeholder="Content AI, Customer Experience, Retail Media"
          className={inputCls}
        />
        <div className="flex gap-1.5 flex-wrap mt-2">
          {verticalOptions.map((v) => (
            <span key={v} className="text-[10px] px-2 py-1 rounded-full border border-[rgba(255,255,255,.1)] text-[#737D9D]">{v}</span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Descripción / necesidad de innovación</label>
        <textarea name="description" rows={3} defaultValue={defaults?.description ?? ""} placeholder="Describe el contexto y qué buscan explorar con IA…" className={`${inputCls} resize-y`} />
      </div>

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

const statusColors: Record<string, string> = {
  active: "#4DFF9D", pending: "#FFD400", inactive: "#737D9D",
};

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });

  const list = brands ?? [];
  const byStatus = list.reduce((acc: Record<string, number>, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1; return acc;
  }, {});
  const bySector = list.reduce((acc: Record<string, number>, b) => {
    const s = b.sector || "Sin sector";
    acc[s] = (acc[s] ?? 0) + 1; return acc;
  }, {});

  return (
    <div>
      <SectionHeader
        title="Marcas / Media"
        subtitle={`${list.length} perfiles registrados`}
      />

      {/* Summary row */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {["active", "pending", "inactive"].map((s) => (
          <div key={s} className="rounded-[16px] border p-4 text-center" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
            <div className="text-[22px] font-black" style={{ color: statusColors[s] }}>{byStatus[s] ?? 0}</div>
            <div className="text-[11px] text-[#737D9D] mt-0.5">{s === "active" ? "Activas" : s === "pending" ? "Pendientes" : "Inactivas"}</div>
          </div>
        ))}
      </div>

      {/* Sector breakdown */}
      {Object.keys(bySector).length > 0 && (
        <AdminCard className="mb-5">
          <h3 className="text-[13px] font-black text-white m-0 mb-3">Por sector</h3>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(bySector).map(([sector, count]) => (
              <span key={sector} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[rgba(68,215,255,.1)] text-[#44D7FF]">
                {sector} · {count}
              </span>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Create form */}
      <details className="mb-6 rounded-[18px] border overflow-hidden" style={{ border: "1px solid rgba(255,212,0,.3)", background: "rgba(23,29,52,.85)" }}>
        <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[18px]">➕</span>
            <span className="text-[14px] font-black text-white">Nueva marca / media</span>
          </div>
          <span className="text-[11px] font-bold rounded-full px-3 py-1" style={{ background: "rgba(255,212,0,.15)", color: "#FFD400" }}>Abrir formulario</span>
        </summary>
        <div className="px-5 pb-5 pt-1 border-t border-[rgba(255,255,255,.08)]">
          <BrandForm action={createBrand} submitLabel="Crear marca" />
        </div>
      </details>

      {/* List */}
      {list.length === 0 ? (
        <AdminCard>
          <p className="text-[13px] text-[#737D9D] text-center py-6">Sin marcas todavía. Crea la primera arriba.</p>
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {list.map((b: any) => (
            <details key={b.id} className="rounded-[18px] border overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
              <summary className="list-none cursor-pointer px-5 py-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-[40px] h-[40px] rounded-[14px] grid place-items-center font-black text-[14px] flex-none" style={{ background: "linear-gradient(135deg,rgba(68,215,255,.3),rgba(255,212,0,.25))" }}>
                  {b.name.charAt(0).toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-[14px] truncate">{b.name}</div>
                  <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                    {b.sector && <span className="text-[11px] text-[#44D7FF]">{b.sector}</span>}
                    {b.contact_email && <span className="text-[11px] text-[#737D9D]">{b.contact_email}</span>}
                    {(b.verticals ?? []).slice(0, 2).map((v: string) => (
                      <span key={v} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(68,215,255,.1)] text-[#44D7FF]">{v}</span>
                    ))}
                  </div>
                </div>
                {/* Status */}
                <div className="flex items-center gap-2 flex-none">
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: `${statusColors[b.status]}18`, color: statusColors[b.status] }}>
                    {b.status}
                  </span>
                  <span className="text-[11px] text-[#737D9D]">Editar ⌄</span>
                </div>
              </summary>

              {/* Edit form */}
              <div className="px-5 pb-5 pt-2 border-t border-[rgba(255,255,255,.08)]">
                <p className="text-[11px] text-[#737D9D] mb-4">Edita los campos y guarda. Los cambios son inmediatos.</p>
                <BrandForm
                  action={updateBrand}
                  defaults={b}
                  submitLabel="Guardar cambios"
                  submitColor="#44D7FF"
                />
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,.06)] flex items-center justify-between">
                  <span className="text-[11px] text-[#737D9D]">
                    Creado {new Date(b.created_at).toLocaleDateString("es-ES")}
                  </span>
                  <DeleteProfileButton id={b.id} type="brand" />
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
