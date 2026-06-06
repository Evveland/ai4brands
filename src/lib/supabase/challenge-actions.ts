"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function createChallenge(formData: FormData) {
  const supabase = createServiceClient();

  const payload = {
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    vertical: (formData.get("vertical") as string) || null,
    xp_reward: parseInt(formData.get("xp_reward") as string) || 500,
  };

  const { error } = await supabase.from("challenges").insert([payload]);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/challenges");
}

export async function updateChallenge(formData: FormData) {
  const supabase = createServiceClient();
  const id = formData.get("id") as string;

  const payload = {
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    vertical: (formData.get("vertical") as string) || null,
    xp_reward: parseInt(formData.get("xp_reward") as string) || 500,
  };

  const { error } = await supabase
    .from("challenges")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/challenges");
}

export async function deleteChallenge(formData: FormData) {
  const supabase = createServiceClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("challenges").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/challenges");
}
