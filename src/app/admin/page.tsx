import { getStats, getMeetings } from "@/lib/supabase/admin-queries";
import { StatCard, AdminCard, SectionHeader, Table, Tr, Td, RolePill, StatusPill } from "@/components/admin/AdminCard";

export default async function AdminDashboard() {
  const stats = await getStats();
  const meetings = await getMeetings();

  const statCards = [
    { value: stats.users, label: "Usuarios registrados", icon: "👥", color: "#44D7FF" },
    { value: stats.startups, label: "Startups activas", icon: "🚀", color: "#FFD400" },
    { value: stats.challenges, label: "Challenges publicados", icon: "🎯", color: "#FF4FD8" },
    { value: stats.responses, label: "Propuestas recibidas", icon: "📝", color: "#4DFF9D" },
    { value: stats.meetings, label: "Reuniones solicitadas", icon: "🤝", color: "#FFD400" },
    { value: stats.votes, label: "Votos emitidos", icon: "🗳️", color: "#44D7FF" },
    { value: stats.recommendations, label: "Recomendaciones", icon: "⭐", color: "#4DFF9D" },
    { value: stats.totalXP.toLocaleString(), label: "XP total generado", icon: "⚡", color: "#FF4FD8" },
  ];

  const roleIcons: Record<string, string> = {
    startup: "🚀", agency: "🔎", brand: "🎯", institutional: "🌐", curator: "⚖️",
  };

  return (
    <div>
      <SectionHeader
        title="Dashboard"
        subtitle={`Resumen en tiempo real · ${new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}`}
      />

      {/* Stats grid */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}>
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Role breakdown */}
        <AdminCard>
          <h3 className="text-[15px] font-black m-0 mb-4 text-white">Usuarios por rol</h3>
          {Object.keys(roleIcons).map((role) => {
            const count = stats.byRole[role] ?? 0;
            const pct = stats.users > 0 ? Math.round((count / stats.users) * 100) : 0;
            return (
              <div key={role} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-semibold text-[#A9B1CB]">
                    {roleIcons[role]} {role}
                  </span>
                  <span className="text-[12px] font-black text-white">{count}</span>
                </div>
                <div className="h-[6px] rounded-full bg-[rgba(255,255,255,.07)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg,#FFD400,#44D7FF)",
                    }}
                  />
                </div>
              </div>
            );
          })}
          {stats.users === 0 && (
            <p className="text-[12px] text-[#737D9D] text-center py-4">Sin usuarios todavía</p>
          )}
        </AdminCard>

        {/* Access funnel */}
        <AdminCard>
          <h3 className="text-[15px] font-black m-0 mb-4 text-white">Funnel de acceso</h3>
          {[
            { label: "Candidatos (500+ XP)", value: stats.users, color: "#44D7FF" },
            { label: "Startups con perfil", value: stats.startups, color: "#FFD400" },
            { label: "Propuestas enviadas", value: stats.responses, color: "#FF4FD8" },
            { label: "Reuniones generadas", value: stats.meetings, color: "#4DFF9D" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between border-b border-[rgba(255,255,255,.06)] py-2.5 last:border-0">
              <span className="text-[12px] text-[#A9B1CB]">{f.label}</span>
              <span className="text-[14px] font-black" style={{ color: f.color }}>{f.value}</span>
            </div>
          ))}
        </AdminCard>
      </div>

      {/* Recent meetings */}
      <div className="mt-4">
        <SectionHeader title="Reuniones recientes" subtitle="Últimas solicitudes de conexión entre actores" />
        {meetings.length === 0 ? (
          <AdminCard>
            <p className="text-[13px] text-[#737D9D] text-center py-6">Sin reuniones todavía</p>
          </AdminCard>
        ) : (
          <Table headers={["Startup", "Objetivo", "Estado", "Fecha"]}>
            {meetings.map((m: any) => (
              <Tr key={m.id}>
                <Td><span className="font-semibold">{m.startups?.name ?? "—"}</span></Td>
                <Td className="text-[#737D9D]">{m.objective ?? "—"}</Td>
                <Td><StatusPill status={m.status} /></Td>
                <Td className="text-[#737D9D] text-[11px]">
                  {new Date(m.created_at).toLocaleDateString("es-ES")}
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}
