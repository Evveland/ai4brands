import { createClient } from "@/lib/supabase/client";
import { createServiceClient } from "@/lib/supabase/service";

/* ─── Types ──────────────────────────────────────────────────────── */

export type OrgType = "startup" | "agency" | "brand" | "institutional";
export type OrgStatus = "pending" | "approved" | "rejected";
export type OrgRole = "owner" | "admin" | "member";

export interface Organization {
  id: string;
  type: OrgType;
  name: string;
  contact_email: string | null;
  website: string | null;
  description: string | null;
  vertical: string | null;
  one_liner: string | null;
  ideal_client: string | null;
  capabilities: string[];
  pilot_30: string | null;
  pilot_60: string | null;
  pilot_90: string | null;
  specialties: string[];
  clients_count: number | null;
  sector: string | null;
  verticals_interest: string[];
  ecosystem_tag: string | null;
  invite_code: string | null;
  status: OrgStatus;
  rejection_reason: string | null;
  xp: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role_in_org: OrgRole;
  status: string;
  joined_at: string;
}

/* ─── Get org for a user ─────────────────────────────────────────── */

export async function getUserOrg(userId: string): Promise<(Organization & { role_in_org: OrgRole }) | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("org_members")
    .select("role_in_org, organizations(*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!data) return null;
  return { ...(data.organizations as unknown as Organization), role_in_org: data.role_in_org };
}

/* ─── Create org + make user owner ──────────────────────────────── */

export async function createOrg(
  userId: string,
  payload: Partial<Organization> & { type: OrgType; name: string }
): Promise<Organization> {
  const supabase = createClient();

  const { data: org, error } = await supabase
    .from("organizations")
    .insert([payload])
    .select()
    .single();

  if (error || !org) throw new Error(error?.message ?? "Failed to create org");

  // Make requester the owner
  await supabase.from("org_members").insert([{
    org_id: org.id,
    user_id: userId,
    role_in_org: "owner",
    status: "active",
  }]);

  return org as Organization;
}

/* ─── Update org data ────────────────────────────────────────────── */

export async function updateOrg(orgId: string, payload: Partial<Organization>) {
  const supabase = createClient();
  await supabase
    .from("organizations")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", orgId);
}

/* ─── Join org by invite code ────────────────────────────────────── */

export async function joinOrgByCode(
  userId: string,
  code: string
): Promise<Organization | null> {
  const supabase = createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("invite_code", code.toUpperCase().trim())
    .maybeSingle();

  if (!org) return null;

  // Insert member (ignore conflict if already member)
  await supabase.from("org_members").upsert([{
    org_id: org.id,
    user_id: userId,
    role_in_org: "member",
    status: "active",
  }], { onConflict: "org_id,user_id" });

  return org as Organization;
}

/* ─── Get org members ────────────────────────────────────────────── */

export async function getOrgMembers(orgId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("org_members")
    .select("*, users(telegram_handle, first_name, xp, role)")
    .eq("org_id", orgId)
    .eq("status", "active")
    .order("joined_at");
  return data ?? [];
}

/* ─── Admin: fetch pending orgs ─────────────────────────────────── */

export async function fetchPendingOrgs() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("organizations")
    .select("*, org_members(id, role_in_org, users(telegram_handle, first_name))")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function fetchAllOrgs() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("organizations")
    .select("*, org_members(id)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/* ─── Admin: approve / reject ────────────────────────────────────── */

export async function approveOrg(orgId: string, adminUserId: string) {
  const supabase = createServiceClient();
  await supabase.from("organizations").update({
    status: "approved",
    approved_by: adminUserId,
    approved_at: new Date().toISOString(),
    rejection_reason: null,
  }).eq("id", orgId);
}

export async function rejectOrg(orgId: string, reason: string) {
  const supabase = createServiceClient();
  await supabase.from("organizations").update({
    status: "rejected",
    rejection_reason: reason,
  }).eq("id", orgId);
}
