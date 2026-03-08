-- Migration: Add data_snapshots, tasks, integration_requests tables
-- Run this in Supabase SQL editor if you already have the base schema

-- ============================================
-- 1. DATA SNAPSHOTS (raw daily data from providers)
-- ============================================
-- Provider-agnostic: "datafast", "github", "stripe", "posthog"
create table if not exists public.data_snapshots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  provider text not null,          -- "datafast", "github", "stripe", "posthog"
  date date not null default current_date,
  raw_data jsonb not null,         -- full API response stored as-is
  collected_at timestamptz default now(),
  unique(user_id, provider, date)
);

alter table public.data_snapshots enable row level security;

create policy "Users can view own snapshots"
  on public.data_snapshots for select
  using (auth.uid() = user_id);

create policy "Service can insert snapshots"
  on public.data_snapshots for insert
  with check (auth.uid() = user_id);

create index if not exists idx_data_snapshots_user_provider on public.data_snapshots(user_id, provider);
create index if not exists idx_data_snapshots_date on public.data_snapshots(date desc);

-- ============================================
-- 2. TASKS (from chat + reports)
-- ============================================
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  done boolean default false,
  pinned boolean default true,
  source text default 'chat',      -- "chat", "report"
  source_id text,                  -- message_id or report_id that created it
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.tasks enable row level security;

create policy "Users own tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_done on public.tasks(user_id, done);

-- ============================================
-- 3. INTEGRATION REQUESTS
-- ============================================
create table if not exists public.integration_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  tool_name text not null,
  details text,
  created_at timestamptz default now()
);

alter table public.integration_requests enable row level security;

create policy "Users can insert own integration requests"
  on public.integration_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can view own integration requests"
  on public.integration_requests for select
  using (auth.uid() = user_id);

-- ============================================
-- 4. ADD self_reported_mrr TO PROFILES
-- ============================================
alter table public.profiles add column if not exists self_reported_mrr integer;
