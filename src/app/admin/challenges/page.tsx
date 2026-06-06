import { getChallenges } from "@/lib/supabase/admin-queries";
import { SectionHeader, Table, Tr, Td, StatusPill, AdminCard } from "@/components/admin/AdminCard";
import Link from "next/link";

export default async function ChallengesPage() {
  const challenges = await getChallenges();

  const byType = challenges.reduce((acc: Record<string, number>, c: any) => {
    acc[c.type] = (acc[c.type] ?? 0) + 1;
    return acc;
  }, {});

  const totalResponses = challenges.reduce(
    (sum: number, c: any) => sum + (c.challenge_responses?.length ?? 0),
    0
  );

  return (
    <div>
      <SectionHeader
        title="Challenges"
        subtitle={`${challenges.length} retos publicados · ${totalResponses} propuestas recibidas`}
      />

      {/* Summary row */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {["sponsor", "brand", "agency", "ecosystem"].map((type) => {
          const colors: Record<string, string> = {
            sponsor: "#FFD400", brand: "#44D7FF", agency: "#FF4FD8", ecosystem: "#4DFF9D",
          };
          return (
            <div
              key={type}
              className="rounded-[16px] border p-4 text-center"
              style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(23,29,52,.85)" }}
            >
              <div className="text-[22px] font-black" style={{ color: colors[type] }}>
                {byType[type] ?? 0}
              </div>
              <div className="text-[11px] text-[#737D9D] mt-0.5 capitalize">{type}</div>
            </div>
          );
        })}
      </div>

      {challenges.length === 0 ? (
        <AdminCard>
          <p className="text-[13px] text-[#737D9D] text-center py-6">Sin challenges todavía.</p>
        </AdminCard>
      ) : (
        <Table headers={["Título", "Tipo", "Vertical", "XP", "Propuestas", "Fecha"]}>
          {challenges.map((c: any) => (
            <Tr key={c.id}>
              <Td>
                <span className="font-semibold text-white">{c.title}</span>
                {c.description && (
                  <p className="text-[11px] text-[#737D9D] m-0 mt-0.5 line-clamp-1 max-w-[260px]">
                    {c.description}
                  </p>
                )}
              </Td>
              <Td><StatusPill status={c.type} /></Td>
              <Td>
                {c.vertical ? (
                  <span className="text-[12px] text-[#A9B1CB]">{c.vertical}</span>
                ) : (
                  <span className="text-[#737D9D]">—</span>
                )}
              </Td>
              <Td>
                <span className="font-black text-[#FFD400]">{c.xp_reward}</span>
              </Td>
              <Td>
                <span
                  className="font-black"
                  style={{
                    color: (c.challenge_responses?.length ?? 0) > 0 ? "#4DFF9D" : "#737D9D",
                  }}
                >
                  {c.challenge_responses?.length ?? 0}
                </span>
              </Td>
              <Td className="text-[#737D9D] text-[11px]">
                {new Date(c.created_at).toLocaleDateString("es-ES")}
              </Td>
            </Tr>
          ))}
        </Table>
      )}
    </div>
  );
}
