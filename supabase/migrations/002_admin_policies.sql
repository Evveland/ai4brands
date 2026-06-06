-- Admin write policies for challenges
-- Run this in Supabase SQL Editor if MCP is unavailable:
-- https://supabase.com/dashboard/project/hijgiehdvztlkgdtxjys/sql

create policy "Admin insert challenges" on public.challenges
  for insert with check (true);

create policy "Admin update challenges" on public.challenges
  for update using (true);

create policy "Admin delete challenges" on public.challenges
  for delete using (true);
