export const dynamic = "force-dynamic";

import { getUsers } from "@/lib/supabase/admin-queries";
import { SectionHeader } from "@/components/admin/AdminCard";
import { UserRow } from "@/components/admin/UserRow";

export default async function UsersPage() {
  const users = await getUsers(200);

  return (
    <div>
      <SectionHeader
        title="Usuarios"
        subtitle={`${users.length} registros · ordenados por XP`}
      />

      {users.length === 0 ? (
        <div className="rounded-[18px] border p-12 text-center"
          style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}>
          <div className="text-[40px] mb-3">👥</div>
          <p className="text-[14px] text-[#737D9D] m-0">Sin usuarios registrados todavía.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[18px] border" style={{ border: "1px solid rgba(255,255,255,.08)" }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Telegram", "Nombre", "Rol", "XP", "Badges", "Registro", "Acciones"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-wider text-[#737D9D] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <UserRow key={u.id} user={u} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
