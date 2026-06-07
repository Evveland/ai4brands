import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/login");
}

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/approvals", label: "Aprobaciones", icon: "✅" },
  { href: "/admin/users", label: "Usuarios", icon: "👥" },
  { href: "/admin/startups", label: "Startups", icon: "🚀" },
  { href: "/admin/agencies", label: "Agencias", icon: "🔎" },
  { href: "/admin/brands", label: "Marcas / Media", icon: "🎯" },
  { href: "/admin/challenges", label: "Challenges", icon: "⚡" },
  { href: "/admin/votes", label: "Votos & Awards", icon: "🏆" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "radial-gradient(circle at 15% -10%,rgba(255,212,0,.12),transparent 28%),radial-gradient(circle at 90% 0%,rgba(68,215,255,.10),transparent 25%),#0A0D18",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-[220px] min-h-screen flex-none flex flex-col p-4 border-r"
        style={{
          background: "rgba(18,23,42,.95)",
          borderColor: "rgba(255,255,255,.07)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div
            className="w-[36px] h-[36px] rounded-[12px] grid place-items-center font-black text-[#111] text-[13px]"
            style={{
              background:
                "linear-gradient(135deg,#FFD400,#fff2a3 45%,#44D7FF)",
            }}
          >
            AI
          </div>
          <div>
            <div className="text-[14px] font-black text-white leading-none">
              AI4Brands
            </div>
            <div className="text-[10px] text-[#737D9D] mt-0.5">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-[13px] font-semibold text-[#A9B1CB] hover:bg-[rgba(255,255,255,.06)] hover:text-white transition-colors no-underline"
            >
              <span className="text-[16px]">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <form action={logoutAction} className="mt-4">
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-[13px] font-semibold text-[#737D9D] hover:text-[#FF5C7A] hover:bg-[rgba(255,92,122,.08)] transition-colors cursor-pointer border-0 bg-transparent"
          >
            <span className="text-[16px]">🚪</span>
            Cerrar sesión
          </button>
        </form>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto text-white">{children}</main>
    </div>
  );
}
