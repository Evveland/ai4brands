import { createClient } from "@/lib/supabase/client";

export async function completeStep(
  orgId: string,
  userId: string,
  stepId: string,
  xpReward: number,
  orgUpdate?: Record<string, unknown>
) {
  const supabase = createClient();

  // Get current org state
  const { data: org } = await supabase
    .from("organizations")
    .select("completed_steps, xp")
    .eq("id", orgId)
    .single();

  if (!org) return false;

  const already = (org.completed_steps ?? []).includes(stepId);

  // Build update payload
  const update: Record<string, unknown> = {
    ...(orgUpdate ?? {}),
    updated_at: new Date().toISOString(),
  };

  // Only award XP once
  if (!already) {
    update.completed_steps = [...(org.completed_steps ?? []), stepId];
    update.xp = (org.xp ?? 0) + xpReward;
  }

  await supabase.from("organizations").update(update).eq("id", orgId);

  // Also add XP to the user
  if (!already) {
    const { data: user } = await supabase
      .from("users")
      .select("xp")
      .eq("id", userId)
      .single();
    if (user) {
      await supabase.from("users").update({ xp: (user.xp ?? 0) + xpReward }).eq("id", userId);
    }
  }

  return !already; // true = first time completing this step
}

export function isStepDone(completedSteps: string[], stepId: string) {
  return completedSteps?.includes(stepId) ?? false;
}
