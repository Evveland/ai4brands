import { createClient } from "@/lib/supabase/client";

/* ─── User identity ─────────────────────────────────────────────── */

interface TgUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

/** Wait up to `ms` milliseconds for Telegram WebApp to populate initDataUnsafe */
async function waitForTelegramSDK(ms = 1500): Promise<TgUser | null> {
  if (typeof window === "undefined") return null;

  // Already ready
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.initDataUnsafe?.user) return tg.initDataUnsafe.user as TgUser;

  // Not in Telegram at all (e.g. regular browser)
  if (!tg) return null;

  // SDK exists but initDataUnsafe not yet populated — poll briefly
  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const user = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      if (user || Date.now() - start >= ms) {
        clearInterval(interval);
        resolve(user ?? null);
      }
    }, 50);
  });
}

function getOrCreateLocalId(): number {
  if (typeof window === "undefined") return 0;
  let id = localStorage.getItem("ai4brands_uid");
  if (!id) {
    id = String(Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000);
    localStorage.setItem("ai4brands_uid", id);
  }
  return parseInt(id, 10);
}

export async function getOrCreateUser() {
  const supabase = createClient();

  // Wait for real Telegram identity (handles race condition with SDK init)
  const tgUser = await waitForTelegramSDK();
  const telegramId = tgUser?.id ?? getOrCreateLocalId();
  const firstName = tgUser?.first_name ?? null;
  const handle = tgUser?.username ?? null;

  // If we got a real Telegram user, persist their localStorage mapping
  // so future calls without Telegram (dev/web) still find the same record
  if (tgUser?.id && typeof window !== "undefined") {
    localStorage.setItem("ai4brands_uid", String(tgUser.id));
  }

  // Try existing
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (existing) {
    // Update name/handle if they changed
    if (
      (firstName && existing.first_name !== firstName) ||
      (handle && existing.telegram_handle !== handle)
    ) {
      await supabase
        .from("users")
        .update({ first_name: firstName, telegram_handle: handle })
        .eq("id", existing.id);
    }
    return { ...existing, first_name: firstName ?? existing.first_name, telegram_handle: handle ?? existing.telegram_handle };
  }

  // Create new
  const { data: created } = await supabase
    .from("users")
    .insert([{ telegram_id: telegramId, first_name: firstName, telegram_handle: handle }])
    .select()
    .single();

  return created;
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = createClient();
  await supabase.from("users").update({ role }).eq("id", userId);
}

export async function addUserXP(userId: string, amount: number) {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("xp")
    .eq("id", userId)
    .single();
  const newXP = (data?.xp ?? 0) + amount;
  await supabase.from("users").update({ xp: newXP }).eq("id", userId);
  return newXP;
}

export async function addUserBadge(userId: string, badge: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("badges")
    .eq("id", userId)
    .single();
  const badges: string[] = data?.badges ?? [];
  if (badges.includes(badge)) return;
  await supabase
    .from("users")
    .update({ badges: [...badges, badge] })
    .eq("id", userId);
}

/* ─── Startup profile ───────────────────────────────────────────── */

export async function upsertStartup(
  userId: string,
  data: {
    name: string;
    vertical: string;
    one_liner: string;
    ideal_client: string;
  }
) {
  const supabase = createClient();

  // Check existing
  const { data: existing } = await supabase
    .from("startups")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("startups")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data: created } = await supabase
    .from("startups")
    .insert([{ user_id: userId, ...data }])
    .select("id")
    .single();

  return created?.id;
}

/* ─── Challenges ────────────────────────────────────────────────── */

export async function fetchChallenges() {
  const supabase = createClient();
  const { data } = await supabase
    .from("challenges")
    .select("*, challenge_responses(id)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/* ─── Challenge response ────────────────────────────────────────── */

export async function submitChallengeResponse(data: {
  challenge_id: string;
  startup_id: string;
  proposal: string;
  kpi: string;
  demo_link: string;
}) {
  const supabase = createClient();
  await supabase.from("challenge_responses").insert([data]);
}

/* ─── Rankings ──────────────────────────────────────────────────── */

export async function fetchRankings(type: "startup" | "agency" | "brand" | "institutional" = "startup") {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("id, telegram_handle, first_name, xp, role, badges")
    .eq("role", type)
    .order("xp", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function fetchEcosystemRankings() {
  const supabase = createClient();
  // Rankings grouped by ecosystem (institutional users + their invited startups)
  const { data } = await supabase
    .from("users")
    .select("id, telegram_handle, first_name, xp, role")
    .order("xp", { ascending: false })
    .limit(20);
  return data ?? [];
}

/* ─── Meetings ──────────────────────────────────────────────────── */

export async function requestMeeting(data: {
  requester_id: string;
  startup_id?: string;
  objective: string;
  message: string;
}) {
  const supabase = createClient();
  await supabase.from("meetings").insert([data]);
}

/* ─── Votes ─────────────────────────────────────────────────────── */

export async function submitVote(data: {
  voter_id: string;
  category: string;
  startup_id?: string;
  reason: string;
}) {
  const supabase = createClient();
  // upsert by voter+category (unique constraint)
  await supabase
    .from("votes")
    .upsert([data], { onConflict: "voter_id,category" });
}
