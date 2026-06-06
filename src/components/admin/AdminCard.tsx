export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[18px] border p-5 ${className}`}
      style={{
        background: "rgba(23,29,52,.85)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      {children}
    </div>
  );
}

export function StatCard({
  value,
  label,
  icon,
  color = "#FFD400",
}: {
  value: string | number;
  label: string;
  icon: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-[18px] border p-4 flex items-center gap-3"
      style={{
        background: "rgba(23,29,52,.85)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        className="w-[42px] h-[42px] rounded-[14px] grid place-items-center text-[20px] flex-none"
        style={{ background: `${color}20` }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[22px] font-black leading-none" style={{ color }}>
          {value}
        </div>
        <div className="text-[11px] text-[#737D9D] mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-[20px] font-black tracking-tight m-0 text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[12px] text-[#737D9D] m-0 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-[18px] border" style={{ border: "1px solid rgba(255,255,255,.08)" }}>
      <table className="w-full text-[13px]">
        <thead>
          <tr style={{ background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-black text-[11px] uppercase tracking-wider text-[#737D9D]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, dimmed }: { children: React.ReactNode; dimmed?: boolean }) {
  return (
    <tr
      className="border-b last:border-0 hover:bg-[rgba(255,255,255,.03)] transition-colors"
      style={{
        borderColor: "rgba(255,255,255,.06)",
        opacity: dimmed ? 0.5 : 1,
      }}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-[#DCE3FF] ${className}`}>{children}</td>
  );
}

export function RolePill({ role }: { role: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    startup: { bg: "rgba(255,212,0,.15)", text: "#FFD400" },
    agency: { bg: "rgba(255,79,216,.15)", text: "#FF4FD8" },
    brand: { bg: "rgba(68,215,255,.15)", text: "#44D7FF" },
    institutional: { bg: "rgba(77,255,157,.15)", text: "#4DFF9D" },
    curator: { bg: "rgba(255,92,122,.15)", text: "#FF5C7A" },
  };
  const c = colors[role] ?? { bg: "rgba(255,255,255,.08)", text: "#A9B1CB" };
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black"
      style={{ background: c.bg, color: c.text }}
    >
      {role}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(255,212,0,.15)", text: "#FFD400" },
    accepted: { bg: "rgba(77,255,157,.15)", text: "#4DFF9D" },
    declined: { bg: "rgba(255,92,122,.15)", text: "#FF5C7A" },
    sponsor: { bg: "rgba(255,212,0,.15)", text: "#FFD400" },
    brand: { bg: "rgba(68,215,255,.15)", text: "#44D7FF" },
    agency: { bg: "rgba(255,79,216,.15)", text: "#FF4FD8" },
    ecosystem: { bg: "rgba(77,255,157,.15)", text: "#4DFF9D" },
  };
  const c = colors[status] ?? { bg: "rgba(255,255,255,.08)", text: "#A9B1CB" };
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}
