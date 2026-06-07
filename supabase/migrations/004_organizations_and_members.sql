-- Organizations (the entity — replaces role-specific tables for the quest flow)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('startup','agency','brand','institutional')) not null,
  name text not null,
  contact_email text,
  website text,
  description text,
  vertical text,
  one_liner text,
  ideal_client text,
  capabilities text[] not null default '{}',
  pilot_30 text,
  pilot_60 text,
  pilot_90 text,
  specialties text[] not null default '{}',
  clients_count integer,
  sector text,
  verticals_interest text[] not null default '{}',
  ecosystem_tag text,
  invite_code text unique,
  status text check (status in ('pending','approved','rejected')) not null default 'pending',
  approved_by uuid references public.users(id),
  approved_at timestamptz,
  rejection_reason text,
  xp integer not null default 0,
  badges text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Members: links users to organizations (many-to-many)
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role_in_org text check (role_in_org in ('owner','admin','member')) not null default 'member',
  status text check (status in ('active','invited','removed')) not null default 'active',
  joined_at timestamptz not null default now(),
  unique (org_id, user_id)
);

alter table public.organizations enable row level security;
alter table public.org_members enable row level security;

create policy "Public orgs read"    on public.organizations for select using (true);
create policy "Anon insert orgs"    on public.organizations for insert with check (true);
create policy "Anon update orgs"    on public.organizations for update using (true);
create policy "Public members read" on public.org_members   for select using (true);
create policy "Anon insert members" on public.org_members   for insert with check (true);
create policy "Anon update members" on public.org_members   for update using (true);

create or replace function generate_invite_code()
returns trigger language plpgsql as $$
begin
  if new.invite_code is null then
    new.invite_code := upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  end if;
  return new;
end;
$$;

create trigger set_invite_code
  before insert on public.organizations
  for each row execute function generate_invite_code();
