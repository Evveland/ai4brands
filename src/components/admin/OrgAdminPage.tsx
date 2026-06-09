import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import { SectionHeader, AdminCard, Table, Tr, Td } from "@/components/admin/AdminCard";
import { approveOrgAction } from "@/lib/supabase/approval-actions";
import { RejectOrgButton } from "@/components/admin/RejectOrgButton";
import { DeleteOrgButton } from "@/components/admin/DeleteOrgButton";
import type { OrgType } from "@/lib/db/orgs";

async function deleteOrgAction(formData: FormData) {
  "use server";
  const supabase = createServiceClient();
  const orgId = formData.get("org_id") as string;
  // org_members cascade-deletes automatically (FK on delete cascade)
  await supabase.from("organizations").delete().eq("id", orgId);
  revalidatePath("/admin");
}

const statusColors: Record<string, string> = {
  approved: "#4DFF9D",
  pending: "#FFD400",
  rejected: "#FF5C7A",
};

const statusLabels: Record<string, string> = {
  approved: "Aprobada",
  pending: "Pendiente",
  rejected: "Rechazada",
};

interface OrgAdminPageProps {
  type: OrgType;
  title: string;
  icon: string;
  emptyMessage: string;
  fieldLabels?: { key: string; label: string }[];
}

export async function OrgAdminPage({ type, title, icon, emptyMessage, fieldLabels = [] }: OrgAdminPageProps) {
  const supabase = createServiceClient();
  const { data: orgs } = await supabase
    .from("organizations")
    .select("*, org_members(id, role_in_org, users(telegram_handle, first_name, xp))")
    .eq("type", type)
    .order("created_at", { ascending: false });

  const list = orgs ?? [];
  const byStatus = list.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1; return acc;
  }, {});

  const defaultFields = [
    { key: "contact_email", label: "Email" },
    { key: "website", label: "Web" },
    { key: "description", label: "Descripción" },
  ];
  const allFields = [...defaultFields, ...fieldLabels];

  return (
    <div>
      <SectionHeader title={`${icon} ${title}`} subtitle={`${list.length} registros`} />

      {/* Status summary */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {["approved","pending","rejected"].map(s => (
          <div key={s} className="rounded-[16px] border p-4 text-center"
            style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
            <div className="text-[26px] font-black" style={{ color: statusColors[s] }}>{byStatus[s] ?? 0}</div>
            <div className="text-[11px] text-[#737D9D] mt-0.5">{statusLabels[s]}</div>
          </div>
        ))}
      </div>

      {list.length === 0 ? (
        <AdminCard>
          <p className="text-[13px] text-[#737D9D] text-center py-8">{emptyMessage}</p>
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {list.map((o: any) => {
            const owner = o.org_members?.find((m: any) => m.role_in_org === "owner");
            const members = o.org_members ?? [];
            return (
              <details key={o.id} className="rounded-[18px] border overflow-hidden"
                style={{ background: "rgba(23,29,52,.85)", border: `1px solid ${o.status === "pending" ? "rgba(255,212,0,.25)" : "rgba(255,255,255,.08)"}` }}>

                {/* Summary row */}
                <summary className="list-none cursor-pointer px-5 py-4 flex items-center gap-3">
                  <div className="w-[44px] h-[44px] rounded-[14px] grid place-items-center font-black text-[18px] flex-none"
                    style={{ background: "rgba(255,255,255,.07)" }}>
                    {o.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-white text-[15px] truncate">{o.name}</div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {o.ecosystem_tag && <span className="text-[11px] text-[#737D9D]">{o.ecosystem_tag}</span>}
                      {o.sector && <span className="text-[11px] text-[#737D9D]">{o.sector}</span>}
                      {o.vertical && <span className="text-[11px] text-[#737D9D]">{o.vertical}</span>}
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: `${statusColors[o.status]}18`, color: statusColors[o.status] }}>
                        {statusLabels[o.status]}
                      </span>
                      <span className="text-[11px] text-[#737D9D]">
                        {members.length} {members.length === 1 ? "miembro" : "miembros"}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#737D9D] flex-none">
                    {new Date(o.created_at).toLocaleDateString("es-ES")}
                  </div>
                </summary>

                {/* Detail */}
                <div className="px-5 pb-5 pt-1 border-t border-[rgba(255,255,255,.08)]">

                  {/* Fields */}
                  <div className="grid gap-1.5 mb-4 mt-3">
                    {allFields.filter(f => o[f.key]).map(f => (
                      <div key={f.key} className="flex gap-2 text-[12px]">
                        <span className="text-[#737D9D] flex-none w-[100px]">{f.label}</span>
                        <span className="text-white break-all">{o[f.key]}</span>
                      </div>
                    ))}
                    {o.specialties?.length > 0 && (
                      <div className="flex gap-2 text-[12px]">
                        <span className="text-[#737D9D] flex-none w-[100px]">Especialidades</span>
                        <span className="text-white">{o.specialties.join(", ")}</span>
                      </div>
                    )}
                    {o.verticals_interest?.length > 0 && (
                      <div className="flex gap-2 text-[12px]">
                        <span className="text-[#737D9D] flex-none w-[100px]">Verticales</span>
                        <span className="text-white">{o.verticals_interest.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Members */}
                  {members.length > 0 && (
                    <div className="mb-4 rounded-[14px] border border-[rgba(255,255,255,.07)] p-3">
                      <div className="text-[11px] font-black text-[#737D9D] uppercase tracking-wider mb-2">Equipo</div>
                      {members.map((m: any) => (
                        <div key={m.id} className="flex items-center gap-2 py-1">
                          <span className="text-[12px] text-white">
                            {m.users?.first_name ?? (m.users?.telegram_handle ? `@${m.users.telegram_handle}` : "Usuario")}
                          </span>
                          <span className="text-[10px] text-[#737D9D]">· {m.role_in_org}</span>
                          {m.users?.xp > 0 && (
                            <span className="text-[10px] font-black text-[#FFD400] ml-auto">{m.users.xp} XP</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Invite code */}
                  {o.invite_code && (
                    <div className="text-[11px] mb-4 text-[#737D9D]">
                      Código invitación: <span className="font-black text-[#44D7FF] tracking-widest">{o.invite_code}</span>
                    </div>
                  )}

                  {/* Approval actions — only for pending */}
                  {o.status === "pending" && (
                    <div className="flex gap-2 items-center flex-wrap pt-2 border-t border-[rgba(255,255,255,.06)]">
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
                  )}
                  {o.status === "rejected" && o.rejection_reason && (
                    <div className="text-[11px] text-[#FF5C7A] pt-2 border-t border-[rgba(255,255,255,.06)]">
                      Motivo: {o.rejection_reason}
                    </div>
                  )}

                  {/* Delete — always visible */}
                  <div className="flex justify-end pt-3 mt-2 border-t border-[rgba(255,255,255,.05)]">
                    <DeleteOrgButton orgId={o.id} orgName={o.name} deleteAction={deleteOrgAction} />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
