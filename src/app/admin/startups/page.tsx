import { getStartups } from "@/lib/supabase/admin-queries";
import { SectionHeader, Table, Tr, Td } from "@/components/admin/AdminCard";

export default async function StartupsPage() {
  const startups = await getStartups();

  return (
    <div>
      <SectionHeader
        title="Startups"
        subtitle={`${startups.length} perfiles · ordenados por XP`}
      />

      {startups.length === 0 ? (
        <div
          className="rounded-[18px] border p-12 text-center"
          style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}
        >
          <div className="text-[40px] mb-3">🚀</div>
          <p className="text-[14px] text-[#737D9D] m-0">Sin startups registradas todavía.</p>
          <p className="text-[12px] text-[#737D9D] mt-1 m-0">
            Aparecerán aquí cuando los participantes completen su perfil.
          </p>
        </div>
      ) : (
        <Table
          headers={["Startup", "Vertical", "One-liner", "Capacidades", "XP", "Badges", "Piloto", "Registro"]}
        >
          {startups.map((s: any) => (
            <Tr key={s.id}>
              <Td>
                <div className="font-semibold text-white">{s.name}</div>
                {s.users?.telegram_handle && (
                  <div className="text-[11px] text-[#44D7FF] mt-0.5">
                    @{s.users.telegram_handle}
                  </div>
                )}
              </Td>
              <Td>
                {s.vertical ? (
                  <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black bg-[rgba(68,215,255,.12)] text-[#44D7FF]">
                    {s.vertical}
                  </span>
                ) : (
                  <span className="text-[#737D9D]">—</span>
                )}
              </Td>
              <Td className="text-[#A9B1CB] max-w-[200px]">
                <span className="line-clamp-2 text-[12px]">{s.one_liner ?? "—"}</span>
              </Td>
              <Td>
                <div className="flex gap-1 flex-wrap">
                  {(s.capabilities ?? []).slice(0, 2).map((c: string) => (
                    <span key={c} className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold bg-[rgba(255,79,216,.12)] text-[#FF4FD8]">
                      {c}
                    </span>
                  ))}
                  {(s.capabilities ?? []).length > 2 && (
                    <span className="text-[10px] text-[#737D9D]">+{s.capabilities.length - 2}</span>
                  )}
                </div>
              </Td>
              <Td>
                <span className="font-black text-[#FFD400]">{(s.xp ?? 0).toLocaleString()}</span>
              </Td>
              <Td>
                <div className="flex gap-1 flex-wrap">
                  {(s.badges ?? []).slice(0, 2).map((b: string) => (
                    <span key={b} className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold bg-[rgba(255,212,0,.12)] text-[#FFD400]">
                      {b}
                    </span>
                  ))}
                </div>
              </Td>
              <Td>
                <span style={{ color: s.pilot_30 ? "#4DFF9D" : "#737D9D" }}>
                  {s.pilot_30 ? "✓ Completo" : "Pendiente"}
                </span>
              </Td>
              <Td className="text-[#737D9D] text-[11px]">
                {new Date(s.created_at).toLocaleDateString("es-ES")}
              </Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}
