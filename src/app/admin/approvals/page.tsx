import { fetchPendingOrgs, fetchAllOrgs } from "@/lib/db/orgs";
import { SectionHeader, AdminCard, StatusPill } from "@/components/admin/AdminCard";
import { approveOrgAction } from "@/lib/supabase/approval-actions";
import { RejectOrgButton } from "@/components/admin/RejectOrgButton";

const typeIcons: Record<string, string> = {
  startup: "🚀", agency: "🔎", brand: "🎯", institutional: "🌐",
};
const typeColors: Record<string, string> = {
  startup: "#FFD400", agency: "#FF4FD8", brand: "#44D7FF", institutional: "#4DFF9D",
};

export default async function ApprovalsPage() {
  const [pending, all] = await Promise.all([fetchPendingOrgs(), fetchAllOrgs()]);

  const byStatus = all.reduce((acc: Record<string, number>, o: any) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1; return acc;
  }, {});

  return (
    <div>
      <SectionHeader
        title="Aprobaciones"
        subtitle="Revisa y aprueba las solicitudes de organizaciones"
      />

      {/* Summary */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { label: "Pendientes", count: byStatus["pending"] ?? 0, color: "#FFD400" },
          { label: "Aprobadas", count: byStatus["approved"] ?? 0, color: "#4DFF9D" },
          { label: "Rechazadas", count: byStatus["rejected"] ?? 0, color: "#FF5C7A" },
        ].map(s => (
          <div key={s.label} className="rounded-[16px] border p-4 text-center"
            style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
            <div className="text-[26px] font-black" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[11px] text-[#737D9D] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending */}
      <SectionHeader title="Pendientes de revisión" subtitle={`${pending.length} solicitudes esperando aprobación`} />

      {pending.length === 0 ? (
        <AdminCard className="mb-6">
          <p className="text-[13px] text-[#737D9D] text-center py-4">
            ✅ Sin solicitudes pendientes.
          </p>
        </AdminCard>
      ) : (
        <div className="grid gap-3 mb-6">
          {pending.map((o: any) => {
            const owner = o.org_members?.find((m: any) => m.role_in_org === "owner");
            return (
              <div key={o.id} className="rounded-[18px] border p-5"
                style={{ background: "rgba(23,29,52,.85)", border: "1px solid rgba(255,212,0,.25)" }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-[44px] h-[44px] rounded-[14px] grid place-items-center text-[22px] flex-none"
                    style={{ background: `${typeColors[o.type] ?? "#FFD400"}18` }}>
                    {typeIcons[o.type] ?? "🏢"}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-white text-[16px]">{o.name}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <StatusPill status={o.type} />
                      {o.vertical && <span className="text-[11px] text-[#737D9D]">{o.vertical}</span>}
                      {o.sector && <span className="text-[11px] text-[#737D9D]">{o.sector}</span>}
                      {o.ecosystem_tag && <span className="text-[11px] text-[#737D9D]">{o.ecosystem_tag}</span>}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#737D9D] flex-none">
                    {new Date(o.created_at).toLocaleDateString("es-ES")}
                  </div>
                </div>

                {/* Details */}
                <div className="grid gap-1.5 mb-4">
                  {[
                    { label: "Contacto", value: o.contact_email },
                    { label: "Web", value: o.website },
                    { label: "Pitch", value: o.one_liner },
                    { label: "Descripción", value: o.description },
                    { label: "Especialidades", value: o.specialties?.join(", ") },
                    { label: "Responsable", value: owner?.users ? `${owner.users.first_name ?? ""} ${owner.users.telegram_handle ? `@${owner.users.telegram_handle}` : ""}`.trim() : null },
                    { label: "Miembros", value: `${o.org_members?.length ?? 0} persona${(o.org_members?.length ?? 0) !== 1 ? "s" : ""}` },
                  ].filter(r => r.value).map(r => (
                    <div key={r.label} className="flex gap-2 text-[12px]">
                      <span className="text-[#737D9D] flex-none w-[90px]">{r.label}</span>
                      <span className="text-white">{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center flex-wrap">
                  <form action={approveOrgAction}>
                    <input type="hidden" name="org_id" value={o.id} />
                    <button type="submit"
                      className="rounded-[12px] px-4 py-2 text-[12px] font-black cursor-pointer border-0"
                      style={{ background: "#4DFF9D", color: "#0A1A0F" }}>
                      ✓ Aprobar
                    </button>
                  </form>
                  <RejectOrgButton orgId={o.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All orgs log */}
      <SectionHeader title="Historial completo" subtitle={`${all.length} organizaciones registradas`} />
      <div className="overflow-x-auto rounded-[18px] border" style={{ border: "1px solid rgba(255,255,255,.08)" }}>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              {["Nombre", "Tipo", "Estado", "Miembros", "Fecha"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-black text-[11px] uppercase tracking-wider text-[#737D9D]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {all.map((o: any) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-[rgba(255,255,255,.03)]"
                style={{ borderColor: "rgba(255,255,255,.06)" }}>
                <td className="px-4 py-3 font-semibold text-white">{o.name}</td>
                <td className="px-4 py-3"><StatusPill status={o.type} /></td>
                <td className="px-4 py-3">
                  <span className="font-black text-[11px] px-2.5 py-1 rounded-full"
                    style={{
                      background: o.status === "approved" ? "rgba(77,255,157,.15)" : o.status === "rejected" ? "rgba(255,92,122,.15)" : "rgba(255,212,0,.15)",
                      color: o.status === "approved" ? "#4DFF9D" : o.status === "rejected" ? "#FF5C7A" : "#FFD400",
                    }}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#737D9D]">{o.org_members?.length ?? 0}</td>
                <td className="px-4 py-3 text-[#737D9D] text-[11px]">
                  {new Date(o.created_at).toLocaleDateString("es-ES")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
