"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [context, setContext] = useState("");
  const [datafastKey, setDatafastKey] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [datafastConnected, setDatafastConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [integrationRequest, setIntegrationRequest] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: profile }, { data: integration }] = await Promise.all([
      supabase.from("profiles").select("website_url, business_context").eq("id", user.id).single(),
      supabase.from("integrations").select("datafast_api_key, github_repo_url, github_token").eq("user_id", user.id).single(),
    ]);

    if (profile) {
      setWebsiteUrl(profile.website_url || "");
      setContext(profile.business_context || "");
    }
    if (integration) {
      setDatafastKey(integration.datafast_api_key ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "");
      setDatafastConnected(!!integration.datafast_api_key);
      setGithubRepo(integration.github_repo_url || "");
      setGithubToken(integration.github_token ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "");
      setGithubConnected(!!integration.github_repo_url);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save profile
    await supabase.from("profiles").upsert({
      id: user.id,
      website_url: websiteUrl,
      business_context: context,
      updated_at: new Date().toISOString(),
    });

    // Save integrations
    const upsertData: Record<string, string> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
      github_repo_url: githubRepo,
    };
    if (datafastKey && !datafastKey.includes("\u2022")) {
      upsertData.datafast_api_key = datafastKey;
    }
    if (githubToken && !githubToken.includes("\u2022")) {
      upsertData.github_token = githubToken;
    }

    await supabase.from("integrations").upsert(upsertData);

    setSaving(false);
    setSaved(true);
    setDatafastConnected(!!datafastKey);
    setGithubConnected(!!githubRepo);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="animate-pulse space-y-4 max-w-xl">
          <div className="h-7 bg-cream-dark dark:bg-dark-border rounded w-32" />
          <div className="h-4 bg-cream-dark dark:bg-dark-border rounded w-64" />
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-3 py-2 rounded-lg border border-cream-dark dark:border-dark-border bg-white dark:bg-dark-bg text-charcoal dark:text-dark-text placeholder:text-warm-gray/40 dark:placeholder:text-dark-muted/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 text-sm transition";

  return (
    <div className="p-6 lg:p-10 max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-charcoal dark:text-dark-text mb-1">Settings</h1>
        <p className="text-xs text-warm-gray dark:text-dark-muted">
          We only read your data — never write, modify, or take admin actions on your accounts.
        </p>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-cream-dark dark:border-dark-border p-4 space-y-3">
        <p className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide">Business profile</p>
        <div>
          <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1">Website</label>
          <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yourstartup.com" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1">Business context</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="SaaS for indie devs, $29/mo, ~40 users, low trial conversion..."
          />
        </div>
      </div>

      {/* DataFast */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-cream-dark dark:border-dark-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide">DataFast — Revenue & Traffic</p>
          {datafastConnected && (
            <span className="text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Connected</span>
          )}
        </div>
        <p className="text-xs text-warm-gray dark:text-dark-muted leading-relaxed">
          Read-only access to your revenue, traffic, and conversion data.{" "}
          {!datafastConnected && (
            <>No account? <a href="https://datafa.st/?via=jeremy-lasne" target="_blank" rel="noopener noreferrer" className="text-terracotta hover:text-terracotta-dark font-medium">Sign up here</a></>
          )}
        </p>
        <div>
          <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1">API Key</label>
          <input
            type="password"
            value={datafastKey}
            onChange={(e) => setDatafastKey(e.target.value)}
            onFocus={() => { if (datafastKey.includes("\u2022")) setDatafastKey(""); }}
            placeholder="df_live_..."
            className={`${inputCls} font-mono`}
          />
          <p className="text-[11px] text-warm-gray/50 dark:text-dark-muted/50 mt-1">DataFast &rarr; Website settings &rarr; API tab</p>
        </div>
      </div>

      {/* GitHub */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-cream-dark dark:border-dark-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide">GitHub — Shipping activity</p>
          {githubConnected && (
            <span className="text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Connected</span>
          )}
        </div>
        <p className="text-xs text-warm-gray dark:text-dark-muted">Read-only. We track commits and push frequency — nothing else.</p>
        <div>
          <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1">Repository</label>
          <input type="text" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="owner/repo" className={`${inputCls} font-mono`} />
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal dark:text-dark-text mb-1">Token (private repos only)</label>
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            onFocus={() => { if (githubToken.includes("\u2022")) setGithubToken(""); }}
            placeholder="ghp_..."
            className={`${inputCls} font-mono`}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-charcoal dark:bg-terracotta hover:bg-charcoal/85 dark:hover:bg-terracotta-dark text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98]"
      >
        {saving ? "Saving..." : saved ? "Saved" : "Save all"}
      </button>

      {/* Request a new integration */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-cream-dark dark:border-dark-border p-4 space-y-3">
        <p className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide">Request a new integration</p>
        <p className="text-xs text-warm-gray dark:text-dark-muted leading-relaxed">
          Want Stripe, PostHog, or something else? Tell us what you need and we&apos;ll prioritize it.
        </p>
        <textarea
          value={integrationRequest}
          onChange={(e) => setIntegrationRequest(e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
          placeholder="e.g. Stripe for payment data, PostHog for product analytics..."
        />
        <button
          onClick={async () => {
            if (!integrationRequest.trim()) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from("integration_requests").insert({
              user_id: user.id,
              tool_name: integrationRequest.trim().split(/[\s,]/)[0],
              details: integrationRequest.trim(),
            });
            setRequestSent(true);
            setIntegrationRequest("");
            setTimeout(() => setRequestSent(false), 3000);
          }}
          disabled={!integrationRequest.trim() || requestSent}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-cream dark:bg-dark-border hover:bg-cream-dark dark:hover:bg-dark-muted/20 text-charcoal dark:text-dark-text border border-cream-dark dark:border-dark-border transition-all disabled:opacity-50"
        >
          {requestSent ? "Sent! We\u2019ll look into it." : "Send request"}
        </button>
      </div>
    </div>
  );
}
