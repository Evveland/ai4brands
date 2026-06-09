export const dynamic = "force-dynamic";

import { createServiceClient } from "@/lib/supabase/service";
import { SectionHeader, Table, Tr, Td, AdminCard } from "@/components/admin/AdminCard";
import { revalidatePath } from "next/cache";

async function approveAction(formData: FormData) {
  "use server";
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const xp = parseInt(formData.get("xp") as string);
  const userId = formData.get("user_id") as string;

  await supabase.from("social_actions").update({ status: "approved" }).eq("id", id);

  // XP already awarded on submit — just mark approved
  revalidatePath("/admin/social");
}

async function rejectAction(formData: FormData) {
  "use server";
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const xp = parseInt(formData.get("xp") as string);
  const userId = formData.get("user_id") as string;

  await supabase.from("social_actions").update({ status: "rejected" }).eq("id", id);

  // Revoke XP
  const { data: user } = await supabase.from("users").select("xp").eq("id", userId).single();
  if (user) {
    await supabase.from("users").update({ xp: Math.max(0, (user.xp ?? 0) - xp) }).eq("id", userId);
  }

  revalidatePath("/admin/social");
}

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: "💼", instagram: "📸", youtube: "▶️",
};
const PLATFORM_COLORS: Record<string, string> = {
  linkedin: "#0A66C2", instagram: "#E1306C", youtube: "#FF0000",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "#FFD400", approved: "#4DFF9D", rejected: "#FF5C7A",
};

export default async function SocialAdminPage() {
  const supabase = createServiceClient();
  const { data: actions } = await supabase
    .from("social_actions")
    .select("*, users(telegram_handle, first_name)")
    .order("created_at", { ascending: false })
    .limit(200);

  const list = actions ?? [];
  const byStatus = list.reduce((acc: Record<string, number>, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1; return acc;
  }, {});
  const totalXP = list.filter(a => a.status !== "rejected").reduce((s, a) => s + (a.xp_awarded ?? 0), 0);

  return (
    <div>
      <SectionHeader title="📱 Redes Sociales" subtitle={`${list.length} acciones · ${totalXP.toLocaleString()} XP distribuidos`} />

      {/* Stats */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { label: "Pendientes", count: byStatus["pending"] ?? 0, color: "#FFD400" },
          { label: "Aprobadas", count: byStatus["approved"] ?? 0, color: "#4DFF9D" },
          { label: "Rechazadas", count: byStatus["rejected"] ?? 0, color: "#FF5C7A" },
        ].map(s => (
          <div key={s.label} className="rounded-[16px] border p-4 text-center"
            style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
            <div className="text-[24px] font-black" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[10px] text-[#737D9D] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending first */}
      {(byStatus["pending"] ?? 0) > 0 && (
        <div className="mb-5">
          <SectionHeader title="Pendientes de revisión" subtitle="Verifica el enlace antes de aprobar" />
          <div className="grid gap-3">
            {list.filter(a => a.status === "pending").map((a: any) => (
              <div key={a.id} className="rounded-[18px] border p-4"
                style={{ border: "1px solid rgba(255,212,0,.25)", background: "rgba(23,29,52,.85)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-[36px] h-[36px] rounded-[12px] grid place-items-center text-[18px] flex-none"
                    style={{ background: `${PLATFORM_COLORS[a.platform] ?? "#737D9D"}18` }}>
                    {PLATFORM_ICONS[a.platform] ?? "📱"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[13px] text-white capitalize">
                      {a.platform} · {a.action_type.replace(a.platform + "-", "").replace("-", " ")}
                    </div>
                    <div className="text-[11px] text-[#737D9D] mt-0.5">
                      {a.users?.first_name ?? (a.users?.telegram_handle ? `@${a.users.telegram_handle}` : `Usuario`)}
                      {" · "}{new Date(a.created_at).toLocaleDateString("es-ES")}
                    </div>
                    <a href={a.url} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] font-mono block mt-1 truncate no-underline"
                      style={{ color: PLATFORM_COLORS[a.platform] ?? "#44D7FF" }}>
                      {a.url}
                    </a>
                  </div>
                  <span className="font-black text-[12px]" style={{ color: "#FFD400" }}>+{a.xp_awarded} XP</span>
                </div>
                <div className="flex gap-2">
                  <form action={approveAction} className="flex-1">
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="xp" value={a.xp_awarded} />
                    <input type="hidden" name="user_id" value={a.user_id} />
                    <button type="submit"
                      className="w-full rounded-[10px] py-1.5 text-[11px] font-black cursor-pointer border-0"
                      style={{ background: "#4DFF9D", color: "#0A1A0F" }}>
                      ✓ Aprobar
                    </button>
                  </form>
                  <form action={rejectAction} className="flex-1">
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="xp" value={a.xp_awarded} />
                    <input type="hidden" name="user_id" value={a.user_id} />
                    <button type="submit"
                      className="w-full rounded-[10px] py-1.5 text-[11px] font-black cursor-pointer border border-[rgba(255,92,122,.3)] bg-[rgba(255,92,122,.08)] text-[#FF5C7A]">
                      Rechazar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All actions log */}
      <SectionHeader title="Historial completo" subtitle={`${list.length} acciones`} />
      {list.length === 0 ? (
        <AdminCard><p className="text-[#737D9D] text-[13px] text-center py-6">Sin acciones sociales todavía.</p></AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-[18px] border" style={{ border: "1px solid rgba(255,255,255,.08)" }}>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Usuario","Plataforma","Acción","XP","Estado","Enlace","Fecha"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 font-black text-[10px] uppercase tracking-wider text-[#737D9D] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((a: any) => (
                <tr key={a.id} className="border-b hover:bg-[rgba(255,255,255,.02)]"
                  style={{ borderColor: "rgba(255,255,255,.06)" }}>
                  <Td className="font-semibold text-white">
                    {a.users?.first_name ?? (a.users?.telegram_handle ? `@${a.users.telegram_handle}` : "—")}
                  </Td>
                  <Td>
                    <span className="font-black text-[11px] capitalize" style={{ color: PLATFORM_COLORS[a.platform] ?? "#737D9D" }}>
                      {PLATFORM_ICONS[a.platform]} {a.platform}
                    </span>
                  </Td>
                  <Td className="text-[#A9B1CB] capitalize">{a.action_type.replace(a.platform + "-", "").replace(/-/g, " ")}</Td>
                  <Td><span className="font-black" style={{ color: "#FFD400" }}>+{a.xp_awarded}</span></Td>
                  <Td>
                    <span className="font-black text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: `${STATUS_COLORS[a.status] ?? "#737D9D"}18`, color: STATUS_COLORS[a.status] ?? "#737D9D" }}>
                      {a.status}
                    </span>
                  </Td>
                  <Td>
                    <a href={a.url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] no-underline truncate block max-w-[180px]"
                      style={{ color: "#44D7FF" }}>
                      {a.url.replace("https://", "").slice(0, 40)}…
                    </a>
                  </Td>
                  <Td className="text-[#737D9D] text-[10px] whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString("es-ES")}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
