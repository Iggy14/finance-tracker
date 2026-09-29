-- Run once in the Supabase SQL editor. Backs the Mini Sheet (see ARCHITECTURE.md §3.7).
create table if not exists public.sheets (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  cells      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sheets enable row level security;

create policy "sheets_select_own" on public.sheets for select using (auth.uid() = user_id);
create policy "sheets_insert_own" on public.sheets for insert with check (auth.uid() = user_id);
create policy "sheets_update_own" on public.sheets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sheets_delete_own" on public.sheets for delete using (auth.uid() = user_id);
