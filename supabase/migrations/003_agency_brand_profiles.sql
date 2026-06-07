-- Agency profiles
create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  website text,
  specialties text[] not null default '{}',
  description text,
  clients_count integer,
  status text check (status in ('active','pending','inactive')) not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brand / Media profiles
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  website text,
  sector text,
  verticals text[] not null default '{}',
  description text,
  status text check (status in ('active','pending','inactive')) not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.agencies enable row level security;
alter table public.brands enable row level security;

create policy "Public agencies read" on public.agencies for select using (true);
create policy "Public brands read" on public.brands for select using (true);

create policy "Admin insert agencies" on public.agencies for insert with check (true);
create policy "Admin update agencies" on public.agencies for update using (true);
create policy "Admin delete agencies" on public.agencies for delete using (true);

create policy "Admin insert brands" on public.brands for insert with check (true);
create policy "Admin update brands" on public.brands for update using (true);
create policy "Admin delete brands" on public.brands for delete using (true);
