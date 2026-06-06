import { createClient } from "@/lib/supabase/server";

export async function getStats() {
  const supabase = await createClient();
  const [users, startups, challenges, responses, meetings, votes, recommendations] =
    await Promise.all([
      supabase.from("users").select("id, role, xp", { count: "exact" }),
      supabase.from("startups").select("id", { count: "exact" }),
      supabase.from("challenges").select("id", { count: "exact" }),
      supabase.from("challenge_responses").select("id", { count: "exact" }),
      supabase.from("meetings").select("id, status", { count: "exact" }),
      supabase.from("votes").select("id", { count: "exact" }),
      supabase.from("recommendations").select("id", { count: "exact" }),
    ]);

  const totalXP = (users.data ?? []).reduce((s, u) => s + (u.xp ?? 0), 0);
  const byRole = (users.data ?? []).reduce(
    (acc: Record<string, number>, u) => {
      acc[u.role ?? "unknown"] = (acc[u.role ?? "unknown"] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return {
    users: users.count ?? 0,
    startups: startups.count ?? 0,
    challenges: challenges.count ?? 0,
    responses: responses.count ?? 0,
    meetings: meetings.count ?? 0,
    votes: votes.count ?? 0,
    recommendations: recommendations.count ?? 0,
    totalXP,
    byRole,
  };
}

export async function getUsers(limit = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("xp", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getStartups(limit = 50) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("startups")
    .select("*, users(telegram_handle, first_name)")
    .order("xp", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getChallenges() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("challenges")
    .select("*, challenge_responses(id)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getVotes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("votes")
    .select("*, users(telegram_handle, first_name), startups(name)")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function getMeetings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("meetings")
    .select("*, startups(name)")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}
