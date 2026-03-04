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

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.knowledge enable row level security;

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

-- ============================================
-- 7. INDEXES
-- ============================================
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_knowledge_type on public.knowledge(type);
