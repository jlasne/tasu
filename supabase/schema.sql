-- Tasu Supabase Schema (Full Reset)
-- Run this in your Supabase SQL editor

-- ============================================
-- 1. DROP OLD TABLES (from previous version)
-- ============================================
drop table if exists public.blog_posts cascade;
drop table if exists public.ac_list cascade;
drop table if exists public.ph_list cascade;
drop table if exists public.cat_list cascade;

-- ============================================
-- 2. RENAME growth_posts → knowledge
-- ============================================
alter table if exists public.growth_posts rename to knowledge;

-- ============================================
-- 3. DROP OLD profiles (incompatible schema)
-- ============================================
drop table if exists public.profiles cascade;
drop table if exists public.integrations cascade;
drop table if exists public.reports cascade;

-- ============================================
-- 4. CREATE NEW TABLES
-- ============================================

-- Profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  website_url text,
  business_context text,
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table (chat history)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Integrations table (DataFast, GitHub per user)
create table public.integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  datafast_api_key text,
  github_repo_url text,       -- e.g. "owner/repo" or full https URL
  github_token text,          -- optional PAT for private repos
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reports table (AI-generated daily reports)
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  generated_at timestamptz default now(),
  period_start timestamptz,
  period_end timestamptz,
  summary text,               -- AI-generated narrative
  suggestions jsonb,          -- [{id, text, category, done}]
  datafast_data jsonb,        -- raw DataFast snapshot
  github_data jsonb,          -- raw GitHub snapshot
  metrics jsonb               -- extracted key numbers
);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.knowledge enable row level security;
alter table public.integrations enable row level security;
alter table public.reports enable row level security;

-- ============================================
-- 6. RLS POLICIES
-- ============================================

-- Profiles: users can only access their own
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Messages: users can only access their own
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.messages for insert
  with check (auth.uid() = user_id);

-- Knowledge: readable by all authenticated users (shared strategies)
create policy "Authenticated users can read knowledge"
  on public.knowledge for select
  using (auth.role() = 'authenticated');

-- Integrations: users own their integrations
create policy "Users own integrations"
  on public.integrations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Reports: users own their reports
create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Users can insert own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reports"
  on public.reports for update
  using (auth.uid() = user_id);

-- ============================================
-- 7. INDEXES
-- ============================================
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_knowledge_type on public.knowledge(type);
create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_reports_generated_at on public.reports(generated_at desc);
