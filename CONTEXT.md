# Tasu — Project Context

## What is Tasu?

Tasu (tasu.ai) is an **AI co-founder for solo founders and small teams**. It combines real business data — traffic, revenue, and code activity — to proactively diagnose growth blockers and give the founder one sharp, concrete next action. Not a playbook. Not 10 suggestions. One thing.

Core loop:
1. Founder connects their website URL, DataFast (revenue + traffic), and GitHub (code activity)
2. Tasu automatically pulls live data from all sources
3. Founder chats with Tasu or generates a daily AI report
4. Report diagnoses the main blocker (positioning, conversion, distribution, or momentum) and gives 3–5 actionable suggestions the founder can mark as done

Tasu is blunt, direct, and data-aware. It does not give generic advice. Accountability is built in through daily reports that cross-reference what you shipped (GitHub) vs. what it produced (revenue + traffic).

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Auth + DB | Supabase (email/password, magic link, Google OAuth, password reset) |
| Styling | Tailwind CSS (custom color palette) |
| AI | Claude API (direct HTTP, model: `claude-sonnet-4-20250514`) |
| Analytics | DataFast API (traffic, revenue, conversion) |
| Code activity | GitHub REST API (commits, activity) |
| Hosting | Vercel (planned) |

---

## Design System

Custom Tailwind colors:
- `cream` → `#F5F0E8` (background)
- `cream-dark` → `#EBE4D8` (borders, dividers)
- `charcoal` → `#1A1A1A` (primary text, dark buttons)
- `terracotta` → `#C75B30` (brand accent, CTAs)
- `terracotta-dark` → `#A84A25` (hover state)
- `warm-gray` → `#6B6560` (secondary text, icons)

Fonts: Geist Sans + Geist Mono (via `next/font`)

Aesthetic: warm cream background, clean minimal layout, breathing room, smooth animations. Claude/Anthropic-like smoothness.

---

## Database Schema (Supabase)

### `profiles`
Linked 1:1 to `auth.users`. Auto-created by trigger on signup.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | FK → auth.users |
| `full_name` | text | Collected during signup |
| `website_url` | text | Founder's product URL |
| `business_context` | text | Free-form context (editable in Settings) |
| `onboarded` | boolean | Set to true after signup flow |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `messages`
Chat history per user.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → auth.users |
| `role` | text | `'user'` or `'assistant'` |
| `content` | text | |
| `created_at` | timestamptz | |

### `integrations`
Per-user third-party credentials (never exposed to client).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → auth.users (unique) |
| `datafast_api_key` | text | DataFast Bearer token |
| `github_repo_url` | text | `owner/repo` or full GitHub URL |
| `github_token` | text | Optional PAT for private repos |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `reports`
AI-generated daily reports saved per user.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → auth.users |
| `generated_at` | timestamptz | When the report was generated |
| `period_start` | timestamptz | Data window start (30 days back) |
| `period_end` | timestamptz | Data window end (now) |
| `summary` | text | AI narrative (max ~150 words) |
| `suggestions` | jsonb | `[{id, text, category, done}]` |
| `datafast_data` | jsonb | Raw DataFast snapshot |
| `github_data` | jsonb | Raw GitHub snapshot |
| `metrics` | jsonb | `{visitors_30d, revenue_30d, conversion_rate, commits_30d}` |

### `knowledge`
Shared founder growth playbooks (renamed from `growth_posts`). 8 rows. Read-only to all authenticated users. Referenced in the AI system prompt.

RLS is enabled on all tables.

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                         # Landing page (URL input → signup)
│   ├── login/page.tsx                   # Sign in / sign up (name + URL + email/password or Google)
│   ├── auth/callback/route.ts           # Supabase auth redirect handler (all flows)
│   ├── reset-password/page.tsx          # New password form after reset email
│   ├── onboarding/page.tsx              # Legacy (flow now merged into signup)
│   ├── privacy/page.tsx                 # Privacy policy
│   ├── (app)/                           # Protected route group (sidebar layout)
│   │   ├── layout.tsx                   # AppSidebar + main
│   │   ├── chat/page.tsx                # Main chat interface
│   │   ├── report/page.tsx              # Daily reports with suggestions + checkboxes
│   │   ├── project/page.tsx             # Integration status + live metrics snapshot
│   │   └── settings/page.tsx            # Profile + DataFast + GitHub integration fields
│   └── api/
│       ├── chat/route.ts                # Claude API call (pulls DataFast + GitHub live)
│       ├── report/
│       │   ├── generate/route.ts        # Generates AI report, saves to reports table
│       │   └── [id]/route.ts            # PATCH to toggle suggestion done status
│       └── integrations/
│           ├── datafast/route.ts        # Proxies DataFast API (overview + timeseries)
│           └── github/route.ts          # Fetches GitHub commits + commit activity
├── components/
│   └── app-sidebar.tsx                  # Left sidebar: logo, Chat, Reports, Project, Settings, sign out
├── lib/supabase/
│   ├── client.ts                        # Browser Supabase client
│   ├── server.ts                        # Server Supabase client
│   └── middleware.ts                    # Auth middleware (protects /chat, /report, /project, /settings)
supabase/
└── schema.sql                           # Full schema (run to reset DB)
CONTEXT.md                               # This file
```

---

## Auth Flow

1. **Landing page** → user enters website URL → `/login?url=...&mode=signup`
2. **Signup** → collects name + website URL + email + password (or Google OAuth)
3. **`/auth/callback`** handles all Supabase email redirects
4. **Middleware** protects the `(app)` group — redirects to `/login` if not authed
5. **Public paths**: `/`, `/login`, `/privacy`, `/reset-password`, `/auth/callback`, `/onboarding`

---

## DataFast Integration

- API base: `https://datafa.st/api/v1/analytics`
- Auth: `Authorization: Bearer {datafast_api_key}`
- Endpoints used:
  - `GET /overview?startAt=...&endAt=...&fields=visitors,sessions,bounce_rate,revenue,revenue_per_visitor,conversion_rate`
  - `GET /timeseries?startAt=...&endAt=...&fields=visitors,sessions,revenue,conversion_rate,name`
- Key is stored in `integrations.datafast_api_key` (never sent to client)
- Affiliate link (if founder doesn't have DataFast): `https://datafa.st/?via=jeremy-lasne`

---

## GitHub Integration

- API: `https://api.github.com/repos/{owner}/{repo}/...`
- Endpoints used:
  - `GET /commits?per_page=30` — recent commits
  - `GET /stats/commit_activity` — weekly commit totals
- Optional PAT (`github_token`) for private repos
- Repo URL stored as `owner/repo` or full GitHub URL; auto-parsed

---

## Chat / AI Logic (`src/app/api/chat/route.ts`)

Per request, the server fetches:
1. User profile (name, website_url, business_context)
2. User integrations (datafast_api_key, github_repo_url, github_token)
3. Last 20 messages (conversation history)
4. All `knowledge` rows (founder growth strategies)
5. Live DataFast overview (if connected)
6. Live GitHub commits + activity (if connected)

All data is injected into the Claude system prompt. Failures in DataFast/GitHub fetches are silent (continue without that data).

**AI persona**: Direct, sharp, no fluff. Diagnoses one root blocker. Gives one concrete action. Never generic.

---

## Report Generation (`POST /api/report/generate`)

1. Fetches all context above (same as chat, but server-to-server)
2. Sends to Claude with JSON output instructions:
   - `summary` — sharp narrative
   - `main_blocker` — positioning | conversion | distribution | momentum
   - `metrics` — extracted key numbers
   - `suggestions` — 3–5 `{text, category}` items
3. Saves report to `reports` table with `suggestions` including `{id, done: false}`
4. Returns saved report to client

**Suggestion categories**: positioning, conversion, distribution, code, accountability

---

## Report Page (`/report`)

- Lists last 10 reports, newest first
- Each report shows: date, metric cards (visitors/revenue/conversion/commits), AI summary, suggestions
- Suggestions are checkboxes (marking done calls `PATCH /api/report/[id]` → updates JSONB in place)
- Progress bar per report (done/total suggestions)
- "Generate report" button triggers `POST /api/report/generate`
- Empty state links to Settings for integrations

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=...        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Supabase anon key
ANTHROPIC_API_KEY=...               # Claude API key (must be set for chat + reports to work)
```

---

## Supabase: Run These in SQL Editor

```sql
-- Add full_name column (if using existing DB from before this was added)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- Add integrations table (if incrementally applying)
CREATE TABLE IF NOT EXISTS public.integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  datafast_api_key text,
  github_repo_url text,
  github_token text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own integrations" ON public.integrations FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add reports table (if incrementally applying)
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  generated_at timestamptz default now(),
  period_start timestamptz,
  period_end timestamptz,
  summary text,
  suggestions jsonb,
  datafast_data jsonb,
  github_data jsonb,
  metrics jsonb
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON public.reports FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON public.reports(generated_at desc);
```

---

## Current State

**Built and working:**
- Landing page with URL input → signup flow
- Sign up / sign in (email/password, Google OAuth), password reset
- Chat interface with markdown bold rendering, prompt suggestions
- Settings: profile + DataFast API key + GitHub repo config
- Project page: live integration status + metrics snapshot
- Reports page: AI-generated daily reports with actionable checkboxes
- DataFast API proxy (`/api/integrations/datafast`)
- GitHub API proxy (`/api/integrations/github`)
- Report generation API (`/api/report/generate` + `PATCH /api/report/[id]`)
- Chat API now pulls live DataFast + GitHub data per message

**Pending:**
- `ANTHROPIC_API_KEY` must be set in `.env.local` for chat + reports to work
- Run the SQL above in Supabase to apply `integrations` + `reports` tables to live DB
- Google OAuth needs enabling in Supabase dashboard (Auth → Providers → Google)
- Email daily report scheduling (not yet implemented — currently manual generation)
- Website HTML analysis (positioning signals from landing page URL — planned)

---

## Dev Setup

```bash
npm run dev          # Start on http://localhost:3000
```

Git repo: https://github.com/jlasne/tasu
Active branch: `redesign/smooth-landing-onboarding`
Open PRs: #2 (main work branch)
