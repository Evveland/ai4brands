-- Store: products and purchases
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text check (category in ('access','visibility','badge','premium')) not null default 'access',
  xp_price integer,
  fiat_price_cents integer,
  stripe_price_id text,
  badge_unlocked text,
  active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id),
  payment_method text check (payment_method in ('xp','stripe','manual')) not null,
  status text check (status in ('pending','completed','refunded')) not null default 'completed',
  xp_spent integer,
  amount_cents integer,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

alter table public.products  enable row level security;
alter table public.purchases enable row level security;

create policy "Public products read"   on public.products  for select using (true);
create policy "Admin insert products"  on public.products  for insert with check (true);
create policy "Admin update products"  on public.products  for update using (true);
create policy "Admin delete products"  on public.products  for delete using (true);
create policy "User insert purchases"  on public.purchases for insert with check (true);
create policy "User read purchases"    on public.purchases for select using (true);
