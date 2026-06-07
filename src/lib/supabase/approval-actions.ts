"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function approveOrgAction(formData: FormData) {
  const supabase = createServiceClient();
  const orgId = formData.get("org_id") as string;
  await supabase.from("organizations").update({
    status: "approved",
    approved_at: new Date().toISOString(),
    rejection_reason: null,
  }).eq("id", orgId);
  revalidatePath("/admin/approvals");
  revalidatePath("/admin");
}

export async function rejectOrgAction(formData: FormData) {
  const supabase = createServiceClient();
  const orgId = formData.get("org_id") as string;
  const reason = formData.get("reason") as string;
  await supabase.from("organizations").update({
    status: "rejected",
    rejection_reason: reason || "No cumple los requisitos actuales.",
  }).eq("id", orgId);
  revalidatePath("/admin/approvals");
  revalidatePath("/admin");
}
