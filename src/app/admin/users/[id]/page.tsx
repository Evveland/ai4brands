export const dynamic = "force-dynamic";

import { createServiceClient } from "@/lib/supabase/service";
import { SectionHeader, AdminCard, Table, Tr, Td, StatusPill, RolePill } from "@/components/admin/AdminCard";
import Link from "next/link";
import { approveOrgAction } from "@/lib/supabase/approval-actions";
import { RejectOrgButton } from "@/components/admin/RejectOrgButton";

async function getUserDetail(id: string) {
  const supabase = createServiceClient();

  const [userRes, orgRes, responsesRes, meetingsRes, votesRes, invitesRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", id).single(),
    supabase.from("org_members").select("role_in_org, organizations(*)").eq("user_id", id).maybeSingle(),
    supabase.from("challenge_responses").select("*, challenges(title, type)").eq("startup_id",
      // get startup id from startups table
      (await supabase.from("startups").select("id").eq("user_id", id).maybeSingle()).data?.id ?? "00000000-0000-0000-0000-000000000000"
    ).order("created_at", { ascending: false }),
    supabase.from("meetings").select("*, startups(name)").eq("requester_id", id).order("created_at", { ascending: false }),
    supabase.from("votes").select("*").eq("voter_id", id).order("created_at", { ascending: false }),
    supabase.from("invitations").select("*").eq("inviter_id", id).order("created_at", { ascending: false }),
  ]);

  return {
    user: userRes.data,
    orgMember: orgRes.data,
    responses: responsesRes.data ?? [],
    meetings: meetingsRes.data ?? [],
    votes: votesRes.data ?? [],
    invites: invitesRes.data ?? [],
  };
}

const statusColors: Record<string, string> = { approved: "#4DFF9D", pending: "#FFD400", rejected: "#FF5C7A" };

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, orgMember, responses, meetings, votes, invites } = await getUserDetail(id);

  if (!user) return (
    <div>
      <Link href="/admin/users" className="text-[#FFD400] text-[13px] font-bold no-underline mb-4 block">← Volver a usuarios</Link>
      <AdminCard><p className="text-[#737D9D] text-center py-8">Usuario no encontrado.</p></AdminCard>
    </div>
  );

  const org = orgMember?.organizations as any;
  const totalXP = (user.xp ?? 0);
  const activityScore = responses.length * 500 + meetings.length * 300 + votes.length * 150 + invites.reduce((s: number, i: any) => s + (i.uses ?? 0), 0) * 100;

  return (
    <div>
      <Link href="/admin/users" className="text-[#FFD400] text-[12px] font-bold no-underline mb-4 block">← Todos los usuarios</Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-[56px] h-[56px] rounded-[18px] grid place-items-center font-black text-[22px] flex-none"
          style={{ background: "linear-gradient(135deg,rgba(255,212,0,.3),rgba(68,215,255,.3))" }}>
          {(user.first_name ?? user.telegram_handle ?? "?").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-[22px] font-black text-white m-0">
            {user.first_name ?? "Sin nombre"}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {user.telegram_handle && (
              <span className="font-mono text-[12px]" style={{ color: "#44D7FF" }}>@{user.telegram_handle}</span>
            )}
            <span className="text-[11px] text-[#737D9D]">#{user.telegram_id}</span>
            {user.role && <RolePill role={user.role} />}
          </div>
          <div className="text-[11px] text-[#737D9D] mt-1">
            Registrado {new Date(user.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { label: "XP total", value: totalXP.toLocaleString(), color: "#FFD400" },
          { label: "Propuestas", value: responses.length, color: "#FF4FD8" },
          { label: "Reuniones", value: meetings.length, color: "#44D7FF" },
          { label: "Invitados", value: invites.reduce((s: number, i: any) => s + (i.uses ?? 0), 0), color: "#4DFF9D" },
        ].map(s => (
          <div key={s.label} className="rounded-[16px] border p-3 text-center"
            style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
            <div className="text-[20px] font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-[#737D9D] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {(user.badges ?? []).length > 0 && (
        <AdminCard className="mb-4">
          <div className="text-[12px] font-black text-[#737D9D] uppercase tracking-wider mb-2">Badges ({user.badges.length})</div>
          <div className="flex gap-2 flex-wrap">
            {user.badges.map((b: string) => (
              <span key={b} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[rgba(255,212,0,.12)] text-[#FFD400]">{b}</span>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Organisation */}
      {org && (
        <div className="mb-4">
          <SectionHeader title="Organización" subtitle={`${orgMember?.role_in_org} en ${org.name}`} />
          <div className="rounded-[18px] border p-4"
            style={{ background: "rgba(23,29,52,.85)", border: `1px solid ${org.status === "pending" ? "rgba(255,212,0,.25)" : "rgba(255,255,255,.08)"}` }}>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <div className="font-black text-[15px] text-white">{org.name}</div>
                <div className="flex gap-2 mt-1">
                  <StatusPill status={org.type} />
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: `${statusColors[org.status] ?? "#737D9D"}18`, color: statusColors[org.status] ?? "#737D9D" }}>
                    {org.status}
                  </span>
                </div>
              </div>
              {org.invite_code && (
                <span className="ml-auto font-mono text-[11px] font-black tracking-widest" style={{ color: "#44D7FF" }}>
                  {org.invite_code}
                </span>
              )}
            </div>
            {/* Completed steps */}
            {(org.completed_steps ?? []).length > 0 && (
              <div className="mt-2">
                <div className="text-[10px] font-black text-[#737D9D] uppercase tracking-wider mb-1.5">Pasos completados</div>
                <div className="flex gap-1.5 flex-wrap">
                  {org.completed_steps.map((s: string) => (
                    <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[rgba(77,255,157,.12)] text-[#4DFF9D]">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {org.status === "pending" && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,.06)]">
                <form action={approveOrgAction}>
                  <input type="hidden" name="org_id" value={org.id} />
                  <button type="submit" className="rounded-[10px] px-3 py-1.5 text-[11px] font-black cursor-pointer border-0"
                    style={{ background: "#4DFF9D", color: "#0A1A0F" }}>✓ Aprobar org</button>
                </form>
                <RejectOrgButton orgId={org.id} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Challenge responses */}
      {responses.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Propuestas enviadas" subtitle={`${responses.length} challenges respondidos`} />
          <Table headers={["Challenge", "Tipo", "KPI", "Fecha"]}>
            {responses.map((r: any) => (
              <Tr key={r.id}>
                <Td><span className="font-semibold text-white">{r.challenges?.title ?? "—"}</span></Td>
                <Td>{r.challenges?.type ? <StatusPill status={r.challenges.type} /> : "—"}</Td>
                <Td className="text-[#737D9D]">{r.kpi ?? "—"}</Td>
                <Td className="text-[#737D9D] text-[11px]">{new Date(r.created_at).toLocaleDateString("es-ES")}</Td>
              </Tr>
            ))}
          </Table>
        </div>
      )}

      {/* Meetings */}
      {meetings.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Reuniones solicitadas" subtitle={`${meetings.length} requests`} />
          <Table headers={["Objetivo", "Estado", "Fecha"]}>
            {meetings.map((m: any) => (
              <Tr key={m.id}>
                <Td className="text-white">{m.objective ?? "—"}</Td>
                <Td><StatusPill status={m.status} /></Td>
                <Td className="text-[#737D9D] text-[11px]">{new Date(m.created_at).toLocaleDateString("es-ES")}</Td>
              </Tr>
            ))}
          </Table>
        </div>
      )}

      {/* Votes */}
      {votes.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Votos emitidos" subtitle={`${votes.length} votos`} />
          <Table headers={["Categoría", "Motivo", "Fecha"]}>
            {votes.map((v: any) => (
              <Tr key={v.id}>
                <Td className="text-white text-[12px]">{v.category}</Td>
                <Td className="text-[#737D9D] max-w-[200px]"><span className="line-clamp-1 text-[11px]">{v.reason ?? "—"}</span></Td>
                <Td className="text-[#737D9D] text-[11px]">{new Date(v.created_at).toLocaleDateString("es-ES")}</Td>
              </Tr>
            ))}
          </Table>
        </div>
      )}

      {/* Invitations */}
      {invites.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Invitaciones generadas" subtitle={`${invites.length} links · ${invites.reduce((s: number, i: any) => s + (i.uses ?? 0), 0)} usos totales`} />
          <Table headers={["Tipo", "Usos", "Fecha"]}>
            {invites.map((i: any) => (
              <Tr key={i.id}>
                <Td>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[rgba(68,215,255,.12)] text-[#44D7FF]">
                    {i.ecosystem_tag ?? "—"}
                  </span>
                </Td>
                <Td><span className="font-black" style={{ color: i.uses > 0 ? "#4DFF9D" : "#737D9D" }}>{i.uses ?? 0}</span></Td>
                <Td className="text-[#737D9D] text-[11px]">{new Date(i.created_at).toLocaleDateString("es-ES")}</Td>
              </Tr>
            ))}
          </Table>
        </div>
      )}

      {responses.length === 0 && meetings.length === 0 && votes.length === 0 && invites.length === 0 && (
        <AdminCard>
          <p className="text-[#737D9D] text-[13px] text-center py-4">Sin actividad registrada todavía.</p>
        </AdminCard>
      )}
    </div>
  );
}
