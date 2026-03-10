-- Fake daily_reports seed data for user b1c38bbc-ae6f-4a88-be44-9462e3342028
-- Run this in your Supabase SQL Editor

INSERT INTO public.daily_reports (id, user_id, date, summary, suggestions, metrics, generated_at)
VALUES

(
  gen_random_uuid(),
  'b1c38bbc-ae6f-4a88-be44-9462e3342028',
  '2026-03-03',
  'Traffic is steady but conversion is underperforming. Your landing page is attracting visitors but they are not signing up — likely a messaging mismatch. GitHub activity is low this week, which is fine if you''re focusing on distribution.',
  '[
    {"id":"s1_1","text":"Rewrite your hero headline to focus on the outcome, not the feature. Test: \"Get your first 100 users\" vs \"AI-powered growth analytics\"","category":"positioning","done":false},
    {"id":"s1_2","text":"Add a short demo video (60–90s) above the fold — founders with demos convert 2–3x better","category":"conversion","done":false},
    {"id":"s1_3","text":"Post in 2 relevant Slack communities this week sharing a specific insight from your data","category":"distribution","done":false},
    {"id":"s1_4","text":"Set up a simple onboarding email triggered 1h after signup to ask: what problem were you trying to solve?","category":"accountability","done":false}
  ]'::jsonb,
  '{"visitors_30d": 312, "revenue_30d": 180, "conversion_rate": 1.8, "commits_30d": 8}'::jsonb,
  '2026-03-03T07:00:00Z'
),

(
  gen_random_uuid(),
  'b1c38bbc-ae6f-4a88-be44-9462e3342028',
  '2026-03-04',
  'Traffic dipped slightly today — normal variance. Conversion rate ticked up to 1.9%, a small sign your page changes are working. Revenue is stable at $180. Focus on getting 3–5 conversations with potential users this week.',
  '[
    {"id":"s2_1","text":"Reach out to 5 founders in your target market on Twitter/X — not to sell, just to learn their biggest growth blocker","category":"distribution","done":false},
    {"id":"s2_2","text":"Add social proof: even 2–3 testimonials or logos on the landing page significantly reduce bounce rate","category":"conversion","done":false},
    {"id":"s2_3","text":"Review your signup flow — remove any friction points or required fields that aren''t essential","category":"conversion","done":false}
  ]'::jsonb,
  '{"visitors_30d": 287, "revenue_30d": 180, "conversion_rate": 1.9, "commits_30d": 12}'::jsonb,
  '2026-03-04T07:00:00Z'
),

(
  gen_random_uuid(),
  'b1c38bbc-ae6f-4a88-be44-9462e3342028',
  '2026-03-05',
  'Good day — traffic up 55% likely from a post or referral. Revenue jumped to $240, suggesting your pricing and value prop are landing for the right audience. Capitalise on this spike by engaging new signups quickly.',
  '[
    {"id":"s3_1","text":"Check your referral sources in DataFast today — identify what drove the traffic spike and double down on it","category":"distribution","done":false},
    {"id":"s3_2","text":"Send a personal welcome message to every signup from the past 48h — early engagement dramatically improves activation","category":"accountability","done":true},
    {"id":"s3_3","text":"Create a short \"how I got here\" post (Twitter thread or blog) capturing the momentum while it''s fresh","category":"distribution","done":false},
    {"id":"s3_4","text":"Consider a 48h limited offer for new signups to convert the spike into paying customers","category":"conversion","done":false}
  ]'::jsonb,
  '{"visitors_30d": 445, "revenue_30d": 240, "conversion_rate": 2.1, "commits_30d": 5}'::jsonb,
  '2026-03-05T07:00:00Z'
),

(
  gen_random_uuid(),
  'b1c38bbc-ae6f-4a88-be44-9462e3342028',
  '2026-03-06',
  'Strong commit day (18 commits) — you''re shipping fast, which is good. Traffic continues to grow at 521 visitors. Conversion at 2.3% is improving. The key lever now is making sure new features are visible and communicated to users.',
  '[
    {"id":"s4_1","text":"Write a changelog post for the features you shipped this week — publish it on Twitter and in your app","category":"distribution","done":false},
    {"id":"s4_2","text":"Add an in-app notification or badge for new features so existing users discover them without leaving","category":"code","done":false},
    {"id":"s4_3","text":"Ship one small \"wow\" UX improvement this week that users didn''t ask for but will love","category":"code","done":false},
    {"id":"s4_4","text":"Review churn: if anyone cancelled this week, send a 1-sentence email asking what went wrong","category":"accountability","done":false}
  ]'::jsonb,
  '{"visitors_30d": 521, "revenue_30d": 240, "conversion_rate": 2.3, "commits_30d": 18}'::jsonb,
  '2026-03-06T07:00:00Z'
),

(
  gen_random_uuid(),
  'b1c38bbc-ae6f-4a88-be44-9462e3342028',
  '2026-03-07',
  'Weekend dip in commits (expected). Traffic at 489 is solid and revenue is up to $260 — you now have 3 consecutive days of revenue growth. Conversion at 2.6% is your best rate yet. Keep testing the landing page headline.',
  '[
    {"id":"s5_1","text":"Run an A/B test on your CTA button — change from \"Get started\" to something specific like \"Analyse my SaaS growth\"","category":"conversion","done":false},
    {"id":"s5_2","text":"Set up a weekly review habit: every Monday, look at last week''s metrics and write 3 observations","category":"accountability","done":false},
    {"id":"s5_3","text":"Add an exit-intent prompt offering a free 7-day trial or a short demo call to recapture bouncing visitors","category":"conversion","done":false}
  ]'::jsonb,
  '{"visitors_30d": 489, "revenue_30d": 260, "conversion_rate": 2.6, "commits_30d": 7}'::jsonb,
  '2026-03-07T07:00:00Z'
),

(
  gen_random_uuid(),
  'b1c38bbc-ae6f-4a88-be44-9462e3342028',
  '2026-03-08',
  'Best traffic day in 30 days at 634 visitors. Strong commit activity with 21 pushes. Revenue holding at $260. The gap between traffic and revenue suggests you need a stronger bottom-of-funnel strategy — people are interested but not converting.',
  '[
    {"id":"s6_1","text":"Add a pricing FAQ directly below your pricing section answering the top 3 objections (is it worth it, can I cancel, is it secure)","category":"conversion","done":false},
    {"id":"s6_2","text":"Implement a free tier or trial to lower the commitment bar — even a 14-day free trial can 3x conversion","category":"positioning","done":false},
    {"id":"s6_3","text":"Identify your top 5 active users and schedule a 15-min call this week — their language will sharpen your copy","category":"accountability","done":false},
    {"id":"s6_4","text":"Submit to 2 ProductHunt-style directories (Betalist, Uneed, Microlaunch) this week for passive discovery","category":"distribution","done":false}
  ]'::jsonb,
  '{"visitors_30d": 634, "revenue_30d": 260, "conversion_rate": 2.8, "commits_30d": 21}'::jsonb,
  '2026-03-08T07:00:00Z'
),

(
  gen_random_uuid(),
  'b1c38bbc-ae6f-4a88-be44-9462e3342028',
  '2026-03-09',
  'Excellent week overall. Traffic at 701, revenue at $300, conversion at 3.1% — all metrics trending in the right direction. You''re building momentum. The next inflection point is typically around $500 MRR, where word-of-mouth starts to compound.',
  '[
    {"id":"s7_1","text":"Set a public MRR goal (e.g. $500 by end of March) and share it on Twitter — accountability drives execution","category":"accountability","done":false},
    {"id":"s7_2","text":"Implement a referral mechanism: offer 1 free month to users who bring a paying customer","category":"distribution","done":false},
    {"id":"s7_3","text":"Audit your onboarding: what''s the median time from signup to first value moment? It should be under 5 minutes","category":"conversion","done":false},
    {"id":"s7_4","text":"Write and publish a case study of one user who got a clear result — even if it''s just 3 paragraphs","category":"positioning","done":false}
  ]'::jsonb,
  '{"visitors_30d": 701, "revenue_30d": 300, "conversion_rate": 3.1, "commits_30d": 15}'::jsonb,
  '2026-03-09T07:00:00Z'
)

ON CONFLICT (user_id, date) DO NOTHING;
