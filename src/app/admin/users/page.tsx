import { getUsers } from "@/lib/supabase/admin-queries";
import { SectionHeader, Table, Tr, Td, RolePill } from "@/components/admin/AdminCard";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <SectionHeader
        title="Usuarios"
        subtitle={`${users.length} registros · ordenados por XP`}
      />

      {users.length === 0 ? (
        <div
          className="rounded-[18px] border p-12 text-center"
          style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}
        >
          <div className="text-[40px] mb-3">👥</div>
          <p className="text-[14px] text-[#737D9D] m-0">
            Sin usuarios registrados todavía.
          </p>
          <p className="text-[12px] text-[#737D9D] mt-1 m-0">
            Aparecerán aquí cuando los participantes completen el onboarding desde Telegram.
          </p>
        </div>
      ) : (
        <Table
          headers={["Telegram", "Nombre", "Rol", "XP", "Badges", "Canal", "Grupo", "Registro"]}
        >
          {users.map((u: any) => (
            <Tr key={u.id}>
              <Td>
                <span className="font-mono text-[#44D7FF]">
                  {u.telegram_handle ? `@${u.telegram_handle}` : `#${u.telegram_id}`}
                </span>
              </Td>
              <Td>{u.first_name ?? "—"}</Td>
              <Td>{u.role ? <RolePill role={u.role} /> : <span className="text-[#737D9D]">—</span>}</Td>
              <Td>
                <span className="font-black text-[#FFD400]">
                  {(u.xp ?? 0).toLocaleString()}
                </span>
              </Td>
              <Td>
                <div className="flex gap-1 flex-wrap">
                  {(u.badges ?? []).length === 0 ? (
                    <span className="text-[#737D9D]">—</span>
                  ) : (
                    (u.badges ?? []).slice(0, 3).map((b: string) => (
                      <span
                        key={b}
                        className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold bg-[rgba(255,212,0,.12)] text-[#FFD400]"
                      >
                        {b}
                      </span>
                    ))
                  )}
                  {(u.badges ?? []).length > 3 && (
                    <span className="text-[10px] text-[#737D9D]">+{u.badges.length - 3}</span>
                  )}
                </div>
              </Td>
              <Td>
                <span style={{ color: u.telegram_channel_joined ? "#4DFF9D" : "#737D9D" }}>
                  {u.telegram_channel_joined ? "✓" : "—"}
                </span>
              </Td>
              <Td>
                <span style={{ color: u.telegram_group_joined ? "#4DFF9D" : "#737D9D" }}>
                  {u.telegram_group_joined ? "✓" : "—"}
                </span>
              </Td>
              <Td className="text-[#737D9D] text-[11px]">
                {new Date(u.created_at).toLocaleDateString("es-ES")}
              </Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}
