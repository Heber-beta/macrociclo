-- Pegar en Supabase > SQL Editor > New query > Run
create table if not exists settings (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  data jsonb, updated_at timestamptz default now());
create table if not exists macros (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null, updated_at timestamptz default now());
create table if not exists entries (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  macro_id text not null, key text not null, data jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, macro_id, key));
alter table settings enable row level security;
alter table macros enable row level security;
alter table entries enable row level security;
create policy "propios" on settings for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "propios" on macros for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "propios" on entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
