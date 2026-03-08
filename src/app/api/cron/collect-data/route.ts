import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const DATAFAST_BASE = "https://datafa.st/api/v1/analytics";

// Service-role client for cron (bypasses RLS)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function parseRepo(repoUrl: string): { owner: string; repo: string } | null {
  const cleaned = repoUrl.trim().replace(/\.git$/, "");
  const match =
    cleaned.match(/github\.com\/([^/]+)\/([^/]+)/) ||
    cleaned.match(/^([^/]+)\/([^/]+)$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized", hint: !process.env.CRON_SECRET ? "CRON_SECRET not set" : "Token mismatch" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 500 });
  }

  const supabase = getServiceClient();
  const today = new Date().toISOString().split("T")[0];

  // Get all users with integrations
  const { data: integrations, error: intError } = await supabase
    .from("integrations")
    .select("user_id, datafast_api_key, github_repo_url, github_token");

  if (intError || !integrations) {
    return NextResponse.json({ error: "Failed to fetch integrations", detail: intError?.message ?? "null result" }, { status: 500 });
  }

  const results: { user_id: string; datafast: boolean; github: boolean }[] = [];

  for (const integration of integrations) {
    const userId = integration.user_id;
    let datafastOk = false;
    let githubOk = false;

    // ── DataFast ──
    if (integration.datafast_api_key) {
      try {
        const endAt = today;
        const startAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const [overviewRes, referrersRes, pagesRes] = await Promise.all([
          fetch(
            `${DATAFAST_BASE}/overview?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,bounce_rate,avg_session_duration,revenue,revenue_per_visitor,conversion_rate`,
            { headers: { Authorization: `Bearer ${integration.datafast_api_key}` } }
          ),
          fetch(
            `${DATAFAST_BASE}/timeseries?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,revenue,conversion_rate,name&groupBy=referrer`,
            { headers: { Authorization: `Bearer ${integration.datafast_api_key}` } }
          ).catch(() => null),
          fetch(
            `${DATAFAST_BASE}/timeseries?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,name&groupBy=path`,
            { headers: { Authorization: `Bearer ${integration.datafast_api_key}` } }
          ).catch(() => null),
        ]);

        if (overviewRes.ok) {
          const overview = await overviewRes.json();
          const referrers = referrersRes?.ok ? await referrersRes.json() : null;
          const pages = pagesRes?.ok ? await pagesRes.json() : null;

          // Extract daily revenue & visitors from overview
          const d = overview.data?.[0];
          const rawData = {
            daily_revenue: d?.revenue ?? null,
            daily_visitors: d?.visitors ?? null,
            mrr: d?.revenue ? Math.round((d.revenue / 30) * 30) : null,  // approximate
            conversion_rate: d?.conversion_rate ?? null,
            bounce_rate: d?.bounce_rate ?? null,
            revenue_per_visitor: d?.revenue_per_visitor ?? null,
            sessions: d?.sessions ?? null,
            avg_session_duration: d?.avg_session_duration ?? null,
            referrers: referrers?.data ?? [],
            pages: pages?.data ?? [],
            overview_full: d,
          };

          await supabase.from("data_snapshots").upsert({
            user_id: userId,
            provider: "datafast",
            date: today,
            raw_data: rawData,
          }, { onConflict: "user_id,provider,date" });

          datafastOk = true;
        }
      } catch (err) {
        console.error(`DataFast error for ${userId}:`, err);
      }
    }

    // ── GitHub ──
    if (integration.github_repo_url) {
      try {
        const parsed = parseRepo(integration.github_repo_url);
        if (parsed) {
          const { owner, repo } = parsed;
          const ghHeaders: Record<string, string> = {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          };
          if (integration.github_token) {
            ghHeaders["Authorization"] = `Bearer ${integration.github_token}`;
          }

          const [commitsRes, activityRes] = await Promise.all([
            fetch(
              `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
              { headers: ghHeaders }
            ),
            fetch(
              `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
              { headers: ghHeaders }
            ),
          ]);

          if (commitsRes.ok) {
            const commits = await commitsRes.json();
            const weeklyActivity = activityRes.ok ? await activityRes.json() : [];
            const last4Weeks = Array.isArray(weeklyActivity) ? weeklyActivity.slice(-4) : [];
            const totalCommits = last4Weeks.reduce((s: number, w: { total: number }) => s + w.total, 0);

            const recentCommits = Array.isArray(commits)
              ? commits.slice(0, 10).map((c: { sha: string; commit: { message: string; author: { name: string; date: string } } }) => ({
                  sha: c.sha?.slice(0, 7),
                  message: c.commit?.message?.split("\n")[0],
                  author: c.commit?.author?.name,
                  date: c.commit?.author?.date,
                }))
              : [];

            const rawData = {
              owner,
              repo,
              total_commits_30d: totalCommits,
              recent_commits: recentCommits,
              weekly_activity: last4Weeks,
              last_commit_date: recentCommits[0]?.date ?? null,
            };

            await supabase.from("data_snapshots").upsert({
              user_id: userId,
              provider: "github",
              date: today,
              raw_data: rawData,
            }, { onConflict: "user_id,provider,date" });

            githubOk = true;
          }
        }
      } catch (err) {
        console.error(`GitHub error for ${userId}:`, err);
      }
    }

    results.push({ user_id: userId, datafast: datafastOk, github: githubOk });
  }

  return NextResponse.json({ collected: results.length, results, date: today });
}
