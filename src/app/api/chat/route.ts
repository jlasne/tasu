import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const DATAFAST_BASE = "https://datafa.st/api/v1/analytics";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();

  // Fetch all context in parallel
  const [
    { data: profile },
    { data: integration },
    { data: recentMessages },
    { data: knowledge },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, website_url, business_context")
      .eq("id", user.id)
      .single(),
    supabase
      .from("integrations")
      .select("datafast_api_key, github_repo_url, github_token")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.from("knowledge").select("title, content").limit(8),
  ]);

  const history = (recentMessages || []).reverse();

  // Live data sections (non-blocking — failures are silent)
  let datafastContext = "";
  let githubContext = "";

  if (integration?.datafast_api_key) {
    try {
      const endAt = new Date().toISOString().split("T")[0];
      const startAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const overviewRes = await fetch(
        `${DATAFAST_BASE}/overview?startAt=${startAt}&endAt=${endAt}&fields=visitors,sessions,bounce_rate,revenue,revenue_per_visitor,conversion_rate`,
        { headers: { Authorization: `Bearer ${integration.datafast_api_key}` } }
      );

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        const d = overviewData.data?.[0];
        if (d) {
          datafastContext = `
Live DataFast data (last 30 days):
- Visitors: ${d.visitors ?? "unknown"}
- Revenue: $${d.revenue ?? "unknown"}
- Conversion rate: ${d.conversion_rate ?? "unknown"}%
- Bounce rate: ${d.bounce_rate ?? "unknown"}%
- Revenue per visitor: $${d.revenue_per_visitor ?? "unknown"}`;
        }
      }
    } catch { /* continue without DataFast */ }
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
        if (integration.github_token) {
          ghHeaders["Authorization"] = `Bearer ${integration.github_token}`;
        }

        const [commitsRes, activityRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, { headers: ghHeaders }),
          fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, { headers: ghHeaders }),
        ]);

        if (commitsRes.ok) {
          const commits = await commitsRes.json();
          const weeklyActivity = activityRes.ok ? await activityRes.json() : [];
          const last4Weeks = Array.isArray(weeklyActivity) ? weeklyActivity.slice(-4) : [];
          const totalCommits = last4Weeks.reduce((s: number, w: { total: number }) => s + w.total, 0);
          const lastCommit = Array.isArray(commits) && commits[0]
            ? new Date(commits[0].commit?.author?.date).toLocaleDateString()
            : "unknown";
          const recentMsgs = Array.isArray(commits)
            ? commits.slice(0, 3).map((c: { commit: { message: string } }) => c.commit?.message?.split("\n")[0]).join(", ")
            : "";

          githubContext = `
GitHub activity (${owner}/${repo}):
- Commits last 30 days: ${totalCommits}
- Last commit: ${lastCommit}
- Recent commits: ${recentMsgs}`;
        }
      }
    } catch { /* continue without GitHub */ }
  }

  const knowledgeSummary = (knowledge || [])
    .map((k: { title: string; content: string }) => `• ${k.title}: ${k.content?.slice(0, 150)}`)
    .join("\n");

  const systemPrompt = `You are Tasu, an AI co-founder. Direct, sharp, and specific — like a real co-founder who knows their numbers.

Your rules:
- Give ONE concrete action per response, not a list
- Ask for specific numbers when they're vague
- Call out what's actually wrong, not what they want to hear
- Diagnose the root blocker: positioning, conversion, distribution, or momentum
- Keep responses under 200 words. No bullet-point essays.
- Use casual, sharp language. No corporate speak.
${profile?.full_name ? `\nFounder: ${profile.full_name}` : ""}
${profile?.website_url ? `Website: ${profile.website_url}` : ""}
${profile?.business_context ? `\nBusiness context:\n${profile.business_context}` : ""}
${datafastContext || "\nDataFast: not connected — ask for traffic and revenue numbers if relevant."}
${githubContext || "\nGitHub: not connected."}
${knowledgeSummary ? `\nGrowth strategies to reference:\n${knowledgeSummary}` : ""}

If you need context, ask for the ONE thing you need most. Never ask 5 questions at once.`;

  try {
    const webhookRes = await fetch(
      "https://n8n.tasu.ai/webhook/04b43191-5e74-4bae-a981-9ef45ac94612",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          message,
          system_prompt: systemPrompt,
          history: history.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      }
    );

    if (!webhookRes.ok) {
      return NextResponse.json({ error: "Webhook error" }, { status: 500 });
    }

    const webhookData = await webhookRes.json();

    // n8n can return various shapes — try common fields
    const reply =
      webhookData?.reply ||
      webhookData?.text ||
      webhookData?.output ||
      webhookData?.message ||
      (typeof webhookData === "string" ? webhookData : null);

    if (reply) {
      return NextResponse.json({ reply });
    }

    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
