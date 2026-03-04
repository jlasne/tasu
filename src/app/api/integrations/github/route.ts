import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function parseRepo(repoUrl: string): { owner: string; repo: string } | null {
  // Handle "owner/repo" or "https://github.com/owner/repo"
  const cleaned = repoUrl.trim().replace(/\.git$/, "");
  const match =
    cleaned.match(/github\.com\/([^/]+)\/([^/]+)/) ||
    cleaned.match(/^([^/]+)\/([^/]+)$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: integration } = await supabase
    .from("integrations")
    .select("github_repo_url, github_token")
    .eq("user_id", user.id)
    .single();

  if (!integration?.github_repo_url) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 404 });
  }

  const parsed = parseRepo(integration.github_repo_url);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid GitHub repo URL" }, { status: 400 });
  }

  const { owner, repo } = parsed;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (integration.github_token) {
    headers["Authorization"] = `Bearer ${integration.github_token}`;
  }

  try {
    // Fetch recent commits + weekly commit activity in parallel
    const [commitsRes, activityRes] = await Promise.all([
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
        { headers }
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
        { headers }
      ),
    ]);

    if (!commitsRes.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${commitsRes.status}` },
        { status: commitsRes.status }
      );
    }

    const commits = await commitsRes.json();
    const weeklyActivity = activityRes.ok ? await activityRes.json() : [];

    // Extract key signals
    const recentCommits = Array.isArray(commits)
      ? commits.slice(0, 10).map((c: { sha: string; commit: { message: string; author: { name: string; date: string } } }) => ({
          sha: c.sha?.slice(0, 7),
          message: c.commit?.message?.split("\n")[0],
          author: c.commit?.author?.name,
          date: c.commit?.author?.date,
        }))
      : [];

    // Last 4 weeks activity
    const last4Weeks = Array.isArray(weeklyActivity)
      ? weeklyActivity.slice(-4).map((w: { week: number; total: number; days: number[] }) => ({
          week: w.week,
          total: w.total,
          days: w.days,
        }))
      : [];

    const totalCommitsLast30 = last4Weeks.reduce((sum, w) => sum + w.total, 0);
    const lastCommitDate = recentCommits[0]?.date ?? null;

    return NextResponse.json({
      owner,
      repo,
      recentCommits,
      last4Weeks,
      totalCommitsLast30,
      lastCommitDate,
    });
  } catch (err) {
    console.error("GitHub fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
