import { getVotes } from "@/lib/supabase/admin-queries";
import { SectionHeader, Table, Tr, Td, AdminCard } from "@/components/admin/AdminCard";

export default async function VotesPage() {
  const votes = await getVotes();

  // Tally by category + startup
  const tally: Record<string, Record<string, number>> = {};
  for (const v of votes as any[]) {
    const cat = v.category ?? "Sin categoría";
    const name = v.startups?.name ?? "Startup desconocida";
    if (!tally[cat]) tally[cat] = {};
    tally[cat][name] = (tally[cat][name] ?? 0) + 1;
  }

  return (
    <div>
      <SectionHeader
        title="Votos & Awards"
        subtitle={`${votes.length} votos emitidos en total`}
      />

      {/* Tally by category */}
      {Object.keys(tally).length > 0 && (
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))" }}>
          {Object.entries(tally).map(([category, startupVotes]) => {
            const sorted = Object.entries(startupVotes).sort((a, b) => b[1] - a[1]);
            const max = sorted[0]?.[1] ?? 1;
            return (
              <AdminCard key={category}>
                <h3 className="text-[13px] font-black text-white m-0 mb-3">{category}</h3>
                {sorted.map(([name, count]) => (
                  <div key={name} className="mb-2.5">
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-[#A9B1CB]">{name}</span>
                      <span className="font-black text-[#FFD400]">{count}</span>
                    </div>
                    <div className="h-[5px] rounded-full bg-[rgba(255,255,255,.07)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / max) * 100}%`,
                          background: "linear-gradient(90deg,#FFD400,#44D7FF)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* Raw vote log */}
      <SectionHeader title="Registro de votos" subtitle="Log completo de votación" />
      {votes.length === 0 ? (
        <AdminCard>
          <p className="text-[13px] text-[#737D9D] text-center py-6">
            Sin votos todavía. Estarán disponibles cuando los usuarios empiecen a votar.
          </p>
        </AdminCard>
      ) : (
        <Table headers={["Usuario", "Categoría", "Startup votada", "Motivo", "Fecha"]}>
          {(votes as any[]).map((v) => (
            <Tr key={v.id}>
              <Td>
                <span className="font-mono text-[#44D7FF] text-[12px]">
                  {v.users?.telegram_handle
                    ? `@${v.users.telegram_handle}`
                    : v.users?.first_name ?? "—"}
                </span>
              </Td>
              <Td className="text-[12px]">{v.category}</Td>
              <Td>
                <span className="font-semibold text-white">
                  {v.startups?.name ?? "—"}
                </span>
              </Td>
              <Td className="text-[#737D9D] max-w-[200px]">
                <span className="line-clamp-1 text-[12px]">{v.reason ?? "—"}</span>
              </Td>
              <Td className="text-[#737D9D] text-[11px]">
                {new Date(v.created_at).toLocaleDateString("es-ES")}
              </Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}
