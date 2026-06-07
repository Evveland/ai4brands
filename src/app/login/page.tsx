import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function loginAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const from = (formData.get("from") as string) || "/admin";

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // Env var not configured — deny all
    redirect(`/login?error=config&from=${encodeURIComponent(from)}`);
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    redirect(from);
  }

  redirect(`/login?error=1&from=${encodeURIComponent(from)}`);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;
  const from = params.from || "/admin";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(circle at 15% -10%,rgba(255,212,0,.24),transparent 28%),radial-gradient(circle at 90% 0%,rgba(68,215,255,.22),transparent 25%),radial-gradient(circle at 20% 100%,rgba(255,79,216,.14),transparent 30%),#0A0D18",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div
            className="w-[48px] h-[48px] rounded-[16px] grid place-items-center font-black text-[#111] text-[18px]"
            style={{
              background: "linear-gradient(135deg,#FFD400,#fff2a3 45%,#44D7FF)",
              boxShadow: "0 8px 25px rgba(255,212,0,.3)",
            }}
          >
            AI
          </div>
          <div>
            <h1 className="text-[18px] font-black m-0 tracking-tight" style={{ color: "white" }}>
              AI4Brands
            </h1>
            <p className="text-[12px] m-0 mt-0.5" style={{ color: "#A9B1CB" }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-[24px] p-6"
          style={{
            background: "rgba(23,29,52,.95)",
            border: "1px solid rgba(255,255,255,.09)",
            boxShadow: "0 18px 60px rgba(0,0,0,.45)",
          }}
        >
          <h2 className="text-[20px] font-black tracking-tight m-0 mb-1" style={{ color: "white" }}>
            Acceso restringido
          </h2>
          <p className="text-[13px] m-0 mb-5" style={{ color: "#A9B1CB" }}>
            Introduce la contraseña de administrador para continuar.
          </p>

          {params.error === "1" && (
            <div
              className="mb-4 rounded-[14px] px-4 py-3 text-[13px] font-semibold"
              style={{
                border: "1px solid rgba(255,92,122,.3)",
                background: "rgba(255,92,122,.1)",
                color: "#FF5C7A",
              }}
            >
              Contraseña incorrecta. Inténtalo de nuevo.
            </div>
          )}
          {params.error === "config" && (
            <div
              className="mb-4 rounded-[14px] px-4 py-3 text-[13px] font-semibold"
              style={{
                border: "1px solid rgba(255,92,122,.3)",
                background: "rgba(255,92,122,.1)",
                color: "#FF5C7A",
              }}
            >
              ADMIN_PASSWORD no está configurado en el servidor.
            </div>
          )}

          <form action={loginAction}>
            <input type="hidden" name="from" value={from} />

            <label
              className="block text-[12px] mb-2"
              style={{ color: "#A9B1CB" }}
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="w-full rounded-[14px] px-4 py-3 text-[14px] outline-none mb-4 transition-colors"
              style={{
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.1)",
                color: "white",
              }}
              placeholder="••••••••"
            />
            <button
              type="submit"
              className="w-full rounded-[16px] py-3 font-black text-[14px] text-[#10131F] cursor-pointer border-0"
              style={{
                background: "#FFD400",
                boxShadow: "0 10px 25px rgba(255,212,0,.25)",
              }}
            >
              Entrar al panel
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] mt-4" style={{ color: "#737D9D" }}>
          Solo acceso autorizado por Yellow.
        </p>
      </div>
    </div>
  );
}
