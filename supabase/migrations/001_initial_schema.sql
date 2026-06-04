-- AI4Brands Innovation League — Initial Schema

-- Users / participants
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint unique not null,
  telegram_handle text,
  first_name text,
  role text check (role in ('startup','agency','brand','institutional','curator')),
  xp integer not null default 0,
  badges text[] not null default '{}',
  telegram_channel_joined boolean not null default false,
  telegram_group_joined boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Startup profiles
create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  one_liner text,
  vertical text,
  capabilities text[] not null default '{}',
  tech_stack text,
  ideal_client text,
  pilot_30 text,
  pilot_60 text,
  pilot_90 text,
  xp integer not null default 0,
  badges text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Challenges
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('brand','agency','sponsor','ecosystem')) not null,
  title text not null,
  description text,
  vertical text,
  xp_reward integer not null default 500,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

-- Challenge responses
create table if not exists public.challenge_responses (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges(id) on delete cascade,
  startup_id uuid references public.startups(id) on delete cascade,
  proposal text,
  kpi text,
  demo_link text,
  votes integer not null default 0,
  created_at timestamptz not null default now()
);

-- Meetings
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.users(id),
  startup_id uuid references public.startups(id),
  objective text,
  message text,
  status text check (status in ('pending','accepted','declined')) not null default 'pending',
  created_at timestamptz not null default now()
);

-- Recommendations
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  recommender_id uuid references public.users(id),
  startup_id uuid references public.startups(id),
  fit text,
  justification text,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now()
);

-- Votes (awards)
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid references public.users(id),
  category text not null,
  startup_id uuid references public.startups(id),
  reason text,
  created_at timestamptz not null default now(),
  unique (voter_id, category)
);

-- Invitations (traceable referral links)
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid references public.users(id),
  ecosystem_tag text,
  uses integer not null default 0,
  created_at timestamptz not null default now()
);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.startups enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_responses enable row level security;
alter table public.meetings enable row level security;
alter table public.recommendations enable row level security;
alter table public.votes enable row level security;
alter table public.invitations enable row level security;

-- Public read for rankings/challenges
create policy "Public challenges read" on public.challenges for select using (true);
create policy "Public startups read" on public.startups for select using (true);
create policy "Public votes read" on public.votes for select using (true);
create policy "Public recommendations read" on public.recommendations for select using (true);

-- Users can read/update their own row
create policy "Users read own" on public.users for select using (auth.uid() = id);
create policy "Users update own" on public.users for update using (auth.uid() = id);

-- Seed sample challenges
insert into public.challenges (type, title, description, vertical, xp_reward)
values
  ('sponsor', 'IA para personalizar campañas a escala', 'Buscamos startups capaces de generar, adaptar y medir contenido para distintos segmentos.', 'Content AI', 500),
  ('brand', 'Reducir fricción en atención al cliente', 'Soluciones de AI agents, automatización conversacional y analítica de satisfacción para retail.', 'Customer Experience', 500),
  ('agency', 'Creator Economy + IA para lanzamientos', 'Una agencia busca startups para activar comunidades, influencers y UGC con IA.', 'Content AI', 500),
  ('ecosystem', 'Ranking de activación', 'Un reto para medir qué comunidad genera más oportunidades antes del evento.', null, 2000);
