-- Phase 1: Multi-country support
alter table public.users          add column if not exists country text;
alter table public.organizations  add column if not exists country text;
alter table public.challenges     add column if not exists country text; -- null = global
