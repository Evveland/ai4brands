import { createClient } from "@/lib/supabase/server";
import { SectionHeader, AdminCard, StatusPill } from "@/components/admin/AdminCard";
import { createAgency, updateAgency } from "@/lib/supabase/profile-actions";
import { DeleteProfileButton } from "@/components/admin/DeleteProfileButton";

const inputCls =
  "w-full rounded-[12px] border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.06)] px-3 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(255,212,0,.5)] transition-colors font-sans";
const labelCls =
  "block text-[11px] font-bold text-[#737D9D] uppercase tracking-wider mb-1.5";

const specialtyOptions = [
  "Content AI", "Customer Experience", "Data & Insights",
  "Loyalty & Gamification", "Retail Media", "Automation",
  "Creator Economy", "Performance", "Brand Strategy",
];

function AgencyForm({
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
          <label className={labelCls}>Nombre de la agencia *</label>
          <input
            type="text" name="name" required
            defaultValue={defaults?.name ?? ""}
            placeholder="Ej: Yellow Strategy Team"
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

      {/* Row 2: contact name + email */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label className={labelCls}>Persona de contacto</label>
          <input type="text" name="contact_name" defaultValue={defaults?.contact_name ?? ""} placeholder="Nombre Apellido" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" name="contact_email" defaultValue={defaults?.contact_email ?? ""} placeholder="contacto@agencia.com" className={inputCls} />
        </div>
      </div>

      {/* Row 3: website + clients */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr auto" }}>
        <div>
          <label className={labelCls}>Web</label>
          <input type="url" name="website" defaultValue={defaults?.website ?? ""} placeholder="https://agencia.com" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Nº clientes</label>
          <input type="number" name="clients_count" defaultValue={defaults?.clients_count ?? ""} placeholder="0" min={0} className={inputCls} style={{ width: "90px" }} />
        </div>
      </div>

      {/* Specialties */}
      <div>
        <label className={labelCls}>Especialidades <span className="normal-case font-normal">(separadas por coma)</span></label>
        <input
          type="text" name="specialties"
          defaultValue={(defaults?.specialties ?? []).join(", ")}
          placeholder="Content AI, Customer Experience, Data & Insights"
          className={inputCls}
        />
        <div className="flex gap-1.5 flex-wrap mt-2">
          {specialtyOptions.map((s) => (
            <span key={s} className="text-[10px] px-2 py-1 rounded-full border border-[rgba(255,255,255,.1)] text-[#737D9D]">{s}</span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Descripción</label>
        <textarea name="description" rows={3} defaultValue={defaults?.description ?? ""} placeholder="Breve descripción de la agencia…" className={`${inputCls} resize-y`} />
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

export default async function AgenciesPage() {
  const supabase = await createClient();
  const { data: agencies } = await supabase
    .from("agencies")
    .select("*")
    .order("created_at", { ascending: false });

  const list = agencies ?? [];
  const byStatus = list.reduce((acc: Record<string, number>, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1; return acc;
  }, {});

  return (
    <div>
      <SectionHeader
        title="Agencias"
        subtitle={`${list.length} perfiles registrados`}
      />

      {/* Status summary */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {["active", "pending", "inactive"].map((s) => (
          <div key={s} className="rounded-[16px] border p-4 text-center" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
            <div className="text-[22px] font-black" style={{ color: statusColors[s] }}>{byStatus[s] ?? 0}</div>
            <div className="text-[11px] text-[#737D9D] mt-0.5 capitalize">{s === "active" ? "Activas" : s === "pending" ? "Pendientes" : "Inactivas"}</div>
          </div>
        ))}
      </div>

      {/* Create form */}
      <details className="mb-6 rounded-[18px] border overflow-hidden" style={{ border: "1px solid rgba(255,212,0,.3)", background: "rgba(23,29,52,.85)" }}>
        <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[18px]">➕</span>
            <span className="text-[14px] font-black text-white">Nueva agencia</span>
          </div>
          <span className="text-[11px] font-bold rounded-full px-3 py-1" style={{ background: "rgba(255,212,0,.15)", color: "#FFD400" }}>Abrir formulario</span>
        </summary>
        <div className="px-5 pb-5 pt-1 border-t border-[rgba(255,255,255,.08)]">
          <AgencyForm action={createAgency} submitLabel="Crear agencia" />
        </div>
      </details>

      {/* List */}
      {list.length === 0 ? (
        <AdminCard>
          <p className="text-[13px] text-[#737D9D] text-center py-6">Sin agencias todavía. Crea la primera arriba.</p>
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {list.map((a: any) => (
            <details key={a.id} className="rounded-[18px] border overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
              <summary className="list-none cursor-pointer px-5 py-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-[40px] h-[40px] rounded-[14px] grid place-items-center font-black text-[14px] flex-none" style={{ background: "linear-gradient(135deg,rgba(255,79,216,.3),rgba(68,215,255,.3))" }}>
                  {a.name.charAt(0).toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-[14px] truncate">{a.name}</div>
                  <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                    {a.contact_email && <span className="text-[11px] text-[#44D7FF]">{a.contact_email}</span>}
                    {(a.specialties ?? []).slice(0, 2).map((s: string) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,79,216,.12)] text-[#FF4FD8]">{s}</span>
                    ))}
                    {(a.specialties ?? []).length > 2 && (
                      <span className="text-[10px] text-[#737D9D]">+{a.specialties.length - 2}</span>
                    )}
                  </div>
                </div>
                {/* Status + hint */}
                <div className="flex items-center gap-2 flex-none">
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: `${statusColors[a.status]}18`, color: statusColors[a.status] }}>
                    {a.status}
                  </span>
                  <span className="text-[11px] text-[#737D9D]">Editar ⌄</span>
                </div>
              </summary>

              {/* Edit form */}
              <div className="px-5 pb-5 pt-2 border-t border-[rgba(255,255,255,.08)]">
                <p className="text-[11px] text-[#737D9D] mb-4">Edita los campos y guarda. Los cambios son inmediatos.</p>
                <AgencyForm
                  action={updateAgency}
                  defaults={a}
                  submitLabel="Guardar cambios"
                  submitColor="#44D7FF"
                />
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,.06)] flex items-center justify-between">
                  <span className="text-[11px] text-[#737D9D]">
                    Creado {new Date(a.created_at).toLocaleDateString("es-ES")}
                    {a.clients_count ? ` · ${a.clients_count} clientes` : ""}
                  </span>
                  <DeleteProfileButton id={a.id} type="agency" />
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
