import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function loginAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const from = formData.get("from") as string;

  if (password === process.env.ADMIN_SECRET) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", process.env.ADMIN_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    redirect(from || "/admin");
  }

  redirect(`/admin/login?error=1&from=${from || "/admin"}`);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(circle at 15% -10%,rgba(255,212,0,.24),transparent 28%),radial-gradient(circle at 90% 0%,rgba(68,215,255,.22),transparent 25%),#0A0D18",
      }}
    >
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div
            className="w-[48px] h-[48px] rounded-[16px] grid place-items-center font-black text-[#111] text-[18px] shadow-[0_8px_25px_rgba(255,212,0,.3)]"
            style={{
              background: "linear-gradient(135deg,#FFD400,#fff2a3 45%,#44D7FF)",
            }}
          >
            AI
          </div>
          <div>
            <h1 className="text-[18px] font-black m-0 tracking-tight text-white">
              AI4Brands
            </h1>
            <p className="text-[12px] text-[#A9B1CB] m-0">Admin Panel</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-[24px] border p-6"
          style={{
            background: "rgba(23,29,52,.9)",
            border: "1px solid rgba(255,255,255,.09)",
            boxShadow: "0 18px 60px rgba(0,0,0,.4)",
          }}
        >
          <h2 className="text-[20px] font-black tracking-tight m-0 mb-1 text-white">
            Acceso restringido
          </h2>
          <p className="text-[13px] text-[#A9B1CB] m-0 mb-5">
            Introduce la clave de administrador para continuar.
          </p>

          {params.error && (
            <div className="mb-4 rounded-[14px] border border-[rgba(255,92,122,.3)] bg-[rgba(255,92,122,.1)] px-4 py-3 text-[13px] text-[#FF5C7A] font-semibold">
              Clave incorrecta. Inténtalo de nuevo.
            </div>
          )}

          <form action={loginAction}>
            <input type="hidden" name="from" value={params.from || "/admin"} />
            <label className="block text-[12px] text-[#A9B1CB] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              className="w-full rounded-[14px] border border-[rgba(255,255,255,.09)] bg-[rgba(255,255,255,.06)] px-4 py-3 text-white text-[14px] outline-none focus:border-[rgba(255,212,0,.5)] transition-colors mb-4"
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

        <p className="text-center text-[11px] text-[#737D9D] mt-4">
          Solo acceso autorizado por Yellow.
        </p>
      </div>
    </div>
  );
}
