import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all context in parallel
  const [
    { data: profile },
    { data: integration },
    { data: knowledge },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, website_url, business_context")
      .eq("id", user.id)
      .single(),
    supabase
      .from("integrations")
      .select("datafast_api_key, github_repo_url")
      .eq("user_id", user.id)
      .single(),
    supabase.from("knowledge").select("title, content, type"),
  ]);

  // Fetch live DataFast + GitHub data if connected
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let datafastData = null;
  let githubData = null;

  // We call our own API routes to reuse the logic
  const cookieHeader = ""; // Server-to-server — use service key instead
  const serviceSupabase = createClient(); // already has the user session via server cookies

  if (integration?.datafast_api_key) {
    try {
      const dfRes = await fetch(`${baseUrl}/api/integrations/datafast`, {
        headers: { Cookie: "" },
      });
      // We need auth — call DataFast directly here instead
      const DATAFAST_BASE = "https://datafa.st/api/v1/analytics";
      const endAt = new Date().toISOString().split("T")[0];
      const startAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const [overviewRes, timeseriesRes] = await Promise.all([
        fetch(
          `${DATAFAST_BASE}/overview?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,bounce_rate,avg_session_duration,revenue,revenue_per_visitor,conversion_rate`,
          { headers: { Authorization: `Bearer ${integration.datafast_api_key}` } }
        ),
        fetch(
          `${DATAFAST_BASE}/timeseries?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,revenue,conversion_rate,name`,
          { headers: { Authorization: `Bearer ${integration.datafast_api_key}` } }
        ),
      ]);

      if (overviewRes.ok) {
        const [overview, timeseries] = await Promise.all([
          overviewRes.json(),
          timeseriesRes.ok ? timeseriesRes.json() : { data: [] },
        ]);
        datafastData = {
          overview: overview.data?.[0] ?? null,
          timeseries: timeseries.data ?? [],
          totals: timeseries.totals ?? null,
          period: { startAt, endAt },
        };
      }
    } catch { /* DataFast fetch failed, continue without it */ }
  }

  if (integration?.github_repo_url) {
    try {
      const repoUrl = integration.github_repo_url.trim().replace(/\.git$/, "");
      const match =
        repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/) ||
        repoUrl.match(/^([^/]+)\/([^/]+)$/);
      if (match) {
        const [owner, repo] = [match[1], match[2]];
        const ghHeaders: Record<string, string> = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        };

        const [commitsRes, activityRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=20`, { headers: ghHeaders }),
          fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, { headers: ghHeaders }),
        ]);

        if (commitsRes.ok) {
          const commits = await commitsRes.json();
          const weeklyActivity = activityRes.ok ? await activityRes.json() : [];
          const recentCommits = Array.isArray(commits)
            ? commits.slice(0, 10).map((c: { sha: string; commit: { message: string; author: { name: string; date: string } } }) => ({
                sha: c.sha?.slice(0, 7),
                message: c.commit?.message?.split("\n")[0],
                date: c.commit?.author?.date,
              }))
            : [];
          const last4Weeks = Array.isArray(weeklyActivity)
            ? weeklyActivity.slice(-4).map((w: { week: number; total: number }) => ({ week: w.week, total: w.total }))
            : [];
          githubData = {
            owner, repo, recentCommits,
            totalCommitsLast30: last4Weeks.reduce((s, w) => s + w.total, 0),
            lastCommitDate: recentCommits[0]?.date ?? null,
            last4Weeks,
          };
        }
      }
    } catch { /* GitHub fetch failed, continue without it */ }
  }

  // Build report prompt
  const knowledgeSummary = (knowledge || [])
    .slice(0, 5)
    .map((k: { title: string; content: string }) => `- ${k.title}: ${k.content?.slice(0, 200)}`)
    .join("\n");

  const datafastSummary = datafastData?.overview
    ? `
DataFast (last 30 days):
- Visitors: ${datafastData.overview.visitors ?? "N/A"}
- Sessions: ${datafastData.overview.sessions ?? "N/A"}
- Revenue: ${datafastData.overview.revenue ?? "N/A"} ${datafastData.overview.currency ?? ""}
- Conversion rate: ${datafastData.overview.conversion_rate ?? "N/A"}%
- Bounce rate: ${datafastData.overview.bounce_rate ?? "N/A"}%
- Revenue per visitor: ${datafastData.overview.revenue_per_visitor ?? "N/A"}`
    : "DataFast: not connected or no data.";

  const githubSummary = githubData
    ? `
GitHub (${githubData.owner}/${githubData.repo}):
- Commits last 30 days: ${githubData.totalCommitsLast30}
- Last commit: ${githubData.lastCommitDate ? new Date(githubData.lastCommitDate).toLocaleDateString() : "unknown"}
- Recent commits: ${githubData.recentCommits.slice(0, 5).map((c: { message: string }) => c.message).join(", ")}`
    : "GitHub: not connected.";

  const systemPrompt = `You are Tasu, an AI co-founder generating a daily founder report.

Your job: synthesize the data below and produce a sharp, actionable daily report for ${profile?.full_name || "this founder"}.

Product: ${profile?.website_url || "unknown URL"}
Context: ${profile?.business_context || "No context provided yet."}

${datafastSummary}
${githubSummary}

Founder knowledge base:
${knowledgeSummary}

Rules:
- Be direct. No fluff.
- Diagnose ONE main blocker based on the data (positioning, conversion, distribution, or momentum).
- Give 3-5 concrete suggestions. Each suggestion must be specific and actionable today.
- If revenue is 0 or low, focus on distribution and positioning first.
- If traffic is high but conversion is low, focus on positioning/copy.
- If GitHub commits are low (< 5 in 30 days), mention the shipping velocity risk.
- Keep the summary under 150 words.
- Suggestions must each be under 30 words.

Output ONLY valid JSON in this exact format:
{
  "summary": "string — sharp narrative summary of the business state",
  "main_blocker": "positioning|conversion|distribution|momentum",
  "metrics": {
    "visitors_30d": number or null,
    "revenue_30d": number or null,
    "conversion_rate": number or null,
    "commits_30d": number or null
  },
  "suggestions": [
    {"text": "specific action", "category": "positioning|conversion|distribution|code|accountability"},
    {"text": "specific action", "category": "..."},
    {"text": "specific action", "category": "..."}
  ]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: "Generate the daily report." }],
      }),
    });

    const aiResponse = await response.json();
    const rawText = aiResponse.content?.[0]?.text ?? "";

    // Parse JSON from AI response
    let parsed: {
      summary: string;
      main_blocker: string;
      metrics: Record<string, number | null>;
      suggestions: Array<{ text: string; category: string }>;
    } = { summary: rawText, main_blocker: "unknown", metrics: {}, suggestions: [] };

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch { /* use raw text as summary */ }

    // Build suggestions with IDs
    const suggestions = (parsed.suggestions || []).map((s, i) => ({
      id: `s${Date.now()}_${i}`,
      text: s.text,
      category: s.category || "general",
      done: false,
    }));

    // Save report to DB
    const now = new Date();
    const periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { data: savedReport, error: saveError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        generated_at: now.toISOString(),
        period_start: periodStart.toISOString(),
        period_end: now.toISOString(),
        summary: parsed.summary,
        suggestions,
        datafast_data: datafastData,
        github_data: githubData,
        metrics: parsed.metrics || {},
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    return NextResponse.json({ report: savedReport });
  } catch (err) {
    console.error("Report generation error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
