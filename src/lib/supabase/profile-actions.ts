"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

/* ─── AGENCY ─── */

export async function createAgency(formData: FormData) {
  const supabase = createServiceClient();
  const specialties = (formData.get("specialties") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await supabase.from("agencies").insert([{
    name: formData.get("name"),
    contact_name: formData.get("contact_name") || null,
    contact_email: formData.get("contact_email") || null,
    website: formData.get("website") || null,
    specialties,
    clients_count: parseInt(formData.get("clients_count") as string) || null,
    description: formData.get("description") || null,
    status: formData.get("status") || "pending",
  }]);
  revalidatePath("/admin/agencies");
}

export async function updateAgency(formData: FormData) {
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const specialties = (formData.get("specialties") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await supabase.from("agencies").update({
    name: formData.get("name"),
    contact_name: formData.get("contact_name") || null,
    contact_email: formData.get("contact_email") || null,
    website: formData.get("website") || null,
    specialties,
    clients_count: parseInt(formData.get("clients_count") as string) || null,
    description: formData.get("description") || null,
    status: formData.get("status") || "pending",
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/agencies");
}

export async function deleteAgency(formData: FormData) {
  const supabase = createServiceClient();
  await supabase.from("agencies").delete().eq("id", formData.get("id") as string);
  revalidatePath("/admin/agencies");
}

/* ─── BRAND / MEDIA ─── */

export async function createBrand(formData: FormData) {
  const supabase = createServiceClient();
  const verticals = (formData.get("verticals") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await supabase.from("brands").insert([{
    name: formData.get("name"),
    contact_name: formData.get("contact_name") || null,
    contact_email: formData.get("contact_email") || null,
    website: formData.get("website") || null,
    sector: formData.get("sector") || null,
    verticals,
    description: formData.get("description") || null,
    status: formData.get("status") || "pending",
  }]);
  revalidatePath("/admin/brands");
}

export async function updateBrand(formData: FormData) {
  const supabase = createServiceClient();
  const id = formData.get("id") as string;
  const verticals = (formData.get("verticals") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await supabase.from("brands").update({
    name: formData.get("name"),
    contact_name: formData.get("contact_name") || null,
    contact_email: formData.get("contact_email") || null,
    website: formData.get("website") || null,
    sector: formData.get("sector") || null,
    verticals,
    description: formData.get("description") || null,
    status: formData.get("status") || "pending",
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/brands");
}

export async function deleteBrand(formData: FormData) {
  const supabase = createServiceClient();
  await supabase.from("brands").delete().eq("id", formData.get("id") as string);
  revalidatePath("/admin/brands");
}
