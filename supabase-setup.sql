-- ===================================================================
-- Banquet & Event  —  ติดตั้งฐานข้อมูล Supabase
-- วิธีใช้: Supabase -> SQL Editor -> New query -> วางทั้งหมด -> Run
-- รันได้ซ้ำโดยไม่พัง
-- ===================================================================

-- ---------- 1. ตาราง ----------
create table if not exists public.functions (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists functions_datefrom_idx
  on public.functions ((data->>'dateFrom'));

-- ---------- 2. สิทธิ์ ----------
alter table public.functions enable row level security;
alter table public.settings  enable row level security;

drop policy if exists "anon_all_functions" on public.functions;
create policy "anon_all_functions" on public.functions
  for all to anon using (true) with check (true);

drop policy if exists "anon_all_settings" on public.settings;
create policy "anon_all_settings" on public.settings
  for all to anon using (true) with check (true);

-- ---------- 3. อัปเดตสด (Realtime) ----------
do $$
begin
  begin execute 'alter publication supabase_realtime add table public.functions';
  exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.settings';
  exception when duplicate_object then null; end;
end $$;

-- ---------- 4. ที่เก็บไฟล์แนบ ----------
insert into storage.buckets (id, name, public)
values ('files','files',true)
on conflict (id) do update set public = true;

drop policy if exists "files_read"   on storage.objects;
create policy "files_read" on storage.objects
  for select to anon using (bucket_id = 'files');

drop policy if exists "files_insert" on storage.objects;
create policy "files_insert" on storage.objects
  for insert to anon with check (bucket_id = 'files');

drop policy if exists "files_update" on storage.objects;
create policy "files_update" on storage.objects
  for update to anon using (bucket_id = 'files');

-- เสร็จแล้ว ตรวจด้วย:  select count(*) from public.functions;
