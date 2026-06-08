"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

/* ─── Update user ────────────────────────────────────────────────── */
export async function updateUser(formData: FormData) {
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const first_name = (formData.get("first_name") as string) || null;
  const telegram_handle = (formData.get("telegram_handle") as string) || null;
  const role = (formData.get("role") as string) || null;
  const xp = parseInt(formData.get("xp") as string) || 0;
  const badgesRaw = (formData.get("badges") as string) || "";
  const badges = badgesRaw.split(",").map((b) => b.trim()).filter(Boolean);

  await supabase.from("users").update({
    first_name,
    telegram_handle,
    role,
    xp,
    badges,
  }).eq("id", id);

  revalidatePath("/admin/users");
}

/* ─── Send Telegram message ─────────────────────────────────────── */
export async function sendTelegramMessage(formData: FormData) {
  const telegramId = formData.get("telegram_id") as string;
  const text = formData.get("message") as string;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://ai4brands-teal.vercel.app";

  if (!token || !telegramId || !text) {
    return { error: "Faltan datos" };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: parseInt(telegramId),
      text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "Abrir AI4Brands", web_app: { url: appUrl } },
        ]],
      },
    }),
  });

  const data = await res.json();
  if (!data.ok) return { error: data.description };

  revalidatePath("/admin/users");
  return { ok: true };
}
